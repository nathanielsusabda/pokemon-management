// client/src/features/home/TrainerPokemonList.tsx
import React from 'react';
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Box,
  Divider
} from '@mui/material';
import { TrainerWithPokemon } from '../../types';

interface TrainerPokemonListProps {
  trainer: TrainerWithPokemon;
}

const TrainerPokemonList: React.FC<TrainerPokemonListProps> = ({ trainer }) => {
  return (
    <Box sx={{ mt: 2 }}>
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6" gutterBottom>
        Pokémon Team
      </Typography>
      
      {trainer.pokemon.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          This trainer doesn't have any Pokémon yet.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {trainer.pokemon.map((pokemon) => (
            <Grid item xs={12} sm={6} md={4} key={pokemon.pokemon_id}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" component="div">
                    {pokemon.name}
                  </Typography>
                  <Typography color="text.secondary" variant="body2" gutterBottom>
                    ID: {pokemon.pokemon_id.substring(0, 8)}...
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Moves:
                  </Typography>
                  
                  {pokemon.moves.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      No moves yet
                    </Typography>
                  ) : (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                      {pokemon.moves.map((move) => (
                        <Chip
                          key={move.id}
                          label={move.move_name}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default TrainerPokemonList;