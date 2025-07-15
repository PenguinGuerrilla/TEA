import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router";

const Navbar = () => {
  const [hoveredLink, setHoveredLink] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      if (!mobile) {
        setIsMenuOpen(false);
      }
      setIsMobile(mobile);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleLinkClick = (path) => {
    navigate(path);
    if (isMobile) {
      setIsMenuOpen(false);
    }
  };

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
    cursor: 'pointer',
    zIndex: 1001,
  };

  const logoImageStyle = {
    height: '50px',
    marginRight: '1rem',
  };

  const logoTextStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  };

  const getNavLinksStyle = () => {
    if (isMobile) {
      return {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2.5rem',
        background: 'rgba(35, 2, 48, 0.95)',
        backdropFilter: 'blur(10px)',
        position: 'fixed',
        top: 0,
        right: 0,
        height: '100vh',
        width: '100%',
        transition: 'transform 0.3s ease-in-out',
        transform: isMenuOpen ? 'translateX(0)' : 'translateX(100%)',
        paddingTop: '6rem',
        zIndex: 999,
      };
    }
    return {
      display: 'flex',
      gap: '2rem',
    };
  };

  const linkStyle = (isHovered) => ({
    color: isHovered || (isMobile && isMenuOpen) ? '#ffffff' : '#d1c4e9',
    textDecoration: 'none',
    fontSize: isMobile ? '1.2rem' : '1rem',
    fontWeight: '500',
    position: 'relative',
    transition: 'color 0.3s ease',
    cursor: 'pointer',
    padding: '0.5rem 0',
  });

  const linkUnderlineStyle = (isHovered, isActive) => ({
    content: "''",
    position: 'absolute',
    width: isHovered || isActive ? '100%' : '0',
    height: '2px',
    bottom: '-5px',
    left: '0',
    backgroundColor: '#ffffff',
    transition: 'width 0.3s ease-in-out',
  });

  const hamburgerStyle = {
    display: isMobile ? 'flex' : 'none',
    flexDirection: 'column',
    justifyContent: 'space-around',
    width: '2rem',
    height: '2rem',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    zIndex: 1001,
  };

  const barStyle = {
    width: '2rem',
    height: '0.25rem',
    background: '#ffffff',
    borderRadius: '10px',
    transition: 'all 0.3s linear',
    position: 'relative',
    transformOrigin: '1px',
  };

  return (
    <nav style={navStyle}>
      <div onClick={() => handleLinkClick('/')} style={logoContainerStyle}>
        <img src="/logo.png" alt="Logo" style={logoImageStyle} />
        {!isMobile && <span style={logoTextStyle}>The Exomoon Archive</span>}
      </div>

      <button style={hamburgerStyle} onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
        <div style={{ ...barStyle, transform: isMenuOpen ? 'rotate(45deg)' : 'rotate(0)' }} />
        <div style={{ ...barStyle, opacity: isMenuOpen ? 0 : 1, transform: isMenuOpen ? 'translateX(20px)' : 'translateX(0)' }} />
        <div style={{ ...barStyle, transform: isMenuOpen ? 'rotate(-45deg)' : 'rotate(0)' }} />
      </button>

      <div style={getNavLinksStyle()}>
        <div
          onClick={() => handleLinkClick('/')}
          style={linkStyle(hoveredLink === 'home' || location.pathname === '/')}
          onMouseEnter={() => setHoveredLink('home')}
          onMouseLeave={() => setHoveredLink(null)}
        >
          Home
          {!isMobile && <span style={linkUnderlineStyle(hoveredLink === 'home', location.pathname === '/')}></span>}
        </div>
        <div
          onClick={() => handleLinkClick('/cumulative')}
          style={linkStyle(hoveredLink === 'cumulative' || location.pathname === '/cumulative')}
          onMouseEnter={() => setHoveredLink('cumulative')}
          onMouseLeave={() => setHoveredLink(null)}
        >
          Cumulative Kepler Data
          {!isMobile && <span style={linkUnderlineStyle(hoveredLink === 'cumulative', location.pathname === '/cumulative')}></span>}
        </div>
        <div
          onClick={() => handleLinkClick('/ps')}
          style={linkStyle(hoveredLink === 'ps' || location.pathname === '/ps')}
          onMouseEnter={() => setHoveredLink('ps')}
          onMouseLeave={() => setHoveredLink(null)}
        >
          Planetary Systems Data
          {!isMobile && <span style={linkUnderlineStyle(hoveredLink === 'ps', location.pathname === '/ps')}></span>}
        </div>
        <div
          onClick={() => handleLinkClick('/about')}
          style={linkStyle(hoveredLink === 'about' || location.pathname === '/about')}
          onMouseEnter={() => setHoveredLink('about')}
          onMouseLeave={() => setHoveredLink(null)}
        >
          About
          {!isMobile && <span style={linkUnderlineStyle(hoveredLink === 'about', location.pathname === '/about')}></span>}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;