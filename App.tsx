import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LobbyPage from './pages/LobbyPage';
import GamePage from './pages/GamePage';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LobbyPage />} />
          <Route path="/game/:id" element={<GamePage />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;