import React, { useState } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa'; // Import sun and moon icons
import '../styles/Header.css';

const Headers = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
    document.body.classList.toggle('dark-mode');
  };

  return (
    <header className={`header ${darkMode ? 'dark-mode' : ''}`}>
      <div className="title">
        <h1>Fake News Detector</h1>
      </div>
      <ul className="menu">
        <li>
          {darkMode ? (
            <FaSun onClick={toggleDarkMode} className="toggle-icon white-icon" />
          ) : (
            <FaMoon onClick={toggleDarkMode} className="toggle-icon white-icon" />
          )}
        </li>
      </ul>
    </header>
  );
};

export default Headers;
