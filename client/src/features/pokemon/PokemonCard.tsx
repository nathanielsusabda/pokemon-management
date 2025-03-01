// client/src/features/pokemon/PokemonCard.tsx
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { PokemonWithMoves } from '../../types';
import PokemonForm from './PokemonForm';
import AddMoveForm from './AddMoveForm';

interface PokemonCardProps {
  pokemon: PokemonWithMoves;
  onEdit: (id: string, data: { name: string; type: string }) => void;
  onDelete: (id: string) => void;
  onAddMove: (pokemonId: string, moveName: string) => void;
  onDeleteMove: (moveId: number) => void;
}

const PokemonCard: React.FC<PokemonCardProps> = ({
  pokemon,
  onEdit,
  onDelete,
  onAddMove,
  onDeleteMove
}) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addMoveDialogOpen, setAddMoveDialogOpen] = useState(false);
  const [viewMovesDialogOpen, setViewMovesDialogOpen] = useState(false);

  // Add this helper function inside your PokemonCard component
  const getTypeColor = (type: string): string => {
    const typeColors: Record<string, string> = {
      Fire: '#F08030',
      Water: '#6890F0',
      Grass: '#78C850'
    };
    
    return typeColors[type] || '#A8A8A8'; // Default gray for unknown types
  };
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          {pokemon.name}
        </Typography>
        {/* Type */}
        <Chip
          label={pokemon.type}
          size="small"
          sx={{
            bgcolor: getTypeColor(pokemon.type),
            color: 'white',
            fontWeight: 'bold',
            mb: 2
          }}
        />
        <Typography color="text.secondary" gutterBottom>
          ID: {pokemon.pokemon_id}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Moves ({pokemon.moves.length}):
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
            {pokemon.moves.length > 0 ? (
              <>
                {pokemon.moves.slice(0, 3).map((move) => (
                  <Chip
                    key={move.id}
                    label={move.move_name}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                ))}
                {pokemon.moves.length > 3 && (
                  <Chip
                    label={`+${pokemon.moves.length - 3} more`}
                    size="small"
                    color="secondary"
                    onClick={() => setViewMovesDialogOpen(true)}
                  />
                )}
              </>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No moves yet
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          startIcon={<EditIcon />}
          onClick={() => setEditDialogOpen(true)}
        >
          Edit
        </Button>
        <Button
          size="small"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={() => onDelete(pokemon.pokemon_id)}
        >
          Delete
        </Button>
        <Button
          size="small"
          color="success"
          startIcon={<AddIcon />}
          onClick={() => setAddMoveDialogOpen(true)}
        >
          Add Move
        </Button>
        {pokemon.moves.length > 0 && (
          <Button
            size="small"
            onClick={() => setViewMovesDialogOpen(true)}
          >
            View Moves
          </Button>
        )}
      </CardActions>

      {/* Edit Pokemon Dialog */}
      <PokemonForm
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onSubmit={(data) => onEdit(pokemon.pokemon_id, data)}
        pokemon={pokemon}
        title="Edit Pokémon"
      />

      {/* Add Move Dialog */}
      <AddMoveForm
        open={addMoveDialogOpen}
        onClose={() => setAddMoveDialogOpen(false)}
        onSubmit={(moveName) => onAddMove(pokemon.pokemon_id, moveName)}
        title="Add Move"
      />

      {/* View Moves Dialog */}
      <Dialog
        open={viewMovesDialogOpen}
        onClose={() => setViewMovesDialogOpen(false)}
        aria-labelledby="moves-dialog-title"
      >
        <DialogTitle id="moves-dialog-title">
          {pokemon.name}'s Moves
        </DialogTitle>
        <DialogContent>
          {pokemon.moves.length === 0 ? (
            <DialogContentText>No moves yet.</DialogContentText>
          ) : (
            <List>
              {pokemon.moves.map((move) => (
                <ListItem key={move.id}>
                  <ListItemText primary={move.move_name} />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => onDeleteMove(move.id!)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewMovesDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default PokemonCard;