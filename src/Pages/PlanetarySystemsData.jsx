import Navbar from '@/Components/Navbar'
import PsTable from '@/Components/Table/PsTable'
import React from 'react'

const PlanetarySystemsData = () => {
  return (
        <>
            <Navbar />
            <div style={{ padding: '15px', color: '#fff', backgroundColor: '#0b0f19', height: '100%' , width: '100%' }}>
                <PsTable />
            </div>
        </>
    )
}

export default PlanetarySystemsData