import React, { useState } from 'react';
import Navbar from '../Components/Navbar';

const HomePage = () => {
  const [primaryHover, setPrimaryHover] = useState(false);
  const [secondaryHover, setSecondaryHover] = useState(false);

  const pageStyle = {
    minHeight: '100vh',
    backgroundColor: '#0b0f19',
    color: '#e6e6e6',
    fontFamily: "'Orbitron', sans-serif",
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '2rem',
    boxSizing: 'border-box',
  };

  const titleStyle = {
    fontSize: '3.5rem',
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: '0.1rem',
    marginBottom: '1.5rem',
    textShadow: '0 0 15px rgba(255, 255, 255, 0.2)',
  };

  const textContainerStyle = {
    maxWidth: '100%',
    margin: '0 auto 2.5rem auto',
  };

  const paragraphStyle = {
    fontSize: '1.1rem',
    lineHeight: '1.7',
    color: '#a9a9b3',
  };

  const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
  };

  const baseButtonStyle = {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    fontWeight: 'bold',
    border: '2px solid #ffffff',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  };

  const primaryButtonStyle = {
    ...baseButtonStyle,
    backgroundColor: primaryHover ? '#e6e6e6' : '#ffffff',
    color: '#0b0f19',
  };

  const secondaryButtonStyle = {
    ...baseButtonStyle,
    backgroundColor: secondaryHover ? '#ffffff' : 'transparent',
    color: secondaryHover ? '#0b0f19' : '#ffffff',
  };

  return (
    <>
    <Navbar />
    <div style={pageStyle}>
      <div style={{ width: '100%', margin: '0 auto', padding: '0' }}>
        <h1 style={titleStyle}>
          Explore the Cosmos
        </h1>

        <div style={textContainerStyle}>
          <p style={paragraphStyle}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget nunc ultricies
            tincidunt. Curabitur nec nisl eget justo cursus fermentum. Integer in justo euismod,
            facilisis quam vel, feugiat enim.
          </p>
        </div>

        <div style={buttonContainerStyle}>
          <button 
            style={primaryButtonStyle}
            onMouseEnter={() => setPrimaryHover(true)}
            onMouseLeave={() => setPrimaryHover(false)}
          >
            Launch Mission
          </button>
          <button 
            style={secondaryButtonStyle}
            onMouseEnter={() => setSecondaryHover(true)}
            onMouseLeave={() => setSecondaryHover(false)}
          >
            View Gallery
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default HomePage;
