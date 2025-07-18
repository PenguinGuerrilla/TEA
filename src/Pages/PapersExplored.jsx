import Navbar from '@/Components/Navbar'
import React from 'react'
import PapersTable from '@/Components/Table/PapersTable'

const PapersExplored = () => {
    return (
        <>
            <Navbar />
            <div style={{ padding: '15px', color: '#fff', backgroundColor: '#0b0f19', height: '100%', width: '100%' }}>
                <PapersTable />
            </div>
        </>
    )
}

export default PapersExplored