// client/src/features/battle/BattlePage.tsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  useGetTrainersWithPokemonQuery,
  useBattlePokemonMutation
} from '../../api/apiSlice';
import TrainerBattleCard from './TrainerBattleCard';
import BattleResultCard from './BattleResultCard';
import { BattleResult, BattlePokemon } from '../../types';

const BattlePage: React.FC = () => {
  const [selectedTrainer1, setSelectedTrainer1] = useState<number | null>(null);
  const [selectedTrainer2, setSelectedTrainer2] = useState<number | null>(null);
  const [selectedPokemon1, setSelectedPokemon1] = useState<BattlePokemon | null>(null);
  const [selectedPokemon2, setSelectedPokemon2] = useState<BattlePokemon | null>(null);
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null);
  const [showBattleResult, setShowBattleResult] = useState(false);
  
  const { data: trainers, isLoading, error } = useGetTrainersWithPokemonQuery();
  const [battlePokemon, { isLoading: isBattling }] = useBattlePokemonMutation();
  
  const handleSelectTrainer = (trainerId: number, position: 1 | 2) => {
    if (position === 1) {
      setSelectedTrainer1(trainerId);
      setSelectedPokemon1(null);
    } else {
      setSelectedTrainer2(trainerId);
      setSelectedPokemon2(null);
    }
  };
  
  const handleSelectPokemon = (pokemon: BattlePokemon, position: 1 | 2) => {
    if (position === 1) {
      setSelectedPokemon1(pokemon);
    } else {
      setSelectedPokemon2(pokemon);
    }
  };

  // Add a function to clear selection
  const handleClearSelection = (position: 1 | 2) => {
    if (position === 1) {
      setSelectedPokemon1(null);
    } else {
      setSelectedPokemon2(null);
    }
  };

  
  const handleBattle = async () => {
    if (!selectedPokemon1 || !selectedPokemon2) {
      return;
    }
    
    try {
      const result = await battlePokemon({
        pokemon1Id: selectedPokemon1.id,
        pokemon2Id: selectedPokemon2.id
      }).unwrap();
      
      setBattleResult(result);
      setShowBattleResult(true);
    } catch (error) {
      console.error('Failed to battle Pokemon:', error);
    }
  };
  
  const getTrainerById = (id: number) => {
    return trainers?.find(trainer => trainer.id === id) || null;
  };
  
  const canBattle = selectedPokemon1 && selectedPokemon2;
  
  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Pokémon Battle Arena
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center" paragraph>
          Select two trainers and their Pokémon to battle!
        </Typography>
      </Box>
      
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ my: 2 }}>
          Error loading trainers: {JSON.stringify(error)}
        </Alert>
      ) : trainers && trainers.length > 0 ? (
        <>
          {/* Battle Selection Area */}
          <Grid container spacing={4} sx={{ mb: 4 }}>
            {/* Trainer 1 Selection */}
            <Grid xs={12} md={5}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Typography variant="h5" gutterBottom>
                  Trainer 1
                </Typography>
                
                {selectedTrainer1 ? (
                  <TrainerBattleCard
                    trainer={getTrainerById(selectedTrainer1)!}
                    selectedPokemon={selectedPokemon1}
                    onSelectPokemon={(pokemon: BattlePokemon) => handleSelectPokemon(pokemon, 1)}
                    onChangeTrainer={() => setSelectedTrainer1(null)}
                    onChangeSelection={() => handleClearSelection(1)}  // Add this line
                  />
                ) : (
                  <Box>
                    <Typography variant="body1" gutterBottom>
                      Select a trainer:
                    </Typography>
                    <Grid container spacing={1}>
                      {trainers.map((trainer) => (
                        <Grid xs={6} key={trainer.id}>
                          <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => handleSelectTrainer(trainer.id, 1)}
                            sx={{ width: '100%' }}
                          >
                            {trainer.name}
                          </Button>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
              </Paper>
            </Grid>
            
            {/* VS Divider */}
            <Grid xs={12} md={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>VS</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={!canBattle || isBattling}
                  onClick={handleBattle}
                  sx={{ minWidth: 120 }}
                >
                  {isBattling ? <CircularProgress size={24} color="inherit" /> : 'Battle!'}
                </Button>
              </Box>
            </Grid>
            
            {/* Trainer 2 Selection */}
            <Grid xs={12} md={5}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Typography variant="h5" gutterBottom>
                  Trainer 2
                </Typography>
                
                {selectedTrainer2 ? (
                  <TrainerBattleCard
                    trainer={getTrainerById(selectedTrainer2)!}
                    selectedPokemon={selectedPokemon2}
                    onSelectPokemon={(pokemon: BattlePokemon) => handleSelectPokemon(pokemon, 2)}
                    onChangeTrainer={() => setSelectedTrainer2(null)}
                    onChangeSelection={() => handleClearSelection(2)}  // Add this line
                  />
                ) : (
                  <Box>
                    <Typography variant="body1" gutterBottom>
                      Select a trainer:
                    </Typography>
                    <Grid container spacing={1}>
                      {trainers.map((trainer) => (
                        <Grid xs={6} key={trainer.id}>
                          <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => handleSelectTrainer(trainer.id, 2)}
                            sx={{ width: '100%' }}
                            disabled={trainer.id === selectedTrainer1}
                          >
                            {trainer.name}
                          </Button>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
        </>
      ) : (
        <Alert severity="info" sx={{ my: 4 }}>
          No trainers available for battle. Add trainers and Pokémon first.
        </Alert>
      )}
      
      {/* Battle Result Dialog */}
      <Dialog open={showBattleResult} onClose={() => setShowBattleResult(false)} maxWidth="md">
        <DialogTitle>Battle Result</DialogTitle>
        <DialogContent>
          {battleResult && (
            <BattleResultCard result={battleResult} />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowBattleResult(false)}>Close</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setShowBattleResult(false);
              setSelectedPokemon1(null);
              setSelectedPokemon2(null);
            }}
          >
            New Battle
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BattlePage;