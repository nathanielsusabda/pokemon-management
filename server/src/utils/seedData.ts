// server/src/utils/seedData.ts
import pool from '../config/db';
import { v4 as uuidv4 } from 'uuid';

export async function seedDatabase() {
  try {
    console.log('Checking if database needs seeding...');
    
    // Check if trainers table already has data
    const [trainersRows] = await pool.query('SELECT * FROM trainers LIMIT 1');
    
    if ((trainersRows as any[]).length > 0) {
      console.log('Database already has data, skipping seed process');
      return;
    }
    
    console.log('Seeding database with initial data...');
    
    // Create trainers
    const trainers = [
      { name: 'Ash Ketchum' },
      { name: 'Misty' },
      { name: 'Brock' }
    ];
    
    // Insert trainers
    for (const trainer of trainers) {
      const [trainerResult] = await pool.query(
        'INSERT INTO trainers (name) VALUES (?)',
        [trainer.name]
      );
      const trainerId = (trainerResult as any).insertId;
      
      // Create Pokemon for each trainer
      const pokemon = [
        {
          name: `${trainer.name}'s Gyrados`,
          moves: ['Aqua Tail', 'Hyper Beam', 'Hurricane'],
          type: 'Water'
        },
        {
          name: `${trainer.name}'s Charizard`,
          moves: ['Flamethrower', 'Dragon Claw', 'Fly'],
          type: 'Fire'
        },
        {
          name: `${trainer.name}'s Bulbasaur`,
          moves: ['Vine Whip', 'Razor Leaf', 'Solar Beam'],
          type: 'Grass'
        }
      ];
      
      // Insert Pokemon for this trainer
      for (const poke of pokemon) {
        const pokemonId = uuidv4();
        
        // Insert Pokemon
        await pool.query(
          'INSERT INTO pokemon (name, type, pokemon_id) VALUES (?, ?, ?)',
          [poke.name, poke.type, pokemonId]
        );
        
        // Link Pokemon to trainer
        await pool.query(
          'INSERT INTO trainer_pokemon (trainer_id, pokemon_reference) VALUES (?, ?)',
          [trainerId, pokemonId]
        );
        
        // Add moves for this Pokemon
        for (const moveName of poke.moves) {
          await pool.query(
            'INSERT INTO pokemon_moves (pokemon_id, move_name) VALUES (?, ?)',
            [pokemonId, moveName]
          );
        }
      }
    }
    
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}