import React, { createContext, useState, useContext, useEffect } from 'react';
import { Appearance } from 'react-native';

export const ThemeContext = createContext({
  isDarkTheme: false,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(Appearance.getColorScheme() === 'dark');

  useEffect(() => {
    const listener = Appearance.addChangeListener(({ colorScheme }) => {
      setIsDarkTheme(colorScheme === 'dark');
    });
    return () => listener.remove();
  }, []);

  const toggleTheme = () => setIsDarkTheme((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDarkTheme, toggleTheme }}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
