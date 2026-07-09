import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importamos todas tus pantallas
import Dashboard from './Dashboard';
import Predecir from './predecir';
import Login from './Login';
import Desafios from './desafios';
import Admin from './Admin';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/predecir" element={<Predecir />} />
        <Route path="/login" element={<Login />} />
        <Route path="/desafios" element={<Desafios />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}
