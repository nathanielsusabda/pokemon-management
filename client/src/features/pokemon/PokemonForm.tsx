// client/src/features/pokemon/PokemonForm.tsx
import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText
} from '@mui/material';
import { Pokemon } from '../../types';

interface PokemonFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string, type: string }) => void;
  pokemon?: Pokemon;
  title: string;
}

const PokemonForm: React.FC<PokemonFormProps> = ({
  open,
  onClose,
  onSubmit,
  pokemon,
  title
}) => {
  const [name, setName] = useState(pokemon?.name || '');
  const [type, setType] = useState(pokemon?.type || '');
  const [errors, setErrors] = useState<{name?: string, type?: string}>({});

  const pokemonTypes = ['Fire', 'Water', 'Grass'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: {name?: string, type?: string} = {};
    
    if (!name.trim()) {
      newErrors.name = 'Pokémon name is required';
    }
    
    if (!type) {
      newErrors.type = 'Pokémon type is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onSubmit({ name, type });
    setName('');
    setType('');
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Pokémon Name"
            name="name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
          />
          
          <FormControl fullWidth margin="normal" error={!!errors.type}>
            <InputLabel id="type-select-label">Type</InputLabel>
            <Select
              labelId="type-select-label"
              id="type"
              value={type}
              label="Type"
              onChange={(e) => setType(e.target.value)}
            >
              {pokemonTypes.map(type => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </Select>
            {errors.type && <FormHelperText>{errors.type}</FormHelperText>}
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PokemonForm;