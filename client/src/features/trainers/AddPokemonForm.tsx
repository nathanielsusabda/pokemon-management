// client/src/features/trainers/AddPokemonForm.tsx
import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  FormHelperText,
  CircularProgress
} from '@mui/material';
import { useGetAvailablePokemonForTrainerQuery } from '../../api/apiSlice';

interface AddPokemonFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (pokemonId: string) => void;
}

const AddPokemonForm: React.FC<AddPokemonFormProps> = ({
  open,
  onClose,
  onSubmit
}) => {
  const [pokemonId, setPokemonId] = useState('');
  const [error, setError] = useState('');
  
  const { 
    data: availablePokemon = [], 
    isLoading, 
    error: fetchError 
  } = useGetAvailablePokemonForTrainerQuery();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pokemonId) {
      setError('Please select a Pokémon');
      return;
    }
    onSubmit(pokemonId);
    setPokemonId('');
    setError('');
    onClose();
  };

  const handleClose = () => {
    setPokemonId('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add Pokémon to Trainer</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <FormControl fullWidth error={!!error || !!fetchError} sx={{ mt: 1 }}>
            <InputLabel id="pokemon-select-label">Pokémon</InputLabel>
            <Select
              labelId="pokemon-select-label"
              id="pokemon-select"
              value={pokemonId}
              label="Pokémon"
              onChange={(e) => setPokemonId(e.target.value)}
              disabled={isLoading}
            >
              {isLoading ? (
                <MenuItem value="">
                  <em>Loading...</em>
                </MenuItem>
              ) : availablePokemon.length === 0 ? (
                <MenuItem value="">
                  <em>No available Pokémon</em>
                </MenuItem>
              ) : (
                availablePokemon.map((pokemon) => (
                  <MenuItem key={pokemon.pokemon_id} value={pokemon.pokemon_id}>
                    {pokemon.name} ({pokemon.type})
                  </MenuItem>
                ))
              )}
            </Select>
            {error && <FormHelperText>{error}</FormHelperText>}
            {fetchError && <FormHelperText>Error loading Pokémon</FormHelperText>}
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          disabled={availablePokemon.length === 0 || isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddPokemonForm;