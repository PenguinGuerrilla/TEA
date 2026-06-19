import Navbar from '@/Components/Navbar'
import React, { useState, useEffect, useMemo, useRef } from 'react'
import Papa from 'papaparse';
import Plotly from 'plotly.js-dist-min';
import createPlotlyComponent from 'react-plotly.js/factory';
import { getColumnLabel } from './columnLabels';

const Plot = createPlotlyComponent(Plotly);

const DATASETS = {
    cumulative: {
        label: 'Cumulative Kepler Data',
        file: '/cumulative_no_duplicates.csv',
        backgroundFile: '/AllNEAData/cumulative_background.csv',
        idKey: 'kepoi_name',
    },
    ps: {
        label: 'Planetary Systems Data',
        file: '/PS_only_default_no_duplicates.csv',
        backgroundFile: '/AllNEAData/ps_background.csv',
        idKey: 'pl_name',
    },
};

const CANDIDATE_COLOR = '#6366f1';
const BACKGROUND_COLOR = '#9ca3af';

// Columns that hold HTML/reference strings — never useful for plotting
const EXCLUDED_COLUMNS = new Set([
    'exomoon_reference', 'pl_refname', 'st_refname', 'sy_refname',
    'koi_tce_delivname', 'rastr', 'decstr', 'rowupdate', 'pl_pubdate', 'releasedate',
]);

const PLOT_TYPES = [
    { value: 'scatter', label: 'Scatter' },
    { value: 'histogram', label: 'Histogram (X only)' },
    { value: 'box', label: 'Box (Y grouped by X)' },
    { value: 'line', label: 'Line (count over X)' },
    { value: 'bar', label: 'Bar (count by category)' },
];

const CATEGORICAL_X_TYPES = new Set(['box', 'bar']);
const COUNT_TYPES = new Set(['line', 'bar', 'histogram']);

const toNumber = (value) => {
    if (value === null || value === undefined) return NaN;
    const trimmed = String(value).trim();
    if (trimmed === '') return NaN;
    return Number(trimmed);
};

const analyzeColumns = (rows) => {
    if (!rows.length) return { numeric: [], categorical: [] };
    const columns = Object.keys(rows[0]).filter((c) => c && !EXCLUDED_COLUMNS.has(c));
    const numeric = [];
    const categorical = [];
    columns.forEach((col) => {
        let nonEmpty = 0;
        let numericCount = 0;
        const uniques = new Set();
        rows.forEach((row) => {
            const raw = row[col];
            if (raw === null || raw === undefined || String(raw).trim() === '') return;
            nonEmpty++;
            uniques.add(raw);
            if (Number.isFinite(toNumber(raw))) numericCount++;
        });
        if (nonEmpty === 0) return;
        if (numericCount / nonEmpty > 0.9) {
            numeric.push(col);
            if (uniques.size <= 12) categorical.push(col);
        } else if (uniques.size <= 30) {
            categorical.push(col);
        }
    });
    return { numeric, categorical };
};

const selectStyle = {
    width: '100%',
    padding: '8px 10px',
    backgroundColor: '#111827',
    color: '#fff',
    border: '1px solid #374151',
    borderRadius: '6px',
    fontSize: '0.9rem',
    outline: 'none',
};

const labelStyle = {
    display: 'block',
    marginBottom: '4px',
    fontSize: '0.8rem',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
};

const fieldStyle = { marginBottom: '16px' };

const checkboxLabelStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#d1d5db',
    fontSize: '0.9rem',
    cursor: 'pointer',
    marginBottom: '8px',
};

const buttonStyle = {
    width: '100%',
    padding: '9px 12px',
    backgroundColor: '#4f46e5',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '8px',
};

const Statistics = () => {
    const [datasetKey, setDatasetKey] = useState('cumulative');
    const [allData, setAllData] = useState({ cumulative: null, ps: null });
    const [isLoading, setIsLoading] = useState(true);
    const [xCol, setXCol] = useState('');
    const [yCol, setYCol] = useState('');
    const [colorCol, setColorCol] = useState('');
    const [plotType, setPlotType] = useState('scatter');
    const [logX, setLogX] = useState(false);
    const [logY, setLogY] = useState(false);
    const [cumulativeCount, setCumulativeCount] = useState(false);
    const [showBackground, setShowBackground] = useState(false);
    const [backgroundData, setBackgroundData] = useState({ cumulative: null, ps: null });
    const [isBackgroundLoading, setIsBackgroundLoading] = useState(false);
    const plotRef = useRef(null);

    useEffect(() => {
        let cancelled = false;
        const load = (key) => new Promise((resolve) => {
            Papa.parse(DATASETS[key].file, {
                download: true,
                header: true,
                skipEmptyLines: true,
                complete: (results) => resolve(results.data),
                error: (error) => {
                    console.error(`Error parsing ${DATASETS[key].file}:`, error);
                    resolve([]);
                },
            });
        });
        Promise.all([load('cumulative'), load('ps')]).then(([cumulative, ps]) => {
            if (cancelled) return;
            setAllData({ cumulative, ps });
            setIsLoading(false);
        });
        return () => { cancelled = true; };
    }, []);

    // Lazy-load background NEA data the first time it's requested per dataset
    useEffect(() => {
        if (!showBackground || backgroundData[datasetKey]) return;
        setIsBackgroundLoading(true);
        Papa.parse(DATASETS[datasetKey].backgroundFile, {
            download: true,
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                setBackgroundData((prev) => ({ ...prev, [datasetKey]: results.data }));
                setIsBackgroundLoading(false);
            },
            error: (error) => {
                console.error(`Error parsing ${DATASETS[datasetKey].backgroundFile}:`, error);
                setIsBackgroundLoading(false);
            },
        });
    }, [showBackground, datasetKey, backgroundData]);

    const rows = allData[datasetKey] || [];
    const { numeric, categorical } = useMemo(() => analyzeColumns(rows), [rows]);

    // Reset selections when dataset changes
    useEffect(() => {
        if (!numeric.length) return;
        setXCol((prev) => (numeric.includes(prev) ? prev : numeric[0]));
        setYCol((prev) => (numeric.includes(prev) ? prev : numeric[1] || numeric[0]));
        setColorCol((prev) => (categorical.includes(prev) ? prev : ''));
    }, [numeric, categorical]);

    const xOptions = CATEGORICAL_X_TYPES.has(plotType) ? categorical : numeric;

    useEffect(() => {
        if (xOptions.length && !xOptions.includes(xCol)) setXCol(xOptions[0]);
    }, [xOptions, xCol]);

    const { traces, pointCount, bgPointCount } = useMemo(() => {
        if (!rows.length || !xCol) return { traces: [], pointCount: 0, bgPointCount: 0 };

        // Background rows, minus planets already in the candidate dataset
        let bgRows = [];
        if (showBackground && backgroundData[datasetKey]) {
            const idKey = DATASETS[datasetKey].idKey;
            const candidateIds = new Set(rows.map((r) => r[idKey]).filter(Boolean));
            bgRows = backgroundData[datasetKey].filter((r) => !candidateIds.has(r[idKey]));
        }
        const hasBg = bgRows.length > 0;

        if (plotType === 'line') {
            // Count of planets per X value (e.g. discoveries per year)
            const countByX = (sourceRows) => {
                const counts = new Map();
                sourceRows.forEach((r) => {
                    const x = toNumber(r[xCol]);
                    if (!Number.isFinite(x)) return;
                    counts.set(x, (counts.get(x) || 0) + 1);
                });
                const xs = [...counts.keys()].sort((a, b) => a - b);
                let running = 0;
                const ys = xs.map((x) => {
                    running += counts.get(x);
                    return cumulativeCount ? running : counts.get(x);
                });
                return { xs, ys, total: running };
            };
            const makeLine = (name, { xs, ys }, color) => ({
                type: 'scatter',
                mode: 'lines+markers',
                name,
                x: xs,
                y: ys,
                line: { color, width: 2 },
                marker: { color, size: 6 },
                hovertemplate: `${getColumnLabel(xCol)}: %{x}<br>${cumulativeCount ? 'Cumulative count' : 'Count'}: %{y}<extra>${name}</extra>`,
            });
            const cand = countByX(rows);
            const traces = [];
            let bgTotal = 0;
            if (hasBg) {
                const bg = countByX(bgRows);
                bgTotal = bg.total;
                traces.push(makeLine('All NEA exoplanets', bg, BACKGROUND_COLOR));
            }
            traces.push(makeLine(hasBg ? 'Exomoon candidates' : '', cand, CANDIDATE_COLOR));
            return { traces, pointCount: cand.total, bgPointCount: bgTotal };
        }

        if (plotType === 'bar') {
            // Count of planets per category, sorted by candidate count
            const countByCat = (sourceRows) => {
                const counts = new Map();
                let total = 0;
                sourceRows.forEach((r) => {
                    const g = String(r[xCol] ?? '').trim();
                    if (!g) return;
                    counts.set(g, (counts.get(g) || 0) + 1);
                    total++;
                });
                return { counts, total };
            };
            const cand = countByCat(rows);
            const bg = hasBg ? countByCat(bgRows) : null;
            const cats = [...new Set([...cand.counts.keys(), ...(bg ? bg.counts.keys() : [])])]
                .sort((a, b) => (cand.counts.get(b) || 0) - (cand.counts.get(a) || 0));
            // Normalize to fractions when comparing: totals differ by orders of magnitude
            const makeBar = (name, { counts, total }, color) => ({
                type: 'bar',
                name,
                x: cats,
                y: cats.map((c) => (bg ? (counts.get(c) || 0) / total : (counts.get(c) || 0))),
                marker: { color },
                hovertemplate: `%{x}<br>${bg ? 'Fraction' : 'Count'}: %{y}<extra>${name}</extra>`,
            });
            const traces = [];
            if (bg) traces.push(makeBar('All NEA exoplanets', bg, BACKGROUND_COLOR));
            traces.push(makeBar(bg ? 'Exomoon candidates' : '', cand, CANDIDATE_COLOR));
            return { traces, pointCount: cand.total, bgPointCount: bg ? bg.total : 0 };
        }

        if (plotType === 'histogram') {
            const xs = rows.map((r) => toNumber(r[xCol])).filter(Number.isFinite);
            const bgXs = bgRows.map((r) => toNumber(r[xCol])).filter(Number.isFinite);
            const traces = [];
            if (hasBg) {
                // Normalize when overlaying: counts differ by orders of magnitude
                traces.push({
                    type: 'histogram',
                    x: bgXs,
                    name: 'All NEA exoplanets',
                    marker: { color: BACKGROUND_COLOR },
                    opacity: 0.55,
                    histnorm: 'probability',
                });
            }
            traces.push({
                type: 'histogram',
                x: xs,
                name: hasBg ? 'Exomoon candidates' : '',
                marker: { color: CANDIDATE_COLOR },
                opacity: hasBg ? 0.7 : 1,
                histnorm: hasBg ? 'probability' : '',
            });
            return { traces, pointCount: xs.length, bgPointCount: bgXs.length };
        }

        if (plotType === 'box') {
            const collect = (sourceRows) => {
                const xs = [];
                const ys = [];
                sourceRows.forEach((r) => {
                    const g = String(r[xCol] ?? '').trim();
                    const y = toNumber(r[yCol]);
                    if (!g || !Number.isFinite(y)) return;
                    xs.push(g);
                    ys.push(y);
                });
                return { xs, ys };
            };
            const cand = collect(rows);
            if (!hasBg) {
                const groups = {};
                cand.xs.forEach((g, i) => { (groups[g] = groups[g] || []).push(cand.ys[i]); });
                return {
                    traces: Object.entries(groups).map(([name, ys]) => ({
                        type: 'box',
                        name,
                        y: ys,
                        boxpoints: 'outliers',
                    })),
                    pointCount: cand.ys.length,
                    bgPointCount: 0,
                };
            }
            const bg = collect(bgRows);
            return {
                traces: [
                    {
                        type: 'box',
                        name: 'All NEA exoplanets',
                        x: bg.xs,
                        y: bg.ys,
                        boxpoints: 'outliers',
                        marker: { color: BACKGROUND_COLOR },
                    },
                    {
                        type: 'box',
                        name: 'Exomoon candidates',
                        x: cand.xs,
                        y: cand.ys,
                        boxpoints: 'outliers',
                        marker: { color: CANDIDATE_COLOR },
                    },
                ],
                pointCount: cand.ys.length,
                bgPointCount: bg.ys.length,
            };
        }

        // scatter
        const makeTrace = (name, pts) => ({
            type: 'scattergl',
            mode: 'markers',
            name,
            x: pts.map((p) => p.x),
            y: pts.map((p) => p.y),
            text: pts.map((p) => p.label),
            hovertemplate: `%{text}<br>${getColumnLabel(xCol)}: %{x}<br>${getColumnLabel(yCol)}: %{y}<extra>${name}</extra>`,
            marker: { size: 7, opacity: 0.75 },
        });
        const collectPoints = (sourceRows) => {
            if (!sourceRows.length) return [];
            const labelKey = sourceRows[0].pl_name !== undefined ? 'pl_name'
                : sourceRows[0].kepler_name !== undefined ? 'kepler_name' : null;
            const fallbackKey = sourceRows[0].kepoi_name !== undefined ? 'kepoi_name'
                : sourceRows[0].hostname !== undefined ? 'hostname' : null;
            const points = [];
            sourceRows.forEach((r) => {
                const x = toNumber(r[xCol]);
                const y = toNumber(r[yCol]);
                if (!Number.isFinite(x) || !Number.isFinite(y)) return;
                const label = (labelKey && r[labelKey]) || (fallbackKey && r[fallbackKey]) || '';
                points.push({ x, y, label, group: colorCol ? String(r[colorCol] ?? '').trim() || 'N/A' : null });
            });
            return points;
        };
        const points = collectPoints(rows);
        const bgPoints = collectPoints(bgRows);
        const scatterTraces = [];
        if (hasBg) {
            // Background drawn first so candidates render on top
            scatterTraces.push({
                ...makeTrace('All NEA exoplanets', bgPoints),
                marker: { size: 5, opacity: 0.35, color: BACKGROUND_COLOR },
            });
        }
        if (colorCol) {
            const groups = {};
            points.forEach((p) => { (groups[p.group] = groups[p.group] || []).push(p); });
            Object.entries(groups).forEach(([name, pts]) => scatterTraces.push(makeTrace(name, pts)));
        } else {
            scatterTraces.push({
                ...makeTrace(hasBg ? 'Exomoon candidates' : '', points),
                marker: { size: 7, opacity: 0.85, color: CANDIDATE_COLOR },
            });
        }
        return { traces: scatterTraces, pointCount: points.length, bgPointCount: bgPoints.length };
    }, [rows, xCol, yCol, colorCol, plotType, showBackground, backgroundData, datasetKey, cumulativeCount]);

    const layout = useMemo(() => ({
        title: {
            text: plotType === 'histogram'
                ? `Distribution of ${getColumnLabel(xCol)}`
                : plotType === 'line'
                    ? `${cumulativeCount ? 'Cumulative count' : 'Count'} by ${getColumnLabel(xCol)}`
                    : plotType === 'bar'
                        ? `Count by ${getColumnLabel(xCol)}`
                        : `${getColumnLabel(yCol)} vs ${getColumnLabel(xCol)}`,
            font: { color: '#fff', size: 18 },
        },
        paper_bgcolor: '#0b0f19',
        plot_bgcolor: '#111827',
        font: { color: '#d1d5db' },
        xaxis: {
            title: { text: getColumnLabel(xCol) },
            type: logX && !CATEGORICAL_X_TYPES.has(plotType) ? 'log' : undefined,
            gridcolor: '#1f2937',
            zerolinecolor: '#374151',
        },
        yaxis: {
            title: {
                text: plotType === 'histogram'
                    ? (bgPointCount > 0 ? 'Fraction' : 'Count')
                    : plotType === 'bar'
                        ? (bgPointCount > 0 ? 'Fraction' : 'Count')
                        : plotType === 'line'
                            ? (cumulativeCount ? 'Cumulative count' : 'Count')
                            : getColumnLabel(yCol),
            },
            type: logY ? 'log' : undefined,
            gridcolor: '#1f2937',
            zerolinecolor: '#374151',
        },
        barmode: bgPointCount > 0 && plotType === 'histogram' ? 'overlay'
            : bgPointCount > 0 && plotType === 'bar' ? 'group' : undefined,
        boxmode: plotType === 'box' && bgPointCount > 0 ? 'group' : undefined,
        legend: { bgcolor: 'rgba(0,0,0,0)' },
        autosize: true,
        margin: { l: 70, r: 30, t: 60, b: 60 },
    }), [xCol, yCol, plotType, logX, logY, bgPointCount, cumulativeCount]);

    const exportImage = (format) => {
        const gd = plotRef.current?.el;
        if (!gd) return;
        const name = plotType === 'histogram' ? `hist_${xCol}`
            : COUNT_TYPES.has(plotType) ? `count_by_${xCol}`
                : `${yCol}_vs_${xCol}`;
        Plotly.downloadImage(gd, {
            format,
            width: 1400,
            height: 900,
            scale: format === 'png' ? 2 : 1,
            filename: `${datasetKey}_${name}`,
        });
    };

    const needsY = !COUNT_TYPES.has(plotType);

    return (
        <>
            <Navbar />
            <div style={{ padding: '15px', color: '#fff', backgroundColor: '#0b0f19', minHeight: 'calc(100vh - 83px)', width: '100%' }}>
                {isLoading ? (
                    <p style={{ textAlign: 'center', marginTop: '4rem', color: '#9ca3af' }}>Loading data...</p>
                ) : (
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                        <div style={{
                            flex: '0 0 280px',
                            backgroundColor: '#0f1424',
                            border: '1px solid #1f2937',
                            borderRadius: '10px',
                            padding: '20px',
                        }}>
                            <h2 style={{ margin: '0 0 16px', fontSize: '1.1rem' }}>Plot Settings</h2>

                            <div style={fieldStyle}>
                                <label style={labelStyle}>Dataset</label>
                                <select style={selectStyle} value={datasetKey} onChange={(e) => setDatasetKey(e.target.value)}>
                                    {Object.entries(DATASETS).map(([key, d]) => (
                                        <option key={key} value={key}>{d.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div style={fieldStyle}>
                                <label style={labelStyle}>Plot Type</label>
                                <select style={selectStyle} value={plotType} onChange={(e) => setPlotType(e.target.value)}>
                                    {PLOT_TYPES.map((t) => (
                                        <option key={t.value} value={t.value}>{t.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div style={fieldStyle}>
                                <label style={labelStyle}>X Axis {CATEGORICAL_X_TYPES.has(plotType) ? '(category)' : ''}</label>
                                <select style={selectStyle} value={xCol} onChange={(e) => setXCol(e.target.value)}>
                                    {xOptions.map((c) => <option key={c} value={c}>{getColumnLabel(c)}</option>)}
                                </select>
                            </div>

                            {needsY && (
                                <div style={fieldStyle}>
                                    <label style={labelStyle}>Y Axis</label>
                                    <select style={selectStyle} value={yCol} onChange={(e) => setYCol(e.target.value)}>
                                        {numeric.map((c) => <option key={c} value={c}>{getColumnLabel(c)}</option>)}
                                    </select>
                                </div>
                            )}

                            {plotType === 'scatter' && (
                                <div style={fieldStyle}>
                                    <label style={labelStyle}>Color By (optional)</label>
                                    <select style={selectStyle} value={colorCol} onChange={(e) => setColorCol(e.target.value)}>
                                        <option value="">None</option>
                                        {categorical.map((c) => <option key={c} value={c}>{getColumnLabel(c)}</option>)}
                                    </select>
                                </div>
                            )}

                            <div style={fieldStyle}>
                                <label style={checkboxLabelStyle}>
                                    <input
                                        type="checkbox"
                                        checked={showBackground}
                                        onChange={(e) => setShowBackground(e.target.checked)}
                                    />
                                    Compare with all NEA exoplanets
                                </label>
                                {isBackgroundLoading && (
                                    <p style={{ margin: '0 0 8px', fontSize: '0.8rem', color: '#9ca3af' }}>
                                        Loading NEA data...
                                    </p>
                                )}
                                {plotType === 'line' && (
                                    <label style={checkboxLabelStyle}>
                                        <input
                                            type="checkbox"
                                            checked={cumulativeCount}
                                            onChange={(e) => setCumulativeCount(e.target.checked)}
                                        />
                                        Cumulative count
                                    </label>
                                )}
                                {!CATEGORICAL_X_TYPES.has(plotType) && (
                                    <label style={checkboxLabelStyle}>
                                        <input type="checkbox" checked={logX} onChange={(e) => setLogX(e.target.checked)} />
                                        Log scale X
                                    </label>
                                )}
                                {plotType !== 'bar' && (
                                    <label style={checkboxLabelStyle}>
                                        <input type="checkbox" checked={logY} onChange={(e) => setLogY(e.target.checked)} />
                                        Log scale Y
                                    </label>
                                )}
                            </div>

                            <div style={{ borderTop: '1px solid #1f2937', paddingTop: '16px' }}>
                                <label style={labelStyle}>Export</label>
                                <button style={buttonStyle} onClick={() => exportImage('png')}>Download PNG</button>
                                <button style={{ ...buttonStyle, backgroundColor: '#374151' }} onClick={() => exportImage('svg')}>Download SVG</button>
                            </div>

                            <p style={{ marginTop: '12px', fontSize: '0.8rem', color: '#6b7280' }}>
                                {pointCount} candidate points plotted ({rows.length} rows in dataset)
                                {bgPointCount > 0 && <><br />{bgPointCount} NEA background points</>}
                            </p>
                        </div>

                        <div style={{
                            flex: '1 1 600px',
                            minWidth: '300px',
                            backgroundColor: '#0f1424',
                            border: '1px solid #1f2937',
                            borderRadius: '10px',
                            padding: '10px',
                        }}>
                            <Plot
                                ref={plotRef}
                                data={traces}
                                layout={layout}
                                useResizeHandler
                                style={{ width: '100%', height: '75vh' }}
                                config={{
                                    responsive: true,
                                    displaylogo: false,
                                    toImageButtonOptions: { format: 'png', scale: 2 },
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Statistics;
