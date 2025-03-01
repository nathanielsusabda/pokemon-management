// client/src/features/battle/TrainerBattleCard.tsx
import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { BattlePokemon, TrainerWithBattlePokemon } from '../../types';

interface TrainerBattleCardProps {
  trainer: TrainerWithBattlePokemon;
  selectedPokemon: BattlePokemon | null;
  onSelectPokemon: (pokemon: BattlePokemon) => void;
  onChangeTrainer: () => void;
  onChangeSelection: () => void;  // Add this new prop
}

// Color map for Pokémon types
const typeColors: Record<string, string> = {
  Fire: '#F08030',
  Water: '#6890F0',
  Grass: '#78C850'
};

const TrainerBattleCard: React.FC<TrainerBattleCardProps> = ({
  trainer,
  selectedPokemon,
  onSelectPokemon,
  onChangeTrainer,
  onChangeSelection  // Add this parameter
}) => {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">{trainer.name}</Typography>
        <Button size="small" variant="outlined" onClick={onChangeTrainer}>
          Change Trainer
        </Button>
      </Box>
      
      {selectedPokemon ? (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" gutterBottom>
                {selectedPokemon.name}
              </Typography>
              <Chip
                label={selectedPokemon.type}
                sx={{
                  bgcolor: typeColors[selectedPokemon.type] || '#A8A8A8',
                  color: '#FFFFFF',
                  fontWeight: 'bold'
                }}
              />
            </Box>
            <Button
              variant="outlined"
              size="small"
              onClick={onChangeSelection}  // Use the new prop here
              sx={{ mt: 1 }}
            >
              Change Pokémon
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Box>
          <Typography variant="body1" gutterBottom>
            Select a Pokémon:
          </Typography>
          <Grid container spacing={1}>
            {trainer.pokemon.map((pokemon) => (
              <Grid xs={6} key={pokemon.id}>
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': {
                      boxShadow: 6,
                    }
                  }}
                  onClick={() => onSelectPokemon(pokemon)}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="body1" gutterBottom>
                      {pokemon.name}
                    </Typography>
                    <Chip
                      size="small"
                      label={pokemon.type}
                      sx={{
                        bgcolor: typeColors[pokemon.type] || '#A8A8A8',
                        color: '#FFFFFF',
                        fontWeight: 'bold'
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default TrainerBattleCard;