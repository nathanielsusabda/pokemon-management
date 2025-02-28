// server/src/controllers/battleController.ts
import { Request, Response } from 'express';
import pool from '../config/db';
import battleService from '../battle/battleService';

// Map to store Pokemon types (in a real app, this would be in the database)
const pokemonTypes: Record<string, string> = {
  'Pikachu': 'Electric', // Adding Electric type for variety
  'Charizard': 'Fire',
  'Bulbasaur': 'Grass',
  'Squirtle': 'Water',
  'Charmander': 'Fire',
  'Ivysaur': 'Grass',
  'Wartortle': 'Water',
};

// Default to these types if the name isn't in our map
const getTypeByName = (name: string): string => {
  // Check if the name contains a type identifier
  if (name.toLowerCase().includes('pikachu')) return 'Electric';
  if (name.toLowerCase().includes('char')) return 'Fire';
  if (name.toLowerCase().includes('bulba') || name.toLowerCase().includes('ivy')) return 'Grass';
  if (name.toLowerCase().includes('squirt') || name.toLowerCase().includes('wart')) return 'Water';
  
  // Fallback to a random type
  const types = ['Fire', 'Water', 'Grass'];
  return types[Math.floor(Math.random() * types.length)];
};

// Battle two Pokemon
// In battleController.ts, update the battlePokemon function
export const battlePokemon = async (req: Request, res: Response) => {
  try {
    const { pokemon1Id, pokemon2Id } = req.body;
    
    if (!pokemon1Id || !pokemon2Id) {
      return res.status(400).json({ message: 'Both Pokemon IDs are required' });
    }
    
    // Get Pokemon details from database
    const [pokemon1Rows] = await pool.query(
      'SELECT * FROM pokemon WHERE pokemon_id = ?',
      [pokemon1Id]
    );
    
    const [pokemon2Rows] = await pool.query(
      'SELECT * FROM pokemon WHERE pokemon_id = ?',
      [pokemon2Id]
    );
    
    if ((pokemon1Rows as any[]).length === 0 || (pokemon2Rows as any[]).length === 0) {
      return res.status(404).json({ message: 'One or both Pokemon not found' });
    }
    
    const pokemon1 = (pokemon1Rows as any[])[0];
    const pokemon2 = (pokemon2Rows as any[])[0];
    
    // Use the type directly from the database
    const pokemon1Type = pokemon1.type || 'Normal';
    const pokemon2Type = pokemon2.type || 'Normal';
    
    // Use the C++ module to determine battle outcome
    const battleResult = battleService.battle(pokemon1Type, pokemon2Type);
    
    // Return battle result
    res.status(200).json({
      pokemon1: {
        id: pokemon1.pokemon_id,
        name: pokemon1.name,
        type: pokemon1Type
      },
      pokemon2: {
        id: pokemon2.pokemon_id,
        name: pokemon2.name,
        type: pokemon2Type
      },
      result: battleResult
    });
  } catch (error) {
    console.error('Error during battle:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a list of available Pokemon for battle
export const getAvailablePokemon = async (req: Request, res: Response) => {
  try {
    const [pokemonRows] = await pool.query('SELECT * FROM pokemon');
    
    const availablePokemon = (pokemonRows as any[]).map(pokemon => {
      return {
        id: pokemon.pokemon_id,
        name: pokemon.name,
        type: pokemon.type || 'Normal' // Use the type from the database with a fallback
      };
    });
    
    res.status(200).json(availablePokemon);
  } catch (error) {
    console.error('Error getting available Pokemon:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get trainers with their Pokemon for battle selection
export const getTrainersWithPokemon = async (req: Request, res: Response) => {
  try {
    const [trainers] = await pool.query('SELECT * FROM trainers');
    
    const trainersWithPokemon = await Promise.all(
      (trainers as any[]).map(async (trainer) => {
        const [pokemonRows] = await pool.query(
          `SELECT p.* FROM pokemon p
           JOIN trainer_pokemon tp ON p.pokemon_id = tp.pokemon_reference
           WHERE tp.trainer_id = ?`,
          [trainer.id]
        );
        
        const pokemon = (pokemonRows as any[]).map(p => {
          return {
            id: p.pokemon_id,
            name: p.name,
            type: p.type || 'Normal' // Use the type from the database with a fallback
          };
        });
        
        return {
          id: trainer.id,
          name: trainer.name,
          pokemon
        };
      })
    );
    
    res.status(200).json(trainersWithPokemon);
  } catch (error) {
    console.error('Error getting trainers with Pokemon:', error);
    res.status(500).json({ message: 'Server error' });
  }
};