import Navbar from '@/Components/Navbar'
import MainTable from '@/Components/Table/MainTable'
import React, { useState } from 'react'
import Papa from 'papaparse';
import columns from './columns';
import { buildCombinedData } from '@/utils/buildCombinedData';

const parseCsv = (file) => new Promise((resolve) => {
    Papa.parse(file, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: (results) => resolve(results.data),
        error: (error) => {
            console.error(`Error parsing ${file}:`, error);
            resolve([]);
        },
    });
});

const CombinedData = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    React.useEffect(() => {
        let cancelled = false;
        setIsLoading(true);
        setIsDataLoaded(false);
        Promise.all([
            parseCsv('/cumulative_no_duplicates.csv'),
            parseCsv('/PS_only_default_no_duplicates.csv'),
        ]).then(([cumulative, ps]) => {
            if (cancelled) return;
            setData(buildCombinedData(cumulative, ps));
            setIsDataLoaded(true);
            setTimeout(() => setIsLoading(false), 500); // Corresponds to animation duration
        });
        return () => { cancelled = true; };
    }, []);

    return (
        <>
            <Navbar />
            <div style={{ padding: '15px', color: '#fff', backgroundColor: '#0b0f19', height: '100%', width: '100%' }}>
                <MainTable data={data} columns={columns} isDataLoaded={isDataLoaded} isLoading={isLoading} title={"Combined Data"} />
            </div>
        </>
    )
}

export default CombinedData
