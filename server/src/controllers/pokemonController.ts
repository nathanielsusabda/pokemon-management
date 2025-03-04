// server/src/controllers/pokemonController.ts
import { Request, Response } from 'express';
import pool from '../config/db';
import { Pokemon, PokemonWithMoves } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Get all Pokemon with their moves
export const getAllPokemon = async (req: Request, res: Response) => {
  try {
    const [pokemonRows] = await pool.query('SELECT * FROM pokemon');
    
    const pokemonWithMoves: PokemonWithMoves[] = await Promise.all(
      (pokemonRows as Pokemon[]).map(async (pokemon) => {
        const [moves] = await pool.query(
          'SELECT * FROM pokemon_moves WHERE pokemon_id = ?',
          [pokemon.pokemon_id]
        );
        
        return {
          ...pokemon,
          moves: moves as any[]
        };
      })
    );
    
    res.status(200).json(pokemonWithMoves);
  } catch (error) {
    console.error('Error getting Pokemon:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single Pokemon by ID with its moves
export const getPokemonById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const [pokemonRows] = await pool.query(
      'SELECT * FROM pokemon WHERE pokemon_id = ?',
      [id]
    );
    
    if ((pokemonRows as any[]).length === 0) {
      return res.status(404).json({ message: 'Pokemon not found' });
    }
    
    const pokemon = (pokemonRows as any[])[0];
    
    const [moves] = await pool.query(
      'SELECT * FROM pokemon_moves WHERE pokemon_id = ?',
      [id]
    );
    
    const pokemonWithMoves = {
      ...pokemon,
      moves: moves as any[]
    };
    
    res.status(200).json(pokemonWithMoves);
  } catch (error) {
    console.error('Error getting Pokemon:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update the createPokemon function
export const createPokemon = async (req: Request, res: Response) => {
  try {
    const { name, type } = req.body;
    
    if (!name || !type) {
      return res.status(400).json({ message: 'Name and type are required' });
    }
    
    // Generate a unique ID for the Pokemon
    const pokemon_id = uuidv4();
    
    const [result] = await pool.query(
      'INSERT INTO pokemon (name, type, pokemon_id) VALUES (?, ?, ?)',
      [name, type, pokemon_id]
    );
    
    const newPokemon = {
      id: (result as any).insertId,
      name,
      type,
      pokemon_id
    };
    
    res.status(201).json(newPokemon);
  } catch (error) {
    console.error('Error creating Pokemon:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update the updatePokemon function
export const updatePokemon = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, type } = req.body;
    
    if (!name || !type) {
      return res.status(400).json({ message: 'Name and type are required' });
    }
    
    const [result] = await pool.query(
      'UPDATE pokemon SET name = ?, type = ? WHERE pokemon_id = ?',
      [name, type, id]
    );
    
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ message: 'Pokemon not found' });
    }
    
    res.status(200).json({ pokemon_id: id, name, type });
  } catch (error) {
    console.error('Error updating Pokemon:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a Pokemon
export const deletePokemon = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // When a Pokemon is deleted, all its moves should be deleted
    // This is handled by the ON DELETE CASCADE constraint in the database
    
    const [result] = await pool.query(
      'DELETE FROM pokemon WHERE pokemon_id = ?',
      [id]
    );
    
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ message: 'Pokemon not found' });
    }
    
    res.status(200).json({ message: 'Pokemon deleted successfully' });
  } catch (error) {
    console.error('Error deleting Pokemon:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a move to a Pokemon
export const addMoveToPokemon = async (req: Request, res: Response) => {
  try {
    const { pokemonId, moveName } = req.body;
    
    if (!pokemonId || !moveName) {
      return res.status(400).json({ message: 'Pokemon ID and move name are required' });
    }
    
    // Check if Pokemon exists
    const [pokemonRows] = await pool.query(
      'SELECT * FROM pokemon WHERE pokemon_id = ?',
      [pokemonId]
    );
    
    if ((pokemonRows as any[]).length === 0) {
      return res.status(404).json({ message: 'Pokemon not found' });
    }
    
    // Add move to Pokemon
    const [result] = await pool.query(
      'INSERT INTO pokemon_moves (pokemon_id, move_name) VALUES (?, ?)',
      [pokemonId, moveName]
    );
    
    const newMove = {
      id: (result as any).insertId,
      pokemon_id: pokemonId,
      move_name: moveName
    };
    
    res.status(201).json(newMove);
  } catch (error) {
    console.error('Error adding move to Pokemon:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a Pokemon move
export const updatePokemonMove = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { moveName } = req.body;
    
    if (!moveName) {
      return res.status(400).json({ message: 'Move name is required' });
    }
    
    const [result] = await pool.query(
      'UPDATE pokemon_moves SET move_name = ? WHERE id = ?',
      [moveName, id]
    );
    
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ message: 'Move not found' });
    }
    
    res.status(200).json({ id: parseInt(id), move_name: moveName });
  } catch (error) {
    console.error('Error updating Pokemon move:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a Pokemon move
export const deletePokemonMove = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const [result] = await pool.query(
      'DELETE FROM pokemon_moves WHERE id = ?',
      [id]
    );
    
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ message: 'Move not found' });
    }
    
    res.status(200).json({ message: 'Move deleted successfully' });
  } catch (error) {
    console.error('Error deleting Pokemon move:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Pokémon available for assignment to trainers (not assigned to any trainer)
export const getAvailablePokemonForTrainer = async (req: Request, res: Response) => {
  try {
    // Use a subquery to find Pokémon NOT already assigned to any trainer
    const [availablePokemonRows] = await pool.query(`
      SELECT p.* FROM pokemon p
      WHERE p.pokemon_id NOT IN (
        SELECT pokemon_reference FROM trainer_pokemon
      );
    `);
    
    // Get moves for each available Pokémon
    const availablePokemonWithMoves = await Promise.all(
      (availablePokemonRows as any[]).map(async (pokemon) => {
        const [moves] = await pool.query(
          'SELECT * FROM pokemon_moves WHERE pokemon_id = ?',
          [pokemon.pokemon_id]
        );
        
        return {
          ...pokemon,
          moves: moves as any[]
        };
      })
    );
    
    res.status(200).json(availablePokemonWithMoves);
  } catch (error) {
    console.error('Error getting available Pokémon for trainers:', error);
    res.status(500).json({ message: 'Server error' });
  }
};