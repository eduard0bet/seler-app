"use client";
import { useState, useEffect } from 'react';

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(false);

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // You can save the dark mode preference to localStorage or a user profile here
  };

  // Load dark mode preference from localStorage or user profile on component mount
  useEffect(() => {
    // You can load the dark mode preference from localStorage or a user profile here
    // For example: const isDarkMode = localStorage.getItem('darkMode') === 'true';
    // setDarkMode(isDarkMode);
  }, []);

  // Apply dark mode CSS class to the body element
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
      // You can also set a class on other elements to apply dark mode styles
    } else {
      document.body.classList.remove('dark');
      // Remove dark mode class from other elements
    }
    // You can save the dark mode preference to localStorage or a user profile here
    // For example: localStorage.setItem('darkMode', darkMode ? 'true' : 'false');
  }, [darkMode]);

  return (
    <button
      className={`p-2 rounded-full transition-colors duration-300 ${
        darkMode ? 'dark:bg-[#292B2D] text-white' : 'bg-gray-200 text-gray-800'
      }`}
      onClick={toggleDarkMode}
    >
      {darkMode ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
};

export default DarkModeToggle;
