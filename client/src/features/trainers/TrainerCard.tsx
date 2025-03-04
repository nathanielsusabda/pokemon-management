// client/src/features/trainers/TrainerCard.tsx
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Collapse,
  Box,
  IconButton,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { TrainerWithPokemon, PokemonWithMoves } from '../../types';
import TrainerForm from './TrainerForm';
import AddPokemonForm from './AddPokemonForm';

interface ExpandMoreProps {
  expand: boolean;
}

const ExpandMore = styled((props: any) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})<ExpandMoreProps>(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

interface TrainerCardProps {
  trainer: TrainerWithPokemon;
  onEdit: (id: number, data: { name: string }) => void;
  onDelete: (id: number) => void;
  onAddPokemon: (trainerId: number, pokemonId: string) => void;
}

const TrainerCard: React.FC<TrainerCardProps> = ({
  trainer,
  onEdit,
  onDelete,
  onAddPokemon,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addPokemonDialogOpen, setAddPokemonDialogOpen] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {trainer.name}
        </Typography>
        <Typography color="text.secondary" gutterBottom>
          Trainer ID: {trainer.id}
        </Typography>
        <Typography variant="body2">
          Total Pokémon: {trainer.pokemon.length}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
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
          onClick={() => onDelete(trainer.id!)}
        >
          Delete
        </Button>
        <Button
          size="small"
          color="success"
          startIcon={<AddIcon />}
          onClick={() => setAddPokemonDialogOpen(true)}
        >
          Add Pokémon
        </Button>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Pokémon Team:
          </Typography>
          <List>
            {trainer.pokemon.map((pokemon) => (
              <Box key={pokemon.pokemon_id} sx={{ mb: 2 }}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={pokemon.name}
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          ID: {pokemon.pokemon_id}
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Moves:
                          </Typography>
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
                        </Box>
                      </>
                    }
                  />
                </ListItem>
                <Divider component="li" />
              </Box>
            ))}
          </List>
        </CardContent>
      </Collapse>

      {/* Edit Trainer Dialog */}
      <TrainerForm
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onSubmit={(data) => onEdit(trainer.id!, data)}
        trainer={trainer}
        title="Edit Trainer"
      />

      {/* Add Pokemon Dialog */}
      <AddPokemonForm
        open={addPokemonDialogOpen}
        onClose={() => setAddPokemonDialogOpen(false)}
        onSubmit={(pokemonId) => onAddPokemon(trainer.id!, pokemonId)}
      />
    </Card>
  );
};

export default TrainerCard;