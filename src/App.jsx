// src/App.jsx
import React from 'react';
import { StarwarsProvider } from './context/starwarsContext';
import Navbar from './components/Navbar';
import AppRoutes from './routes/Routes';

const App = () => {
  return (
    <StarwarsProvider>
      <Navbar />
      <AppRoutes />
      <footer 
        className="text-center p-3" 
        style={{ backgroundColor: '#000000', color: '#ffffff' }}
      >
        Developed by Francisco Yuster
      </footer>
    </StarwarsProvider>
  );
};

export default App;
