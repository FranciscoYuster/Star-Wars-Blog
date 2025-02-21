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
    </StarwarsProvider>
  );
};

export default App;
