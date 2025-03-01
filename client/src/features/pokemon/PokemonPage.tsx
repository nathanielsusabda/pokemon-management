// client/src/features/pokemon/PokemonPage.tsx
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
  useGetPokemonQuery,
  useCreatePokemonMutation,
  useUpdatePokemonMutation,
  useDeletePokemonMutation,
  useAddMoveToPokemonMutation,
  useDeleteMoveMutation
} from '../../api/apiSlice';
import PokemonCard from './PokemonCard';
import PokemonForm from './PokemonForm';

const PokemonPage: React.FC = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  
  const {
    data: pokemon,
    isLoading: isLoadingPokemon,
    error: pokemonError
  } = useGetPokemonQuery();
  
  const [createPokemon, { isLoading: isCreating }] = useCreatePokemonMutation();
  const [updatePokemon, { isLoading: isUpdating }] = useUpdatePokemonMutation();
  const [deletePokemon, { isLoading: isDeleting }] = useDeletePokemonMutation();
  const [addMoveToPokemon, { isLoading: isAddingMove }] = useAddMoveToPokemonMutation();
  const [deleteMove, { isLoading: isDeletingMove }] = useDeleteMoveMutation();
  
  // In PokemonPage.tsx, update the createPokemon and updatePokemon handlers:

  const handleCreatePokemon = async (data: { name: string, type: string }) => {
    try {
      await createPokemon(data).unwrap();
    } catch (error) {
      console.error('Failed to create Pokémon:', error);
    }
  };

  const handleUpdatePokemon = async (id: string, data: { name: string, type: string }) => {
    try {
      await updatePokemon({ id, ...data }).unwrap();
    } catch (error) {
      console.error('Failed to update Pokémon:', error);
    }
  };
    
  const handleDeletePokemon = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this Pokémon?')) {
      try {
        await deletePokemon(id).unwrap();
      } catch (error) {
        console.error('Failed to delete Pokémon:', error);
      }
    }
  };

  const handleAddMove = async (pokemonId: string, moveName: string) => {
    try {
      await addMoveToPokemon({ pokemonId, moveName }).unwrap();
    } catch (error) {
      console.error('Failed to add move to Pokémon:', error);
    }
  };

  const handleDeleteMove = async (moveId: number) => {
    if (window.confirm('Are you sure you want to delete this move?')) {
      try {
        await deleteMove(moveId).unwrap();
      } catch (error) {
        console.error('Failed to delete move:', error);
      }
    }
};

const isLoading = isLoadingPokemon || isCreating || isUpdating || isDeleting || isAddingMove || isDeletingMove;

return (
  <Container>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Pokémon Registry
      </Typography>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setCreateDialogOpen(true)}
      >
        Add Pokémon
      </Button>
    </Box>
    
    {isLoading && <CircularProgress />}
    
    {pokemonError && (
      <Alert severity="error" sx={{ my: 2 }}>
        Error: {JSON.stringify(pokemonError)}
      </Alert>
    )}
    
    {pokemon && (
      <Grid container spacing={3}>
        {pokemon.length === 0 ? (
          <Grid item xs={12}>
            <Alert severity="info">
              No Pokémon found. Create a new Pokémon to get started.
            </Alert>
          </Grid>
        ) : (
          pokemon.map((poke) => (
            <Grid item xs={12} sm={6} md={4} key={poke.pokemon_id}>
              <PokemonCard
                pokemon={poke}
                onEdit={handleUpdatePokemon}
                onDelete={handleDeletePokemon}
                onAddMove={handleAddMove}
                onDeleteMove={handleDeleteMove}
              />
            </Grid>
          ))
        )}
      </Grid>
    )}
    
    {/* Create Pokemon Dialog */}
    <PokemonForm
      open={createDialogOpen}
      onClose={() => setCreateDialogOpen(false)}
      onSubmit={handleCreatePokemon}
      title="Create Pokémon"
    />
  </Container>
);
};

export default PokemonPage;