import Navbar from '@/Components/Navbar'
import MainTable from '@/Components/Table/MainTable'
import React, { useState, useEffect, useMemo } from 'react'
import Papa from 'papaparse';
import { getPredictionColumns } from './columns';

const MODELS = {
    kepler: { label: 'Kepler (primary)', file: '/predictions/kepler_predictions.csv', metrics: '/predictions/kepler_metrics.json' },
    ps: { label: 'Planetary Systems', file: '/predictions/ps_predictions.csv', metrics: '/predictions/ps_metrics.json' },
    combined: { label: 'Combined', file: '/predictions/combined_predictions.csv', metrics: '/predictions/combined_metrics.json' },
};

const selectStyle = {
    padding: '8px 10px', backgroundColor: '#111827', color: '#fff',
    border: '1px solid #374151', borderRadius: '6px', fontSize: '0.9rem', outline: 'none',
};

const Predictions = () => {
    const [model, setModel] = useState('kepler');
    const [data, setData] = useState([]);
    const [metrics, setMetrics] = useState(null);
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
        return () => { cancelled = true; };
    }, [model]);

    const columns = useMemo(() => getPredictionColumns(model), [model]);
    const rows = useMemo(
        () => (hideKnown ? data.filter((r) => Number(r.is_known_candidate) !== 1) : data),
        [data, hideKnown],
    );

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

                <MainTable data={rows} columns={columns} isDataLoaded={isDataLoaded} isLoading={isLoading} title={`Predicted Exomoon Candidates — ${MODELS[model].label}`} />
            </div>
        </>
    );
};

export default Predictions;
