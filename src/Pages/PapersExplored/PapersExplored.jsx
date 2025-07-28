import Navbar from '@/Components/Navbar'
import React, { useState } from 'react'
import PapersTable from '@/Components/Table/PapersTable'
import Papa from 'papaparse';
import MainTable from '@/Components/Table/MainTable';
import columns from './columns';


const PapersExplored = () => {
    const [data, setData] = useState([]);
      const [isLoading, setIsLoading] = useState(true);
      const [isDataLoaded, setIsDataLoaded] = useState(false);
    
    
      React.useEffect(() => {
        const fetchData = async () => {
          setIsLoading(true);
          setIsDataLoaded(false);
          Papa.parse('/papers.csv', {
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
        console.log("Data fetched:", data);
      }, []);
    return (
        <>
            <Navbar />
            <div style={{ padding: '15px', color: '#fff', backgroundColor: '#0b0f19', height: '100%', width: '100%' }}>
                <MainTable data={data} columns={columns} isLoading={isLoading} isDataLoaded={isDataLoaded} />
            </div>
        </>
    )
}

export default PapersExplored