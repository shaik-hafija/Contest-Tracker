import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <nav style={styles.navbar}>
      <h2 style={styles.title}>Contest Tracker</h2>
      {isMobile ? (
        <div style={styles.mobileMenu}>
          <Link to="/" style={styles.link}>Home</Link>
          <Link to="/past-contests" style={styles.link}>Past Contests</Link>
          <Link to="/admin" style={styles.link}>Admin</Link>
        </div>
      ) : (
        <div style={styles.links}>
          <Link to="/" style={styles.link}>Home</Link>
          <Link to="/past-contests" style={styles.link}>Past Contests</Link>
          <Link to="/admin" style={styles.link}>Admin</Link>
        </div>
      )}
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#d53f8c',
    color: 'white',
  },
  title: {
    fontSize: '24px',
    margin: '0',
  },
  links: {
    display: 'flex',
  },
  link: {
    margin: '0 10px',
    color: 'white',
    textDecoration: 'none',
    fontSize: '18px',
  },
  mobileMenu: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
};

export default Navbar;
