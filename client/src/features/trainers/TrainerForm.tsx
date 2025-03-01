// client/src/features/trainers/TrainerForm.tsx
import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';
import { Trainer } from '../../types';

interface TrainerFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string }) => void;
  trainer?: Trainer;
  title: string;
}

const TrainerForm: React.FC<TrainerFormProps> = ({
  open,
  onClose,
  onSubmit,
  trainer,
  title
}) => {
  const [name, setName] = useState(trainer?.name || '');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Trainer name is required');
      return;
    }
    onSubmit({ name });
    setName('');
    setError('');
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
            label="Trainer Name"
            name="name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!!error}
            helperText={error}
          />
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

export default TrainerForm;