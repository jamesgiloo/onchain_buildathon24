// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Profile from './pages/Profile';
import Market from './pages/Market';
import Airdrop from './pages/Airdrop';
import MovieProfile from './pages/MovieProfile';
import './App.css';


function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/profile" element={<Profile />} />
          <Route path="/market" element={<Market />} />
          <Route path="/airdrop" element={<Airdrop />} />
          <Route path="/movie-profile/:contractAddress" element={<MovieProfile />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
