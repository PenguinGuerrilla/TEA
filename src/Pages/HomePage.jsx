import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../Components/Navbar';
import Particles from '@/blocks/Backgrounds/Particles/Particles';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';

const HomePage = () => {
  const [primaryHover, setPrimaryHover] = useState(false);
  const [secondaryHover, setSecondaryHover] = useState(false);
  const navigate = useNavigate();
  const [showSecondDiv, setShowSecondDiv] = useState(false);
  const secondDivRef = useRef(null);
  const [keplerData, setKeplerData] = useState([]);
  const [psData, setPsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (secondDivRef.current) {
        const { top } = secondDivRef.current.getBoundingClientRect();
        if (top < window.innerHeight / 2) {
          setShowSecondDiv(true);
        } else {
          setShowSecondDiv(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setIsDataLoaded(false);
      Papa.parse('/cumulative_no_duplicates.csv', {
        download: true,
        header: true,
        complete: (results) => {
          setKeplerData(results.data);
        },
        error: (error) => {
          console.error("Error parsing CSV file:", error);
        }
      });
      Papa.parse('/PS_only_default_no_duplicates.csv', {
        download: true,
        header: true,
        complete: (results) => {
          setPsData(results.data);
        },
        error: (error) => {
          console.error("Error parsing CSV file:", error);
        }
      });
      setIsDataLoaded(true);
      setIsLoading(false);
    };

    fetchData();
  }, []);


  const pageStyle = {
    minHeight: '100vh',
    backgroundColor: 'transparent',
    color: '#e6e6e6',
    fontFamily: "'Orbitron', sans-serif",
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '2rem',
    boxSizing: 'border-box',
    transition: 'opacity 0.5s ease-in-out',
    position: 'relative',
    zIndex: 1,
  };

  const titleStyle = {
    fontSize: '3.5rem',
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: '0.1rem',
    textShadow: '0 0 15px rgba(255, 255, 255, 0.2)',
  };

  const textContainerStyle = {
    maxWidth: '100%',
    margin: '0 auto 0rem auto',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: '2rem',
    borderRadius: '10px',
    height: '80vh',
    overflowY: 'auto',
  };

  const paragraphStyle = {
    fontSize: '1.1rem',
    lineHeight: '1.7',
    color: '#ffffff',
    textAlign: 'left',
  };

  const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginTop: '2rem',
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

  const cardContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const cardStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: '2rem',
    borderRadius: '10px',
    width: '100%',
    textAlign: 'center',
  };

  const cardTitleStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
  };

  const cardValueStyle = {
    fontSize: '2.5rem',
    fontWeight: 'bold',
  };

  const secondDivContainerStyle = {
    ...pageStyle,
    opacity: showSecondDiv ? 1 : 0,
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    alignItems: 'center',
    margin: isMobile ? 0 : '0 3rem',
    width: '100%',
  };

  return (
    <>
      <Navbar />
      <div style={{ position: 'relative', backgroundColor: '#0b0f19' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
          <Particles
            particleColors={['#ffffff']}
            particleCount={800}
            particleSpread={15}
            speed={0.1}
            particleBaseSize={130}
            alphaParticles={false}
            disableRotation={false}
          />
        </div>
        <div style={{ ...pageStyle, opacity: showSecondDiv ? 0 : 1 }}>
          <div style={{ width: '80%', margin: '0 auto', padding: '0' }}>
            <h1 style={titleStyle}>
              Welcome to The Exomoon Archive!
            </h1>

            <div >
              <p style={{...paragraphStyle, textAlign: 'center', marginTop: '1rem'}}>
                The exomoon archive is a comprehensive dataset of exoplanets analyzed as potential hosts for exomoons.
                This archive is designed to facilitate research and exploration in the field of exoplanetary science,
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
        <div ref={secondDivRef} style={secondDivContainerStyle}>
          <div style={{ flex: 1, paddingRight: isMobile ? 0 : '2rem', paddingBottom: isMobile ? '2rem' : 0, textAlign: 'left' }}>
            <div style={textContainerStyle}>
              <p style={paragraphStyle}>
                <h2 style={{ ...titleStyle, fontSize: '2rem' }}>What is an Exomoon?</h2>
                An exomoon, or extrasolar moon, is a natural satellite that orbits an exoplanet—a planet outside our Solar System. Just as moons like our own orbit planets such as Earth and Jupiter, exomoons are thought to orbit many of the thousands of exoplanets discovered so far. They could range from small, rocky bodies to massive, planet-sized objects.
                <br /><br />
                <h2 style={{ ...titleStyle, fontSize: '2rem' }}>How Exomoon Discovery Would Change Science</h2>
                The discovery of the first confirmed exomoon would be a landmark event, fundamentally changing our understanding of planetary systems and the potential for life beyond Earth.
                <br /><br />
                First, it would provide a crucial new testing ground for theories of planet and moon formation. Scientists have detailed models for how the moons of our Solar System formed—either through co-accretion with their planet, capture of a passing object, or from a giant impact. Finding moons in other systems would allow us to see if these processes are universal or if other mechanisms are at play.
                <br /><br />
                Second, the discovery would have profound implications for astrobiology. A large, rocky exomoon orbiting a gas giant within its star's habitable zone could be a prime candidate for hosting liquid water and, potentially, life. This idea, popularized by science fiction, suggests that even if a giant planet itself is inhospitable, its moons could be habitable worlds. Finding such a moon would vastly expand the search for life beyond Earth. 
                <br /><br />
                Finally, studying exomoons would give us a more complete picture of planetary system dynamics. The presence, size, and orbit of moons can influence a planet's rotation, tides, and long-term climate stability—factors that can be critical for habitability.
                <br /><br />
                <h2 style={{ ...titleStyle, fontSize: '2rem' }}>Current Exomoon Research</h2>
                There aren't any confirmed exomoons yet, but astronomers have been hard at work in the search for the first moon outside our solar system.
              </p>
            </div>
          </div>
          <div style={{ flex: 1, paddingLeft: isMobile ? 0 : '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh',  }}>
            <h2 style={{...titleStyle, }}>Data at a Glance</h2>
            <div style={cardContainerStyle}>
              <div style={cardStyle}>
                <p style={cardValueStyle}>{keplerData.length + psData.length}</p>
                <h3 style={cardTitleStyle}>Exoplanets Analyzed</h3>
              </div>
              <div style={cardStyle}>
                {/* todo: add dynamic reference once articles page is */}
                <p style={cardValueStyle}>18</p>
                <h3 style={cardTitleStyle}>Papers Explored</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;


''

