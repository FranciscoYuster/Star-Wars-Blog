import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../views/Home';
import Details from '../views/Details';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/details/:type/:id" element={<Details />} />
    </Routes>
  );
};

export default AppRoutes;
