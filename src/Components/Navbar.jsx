import React, { useState } from 'react';

const Navbar = () => {
  const [hoveredLink, setHoveredLink] = useState(null);

  const navStyle = {
    width: '100%',
    padding: '1rem 2rem',
    background: 'linear-gradient(90deg, #480564, #230230)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    top: 0,
    left: 0,
    zIndex: 1000,
    fontFamily: "'Orbitron', sans-serif",
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
  };

  const logoContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    color: '#ffffff',
  };

  const logoImageStyle = {
    height: '50px',
    marginRight: '1rem',
  };

  const logoTextStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  };

  const navLinksStyle = {
    display: 'flex',
    gap: '2rem',
  };

  const linkStyle = (isHovered) => ({
    color: isHovered ? '#ffffff' : '#d1c4e9',
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: '500',
    position: 'relative',
    transition: 'color 0.3s ease',
  });

  const linkUnderlineStyle = (isHovered) => ({
    content: "''",
    position: 'absolute',
    width: isHovered ? '100%' : '0',
    height: '2px',
    bottom: '-5px',
    left: '0',
    backgroundColor: '#ffffff',
    transition: 'width 0.3s ease-in-out',
  });

  return (
    <nav style={navStyle}>
      <a href="/" style={logoContainerStyle}>
        <img src="/logo.png" alt="Logo" style={logoImageStyle} />
        <span style={logoTextStyle}>The Exomoon Archive</span>
      </a>
      <div style={navLinksStyle}>
        <a 
          href="/" 
          style={linkStyle(hoveredLink === 'home')}
          onMouseEnter={() => setHoveredLink('home')}
          onMouseLeave={() => setHoveredLink(null)}
        >
          Home
          <span style={linkUnderlineStyle(hoveredLink === 'home')}></span>
        </a>
        <a 
          href="/cumulative" 
          style={linkStyle(hoveredLink === 'dashboard')}
          onMouseEnter={() => setHoveredLink('dashboard')}
          onMouseLeave={() => setHoveredLink(null)}
        >
          Cumulative Kepler Data
          <span style={linkUnderlineStyle(hoveredLink === 'dashboard')}></span>
        </a>
        <a 
          href="/ps" 
          style={linkStyle(hoveredLink === 'about')}
          onMouseEnter={() => setHoveredLink('about')}
          onMouseLeave={() => setHoveredLink(null)}
        >
          Planetary Systems Data
          <span style={linkUnderlineStyle(hoveredLink === 'about')}></span>
        </a>
      </div>
    </nav>
  );
};

export default Navbar;