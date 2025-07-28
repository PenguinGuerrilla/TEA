import Navbar from '@/Components/Navbar'
import MainTable from '@/Components/Table/MainTable'
import React, { useState } from 'react'
import Papa from 'papaparse';
import columns from './columns';


const PlanetarySystemsData = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    React.useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setIsDataLoaded(false);
            Papa.parse('/PS_only_default_no_duplicates.csv', {
                download: true,
                header: true,
                complete: (results) => {
                    setData(results.data);
                    setIsDataLoaded(true);
                    setTimeout(() => {
                        setIsLoading(false);
                    }, 500); // Corresponds to animation duration
                },
                error: (error) => {
                    console.error("Error parsing CSV file:", error);
                    setIsLoading(false);
                }
            });
        };

        fetchData();
    }, []);
    return (
        <>
            <Navbar />
            <div style={{ padding: '15px', color: '#fff', backgroundColor: '#0b0f19', height: '100%', width: '100%' }}>
                <MainTable data={data} columns={columns} isDataLoaded={isDataLoaded} isLoading={isLoading}/>
            </div>
        </>
    )
}

export default PlanetarySystemsData