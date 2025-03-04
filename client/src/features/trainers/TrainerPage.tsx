// client/src/features/trainers/TrainerPage.tsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  CircularProgress,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import {
  useGetTrainersQuery,
  useCreateTrainerMutation,
  useUpdateTrainerMutation,
  useDeleteTrainerMutation,
  useAddPokemonToTrainerMutation,
  useGetPokemonQuery
} from '../../api/apiSlice';
import TrainerCard from './TrainerCard';
import TrainerForm from './TrainerForm';

const TrainerPage: React.FC = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  
  const {
    data: trainers,
    isLoading: isLoadingTrainers,
    error: trainersError
  } = useGetTrainersQuery();
  
  const {
    data: pokemon,
    isLoading: isLoadingPokemon,
    error: pokemonError
  } = useGetPokemonQuery();
  
  const [createTrainer, { isLoading: isCreating }] = useCreateTrainerMutation();
  const [updateTrainer, { isLoading: isUpdating }] = useUpdateTrainerMutation();
  const [deleteTrainer, { isLoading: isDeleting }] = useDeleteTrainerMutation();
  const [addPokemonToTrainer, { isLoading: isAddingPokemon }] = useAddPokemonToTrainerMutation();
  
  const handleCreateTrainer = async (data: { name: string }) => {
    try {
      await createTrainer(data).unwrap();
    } catch (error) {
      console.error('Failed to create trainer:', error);
    }
  };
  
  const handleUpdateTrainer = async (id: number, data: { name: string }) => {
    try {
      await updateTrainer({ id, ...data }).unwrap();
    } catch (error) {
      console.error('Failed to update trainer:', error);
    }
  };
  
  const handleDeleteTrainer = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this trainer? All their Pokémon will also be deleted.')) {
      try {
        await deleteTrainer(id).unwrap();
      } catch (error) {
        console.error('Failed to delete trainer:', error);
      }
    }
  };
  
  const handleAddPokemon = async (trainerId: number, pokemonId: string) => {
    try {
      await addPokemonToTrainer({ trainerId, pokemonId }).unwrap();
    } catch (error) {
      console.error('Failed to add Pokémon to trainer:', error);
    }
  };
  
  const isLoading = isLoadingTrainers || isLoadingPokemon || isCreating || isUpdating || isDeleting || isAddingPokemon;
  const error = trainersError || pokemonError;
  
  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Pokémon Trainers
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
        >
          Add Trainer
        </Button>
      </Box>
      
      {isLoading && <CircularProgress />}
      
      {error && (
        <Alert severity="error" sx={{ my: 2 }}>
          Error: {JSON.stringify(error)}
        </Alert>
      )}
      
      {trainers && pokemon && (
        <Grid container spacing={2}>
          {trainers.length === 0 ? (
            <Grid item xs={12}>
              <Alert severity="info">
                No trainers found. Create a new trainer to get started.
              </Alert>
            </Grid>
          ) : (
            trainers.map((trainer) => (
              <Grid item xs={12} md={6} key={trainer.id}>
                <TrainerCard
                  trainer={trainer}
                  onEdit={handleUpdateTrainer}
                  onDelete={handleDeleteTrainer}
                  onAddPokemon={handleAddPokemon}
                  // availablePokemon={pokemon}
                />
              </Grid>
            ))
          )}
        </Grid>
      )}
      
      {/* Create Trainer Dialog */}
      <TrainerForm
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSubmit={handleCreateTrainer}
        title="Create Trainer"
      />
    </Container>
  );
};

export default TrainerPage;