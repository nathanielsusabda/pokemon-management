// client/src/App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container } from '@mui/material';
import NavBar from './components/NavBar';
import HomePage from './features/home/HomePage';
import TrainerPage from './features/trainers/TrainerPage';
import PokemonPage from './features/pokemon/PokemonPage';
import SearchPage from './features/search/SearchPage';
import BattlePage from './features/battle/BattlePage';

const App: React.FC = () => {
  return (
    <>
      <NavBar />
      <Container sx={{ mt: 4, mb: 4 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/trainers" element={<TrainerPage />} />
          <Route path="/pokemon" element={<PokemonPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/battle" element={<BattlePage />} />
        </Routes>
      </Container>
    </>
  );
};

export default App;