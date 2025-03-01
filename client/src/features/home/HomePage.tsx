// client/src/features/home/HomePage.tsx
import React from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Paper
} from '@mui/material';
import { useGetTrainersQuery } from '../../api/apiSlice';
import TrainerPokemonList from './TrainerPokemonList';

const HomePage: React.FC = () => {
  const {
    data: trainers,
    isLoading,
    error
  } = useGetTrainersQuery();

  return (
    <Container>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Pokémon Management App
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Manage your trainers and their Pokémon team
        </Typography>
      </Box>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ my: 2 }}>
          Error loading trainers: {JSON.stringify(error)}
        </Alert>
      )}

      {trainers && trainers.length === 0 && (
        <Paper sx={{ p: 3, textAlign: 'center', my: 2 }}>
          <Typography variant="h5" gutterBottom>
            No trainers found
          </Typography>
          <Typography variant="body1">
            Start by adding a trainer and some Pokémon to their team.
          </Typography>
        </Paper>
      )}

      {trainers && trainers.length > 0 && (
        <>
          <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 4 }}>
            Current Trainers
          </Typography>
          <Grid container spacing={3}>
            {trainers.map((trainer) => (
              <Grid item xs={12} key={trainer.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      {trainer.name}
                    </Typography>
                    <TrainerPokemonList trainer={trainer} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Container>
  );
};

export default HomePage;