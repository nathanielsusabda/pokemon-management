// server/src/routes/index.ts
import { Router } from 'express';
import {
  getAllTrainers,
  getTrainerById,
  createTrainer,
  updateTrainer,
  deleteTrainer,
  addPokemonToTrainer,
  searchTrainers
} from '../controllers/trainerController';
import {
  getAllPokemon,
  getPokemonById,
  createPokemon,
  updatePokemon,
  deletePokemon,
  addMoveToPokemon,
  updatePokemonMove,
  deletePokemonMove,
  getAvailablePokemonForTrainer
} from '../controllers/pokemonController';
import {
  battlePokemon,
  getAvailablePokemon,
  getTrainersWithPokemon
} from '../controllers/battleController';

const router = Router();

// Trainer routes
router.get('/trainers', getAllTrainers as any);
router.get('/trainers/search', searchTrainers as any);
router.get('/trainers/:id', getTrainerById as any);
router.post('/trainers', createTrainer as any);
router.put('/trainers/:id', updateTrainer as any);
router.delete('/trainers/:id', deleteTrainer as any);
router.post('/trainers/pokemon', addPokemonToTrainer as any);

// Pokemon routes
router.get('/pokemon', getAllPokemon as any);
router.get('/pokemon/:id', getPokemonById as any);
router.post('/pokemon', createPokemon as any);
router.put('/pokemon/:id', updatePokemon as any);
router.delete('/pokemon/:id', deletePokemon as any);
router.get('/pokemon/available-for-trainer', getAvailablePokemonForTrainer as any);

// Pokemon moves routes
router.post('/moves', addMoveToPokemon as any);
router.put('/moves/:id', updatePokemonMove as any);
router.delete('/moves/:id', deletePokemonMove as any);

// Battle routes
router.post('/battle', battlePokemon as any);
router.get('/battle/pokemon', getAvailablePokemon as any);
router.get('/battle/trainers', getTrainersWithPokemon as any);

export default router;