// server/src/controllers/trainerController.ts
import { Request, Response } from 'express';
import pool from '../config/db';
import { Trainer, TrainerWithPokemon, PokemonWithMoves } from '../types';

// Get all trainers with their Pokemon and moves
export const getAllTrainers = async (req: Request, res: Response) => {
  try {
    const [trainers] = await pool.query('SELECT * FROM trainers');
    
    const trainersWithPokemon: TrainerWithPokemon[] = await Promise.all(
      (trainers as Trainer[]).map(async (trainer) => {
        // Get all Pokemon for this trainer
        const [trainerPokemonRows] = await pool.query(
          `SELECT p.* FROM pokemon p
           JOIN trainer_pokemon tp ON p.pokemon_id = tp.pokemon_reference
           WHERE tp.trainer_id = ?`,
          [trainer.id]
        );
        
        // Get moves for each Pokemon
        const pokemonWithMoves: PokemonWithMoves[] = await Promise.all(
          (trainerPokemonRows as any[]).map(async (pokemon) => {
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
        
        return {
          ...trainer,
          pokemon: pokemonWithMoves
        };
      })
    );
    
    res.status(200).json(trainersWithPokemon);
  } catch (error) {
    console.error('Error getting trainers:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single trainer by ID with their Pokemon and moves
export const getTrainerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const [trainerRows] = await pool.query(
      'SELECT * FROM trainers WHERE id = ?',
      [id]
    );
    
    if ((trainerRows as any[]).length === 0) {
      return res.status(404).json({ message: 'Trainer not found' });
    }
    
    const trainer = (trainerRows as any[])[0];
    
    // Get all Pokemon for this trainer
    const [trainerPokemonRows] = await pool.query(
      `SELECT p.* FROM pokemon p
       JOIN trainer_pokemon tp ON p.pokemon_id = tp.pokemon_reference
       WHERE tp.trainer_id = ?`,
      [id]
    );
    
    // Get moves for each Pokemon
    const pokemonWithMoves = await Promise.all(
      (trainerPokemonRows as any[]).map(async (pokemon) => {
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
    
    const trainerWithPokemon = {
      ...trainer,
      pokemon: pokemonWithMoves
    };
    
    res.status(200).json(trainerWithPokemon);
  } catch (error) {
    console.error('Error getting trainer:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new trainer
export const createTrainer = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    
    const [result] = await pool.query(
      'INSERT INTO trainers (name) VALUES (?)',
      [name]
    );
    
    const newTrainer = {
      id: (result as any).insertId,
      name
    };
    
    res.status(201).json(newTrainer);
  } catch (error) {
    console.error('Error creating trainer:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a trainer
export const updateTrainer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    
    const [result] = await pool.query(
      'UPDATE trainers SET name = ? WHERE id = ?',
      [name, id]
    );
    
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ message: 'Trainer not found' });
    }
    
    res.status(200).json({ id: parseInt(id), name });
  } catch (error) {
    console.error('Error updating trainer:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a trainer
export const deleteTrainer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Get all Pokémon owned by this trainer before deleting
    const [pokemonRows] = await pool.query(
      `SELECT pokemon_reference FROM trainer_pokemon WHERE trainer_id = ?`,
      [id]
    );
    
    const pokemonIds = (pokemonRows as any[]).map(row => row.pokemon_reference);
    
    // Delete the trainer
    const [result] = await pool.query(
      'DELETE FROM trainers WHERE id = ?',
      [id]
    );
    
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ message: 'Trainer not found' });
    }
    
    // Delete Pokémon that aren't linked to any trainer anymore
    const [deleteResult] = await pool.query(`
      DELETE FROM pokemon 
      WHERE pokemon_id IN (?) 
      AND pokemon_id NOT IN (SELECT pokemon_reference FROM trainer_pokemon)
    `, [pokemonIds]);
    
    res.status(200).json({
      message: 'Trainer deleted successfully',
      deletedPokemonCount: (deleteResult as any).affectedRows
    });
  } catch (error) {
    console.error('Error deleting trainer:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
// Add a Pokemon to a trainer
export const addPokemonToTrainer = async (req: Request, res: Response) => {
  try {
    const { trainerId, pokemonId } = req.body;
    
    if (!trainerId || !pokemonId) {
      return res.status(400).json({ message: 'Trainer ID and Pokemon ID are required' });
    }
    
    // Check if trainer exists
    const [trainerRows] = await pool.query(
      'SELECT * FROM trainers WHERE id = ?',
      [trainerId]
    );
    
    if ((trainerRows as any[]).length === 0) {
      return res.status(404).json({ message: 'Trainer not found' });
    }
    
    // Check if Pokemon exists
    const [pokemonRows] = await pool.query(
      'SELECT * FROM pokemon WHERE pokemon_id = ?',
      [pokemonId]
    );
    
    if ((pokemonRows as any[]).length === 0) {
      return res.status(404).json({ message: 'Pokemon not found' });
    }
    
    // Check if this Pokemon is already assigned to this trainer
    const [existingRows] = await pool.query(
      'SELECT * FROM trainer_pokemon WHERE trainer_id = ? AND pokemon_reference = ?',
      [trainerId, pokemonId]
    );
    
    if ((existingRows as any[]).length > 0) {
      return res.status(400).json({ message: 'This Pokemon is already assigned to this trainer' });
    }
    
    // Add Pokemon to trainer
    await pool.query(
      'INSERT INTO trainer_pokemon (trainer_id, pokemon_reference) VALUES (?, ?)',
      [trainerId, pokemonId]
    );
    
    res.status(201).json({ message: 'Pokemon added to trainer successfully' });
  } catch (error) {
    console.error('Error adding Pokemon to trainer:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Search trainers by name or owned Pokemon
export const searchTrainers = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    // Search trainers by name or owned Pokemon
    const [rows] = await pool.query(
      `SELECT DISTINCT t.* FROM trainers t
       LEFT JOIN trainer_pokemon tp ON t.id = tp.trainer_id
       LEFT JOIN pokemon p ON tp.pokemon_reference = p.pokemon_id
       WHERE t.name LIKE ? OR p.name LIKE ?`,
      [`%${query}%`, `%${query}%`]
    );
    
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error searching trainers:', error);
    res.status(500).json({ message: 'Server error' });
  }
};