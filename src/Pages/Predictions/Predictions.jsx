import Navbar from '@/Components/Navbar'
import MainTable from '@/Components/Table/MainTable'
import React, { useState, useEffect, useMemo } from 'react'
import Papa from 'papaparse';
import Plotly from 'plotly.js-dist-min';
import createPlotlyComponent from 'react-plotly.js/factory';
import { getPredictionColumns } from './columns';
import { getColumnLabel } from '@/Pages/Statistics/columnLabels';

const Plot = createPlotlyComponent(Plotly);

const MODELS = {
    kepler: { label: 'Kepler (primary)', file: '/predictions/kepler_predictions.csv', metrics: '/predictions/kepler_metrics.json', importance: '/predictions/kepler_importance.csv' },
    ps: { label: 'Planetary Systems', file: '/predictions/ps_predictions.csv', metrics: '/predictions/ps_metrics.json', importance: '/predictions/ps_importance.csv' },
    combined: { label: 'Combined', file: '/predictions/combined_predictions.csv', metrics: '/predictions/combined_metrics.json', importance: '/predictions/combined_importance.csv' },
};

const POS_COLOR = '#6366f1';   // higher value -> more candidate-like
const NEG_COLOR = '#f59e0b';   // higher value -> less candidate-like

const selectStyle = {
    padding: '8px 10px', backgroundColor: '#111827', color: '#fff',
    border: '1px solid #374151', borderRadius: '6px', fontSize: '0.9rem', outline: 'none',
};

const Predictions = () => {
    const [model, setModel] = useState('kepler');
    const [data, setData] = useState([]);
    const [metrics, setMetrics] = useState(null);
    const [importance, setImportance] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [hideKnown, setHideKnown] = useState(false);

    useEffect(() => {
        let cancelled = false;
        setIsLoading(true);
        setIsDataLoaded(false);
        Papa.parse(MODELS[model].file, {
            download: true,
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            complete: (results) => {
                if (cancelled) return;
                setData(results.data);
                setIsDataLoaded(true);
                setTimeout(() => setIsLoading(false), 500);
            },
            error: (error) => {
                console.error('Error parsing predictions:', error);
                setIsLoading(false);
            },
        });
        fetch(MODELS[model].metrics)
            .then((r) => r.json())
            .then((m) => { if (!cancelled) setMetrics(m); })
            .catch(() => { if (!cancelled) setMetrics(null); });
        Papa.parse(MODELS[model].importance, {
            download: true,
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            complete: (results) => { if (!cancelled) setImportance(results.data); },
            error: () => { if (!cancelled) setImportance([]); },
        });
        return () => { cancelled = true; };
    }, [model]);

    const columns = useMemo(() => getPredictionColumns(model), [model]);
    const rows = useMemo(
        () => (hideKnown ? data.filter((r) => Number(r.is_known_candidate) !== 1) : data),
        [data, hideKnown],
    );

    // Horizontal importance bar chart: highest contribution at the top, bars
    // colored by direction (does a higher value make a planet more candidate-like?).
    const importancePlot = useMemo(() => {
        const valid = importance.filter((r) => r && r.feature);
        if (!valid.length) return null;
        // CSV is rank-sorted desc; reverse so rank 1 sits at the top of an h-bar.
        const ordered = [...valid].reverse();
        const labels = ordered.map((r) => getColumnLabel(r.feature) + (Number(r.non_physical) === 1 ? ' *' : ''));
        // Signed by direction: negative-correlation features extend left, so the
        // bar's side encodes direction and its length encodes magnitude.
        const signed = ordered.map((r) => (Number(r.direction) >= 0 ? 1 : -1) * r.importance_pct);
        const maxAbs = Math.max(1, ...signed.map((v) => Math.abs(v)));
        const trace = {
            type: 'bar',
            orientation: 'h',
            x: signed,
            y: labels,
            marker: { color: ordered.map((r) => (Number(r.direction) >= 0 ? POS_COLOR : NEG_COLOR)) },
            customdata: ordered.map((r) => [r.importance_pct, Number(r.direction)]),
            hovertemplate: '%{y}<br>Contribution: %{customdata[0]:.1f}%<br>Direction (Spearman): %{customdata[1]:.2f}<extra></extra>',
        };
        const layout = {
            title: { text: 'Feature importance — what defines a candidate', font: { color: '#fff', size: 16 } },
            paper_bgcolor: '#0f1424',
            plot_bgcolor: '#0f1424',
            font: { color: '#d1d5db' },
            xaxis: {
                title: { text: '← less candidate-like      % contribution      more candidate-like →' },
                range: [-maxAbs * 1.1, maxAbs * 1.1],
                gridcolor: '#1f2937',
                zerolinecolor: '#6b7280',
                zerolinewidth: 2,
            },
            yaxis: { automargin: true },
            margin: { l: 10, r: 20, t: 50, b: 50 },
            height: Math.max(260, 34 * ordered.length + 90),
        };
        return { trace, layout };
    }, [importance]);

    return (
        <>
            <Navbar />
            <div style={{ padding: '15px', color: '#fff', backgroundColor: '#0b0f19', minHeight: 'calc(100vh - 83px)', width: '100%' }}>
                {/* PU framing caveat */}
                <div style={{
                    backgroundColor: '#0f1424', border: '1px solid #312e81', borderRadius: '10px',
                    padding: '14px 18px', marginBottom: '16px', fontSize: '0.9rem', color: '#c7d2fe',
                }}>
                    <strong>How to read this:</strong> models are trained with positive-unlabeled learning on
                    the planets that have been <em>studied</em> as exomoon hosts. The score ranks how much a
                    planet resembles a good exomoon <strong>search target</strong> (long period, large radius,
                    high transit SNR, quiet star) — it is <strong>not</strong> a moon detection. "New
                    prediction" rows are high-scoring planets not yet in the curated candidate list.
                </div>

                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '0.8rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Model</label>
                        <select style={selectStyle} value={model} onChange={(e) => setModel(e.target.value)}>
                            {Object.entries(MODELS).map(([key, m]) => (
                                <option key={key} value={key}>{m.label}</option>
                            ))}
                        </select>
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d1d5db', fontSize: '0.9rem', cursor: 'pointer', marginTop: '18px' }}>
                        <input type="checkbox" checked={hideKnown} onChange={(e) => setHideKnown(e.target.checked)} />
                        Hide known candidates
                    </label>
                    {metrics && (
                        <div style={{ marginTop: '18px', fontSize: '0.8rem', color: '#6b7280' }}>
                            {metrics.n_positive} known candidates · recall@top-decile{' '}
                            <span style={{ color: '#a5b4fc' }}>{(metrics.recall_at_top_decile * 100).toFixed(0)}%</span>
                            {' '}· positives median score{' '}
                            <span style={{ color: '#a5b4fc' }}>{metrics.positive_median_score}</span>
                            {' '}vs unlabeled{' '}
                            <span style={{ color: '#9ca3af' }}>{metrics.unlabeled_median_score}</span>
                        </div>
                    )}
                </div>

                {importancePlot && (
                    <div style={{
                        backgroundColor: '#0f1424', border: '1px solid #1f2937', borderRadius: '10px',
                        padding: '10px 14px', marginBottom: '16px',
                    }}>
                        <Plot
                            data={[importancePlot.trace]}
                            layout={importancePlot.layout}
                            useResizeHandler
                            style={{ width: '100%' }}
                            config={{ responsive: true, displaylogo: false, displayModeBar: false }}
                        />
                        <p style={{ margin: '4px 6px 6px', fontSize: '0.8rem', color: '#9ca3af' }}>
                            Bar length = how much the feature drives the model. Side &amp; color = direction:{' '}
                            <span style={{ color: POS_COLOR }}>■ right</span> higher value → more candidate-like,{' '}
                            <span style={{ color: NEG_COLOR }}>■ left</span> higher value → less candidate-like.{' '}
                            <span style={{ color: '#6b7280' }}>* not a physical property (pipeline artifact).</span>
                        </p>
                    </div>
                )}

                <MainTable data={rows} columns={columns} isDataLoaded={isDataLoaded} isLoading={isLoading} title={`Predicted Exomoon Candidates — ${MODELS[model].label}`} />
            </div>
        </>
    );
};

export default Predictions;
