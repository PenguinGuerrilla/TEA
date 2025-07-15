import React, { useState } from 'react';
import Navbar from '../Components/Navbar';
import Particles from '@/blocks/Backgrounds/Particles/Particles';
import { Navigate, useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [primaryHover, setPrimaryHover] = useState(false);
  const [secondaryHover, setSecondaryHover] = useState(false);
  const navigate = useNavigate();

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
    color: '#ffffff',
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
      <div style={{ position: 'relative', backgroundColor: '#0b0f19' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
          <Particles
            particleColors={['#ffffff']}
            particleCount={400}
            particleSpread={10}
            speed={0.1}
            particleBaseSize={100}
            moveParticlesOnHover={true}
            alphaParticles={false}
            disableRotation={false}
          />
        </div>
        <div style={{...pageStyle, position: 'relative', zIndex: 2, backgroundColor: 'transparent' }}>
          <div style={{ width: '80%', margin: '0 auto', padding: '0' }}>
            <h1 style={titleStyle}>
              Welcome to The Exomoon Archive!
            </h1>

            <div style={textContainerStyle}>
              <p style={paragraphStyle}>
                The exomoon archive is a comprehensive dataset of exoplantes analyzed as potential hosts for exomoons.
                This archive is designed to facilitate research and exploration in the field of exoplanetary science
                providing a valuable resource for scientists and enthusiasts alike.
              </p>
            </div>

            <div style={buttonContainerStyle}>
              <button
                style={primaryButtonStyle}
                onMouseEnter={() => setPrimaryHover(true)}
                onMouseLeave={() => setPrimaryHover(false)}
                onClick={() => navigate('/cumulative')}
              >
                Explore the Data
              </button>
              <button
                style={secondaryButtonStyle}
                onMouseEnter={() => setSecondaryHover(true)}
                onMouseLeave={() => setSecondaryHover(false)}
                onClick={() => navigate('/about')}
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default HomePage;
