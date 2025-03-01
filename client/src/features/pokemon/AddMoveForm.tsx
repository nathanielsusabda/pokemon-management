// client/src/features/pokemon/AddMoveForm.tsx
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

interface AddMoveFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (moveName: string) => void;
  title: string;
}

const AddMoveForm: React.FC<AddMoveFormProps> = ({
  open,
  onClose,
  onSubmit,
  title
}) => {
  const [moveName, setMoveName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!moveName.trim()) {
      setError('Move name is required');
      return;
    }
    onSubmit(moveName);
    setMoveName('');
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
            id="moveName"
            label="Move Name"
            name="moveName"
            autoFocus
            value={moveName}
            onChange={(e) => setMoveName(e.target.value)}
            error={!!error}
            helperText={error}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddMoveForm;