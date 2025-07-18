import Navbar from '@/Components/Navbar'
import CumulativeTable from '@/Components/Table/CumulativeTable'
import React from 'react'

const CumulativeKeplerData = () => {
    return (
        <>
            <Navbar />
            <div style={{ padding: '15px', color: '#fff', backgroundColor: '#0b0f19', height: '100%' , width: '100%' }}>
                <CumulativeTable />
            </div>
        </>
    )
}

export default CumulativeKeplerData