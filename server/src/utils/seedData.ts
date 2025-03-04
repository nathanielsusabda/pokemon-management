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
    
    // Define distinct Pokémon for each trainer
    const trainerPokemon = [
      // Ash's Pokémon
      [
        { name: 'Pikachu', type: 'Water', moves: ['Thunderbolt', 'Quick Attack', 'Iron Tail'] },
        { name: 'Charizard', type: 'Fire', moves: ['Flamethrower', 'Dragon Claw', 'Fly'] },
        { name: 'Bulbasaur', type: 'Grass', moves: ['Vine Whip', 'Razor Leaf', 'Solar Beam'] }
      ],
      // Misty's Pokémon
      [
        { name: 'Starmie', type: 'Grass', moves: ['Water Gun', 'Rapid Spin', 'Psychic'] },
        { name: 'Goldeen', type: 'Water', moves: ['Horn Attack', 'Waterfall', 'Fury Attack'] },
        { name: 'Psyduck', type: 'Fire', moves: ['Confusion', 'Water Gun', 'Scratch'] }
      ],
      // Brock's Pokémon
      [
        { name: 'Onix', type: 'Grass', moves: ['Rock Throw', 'Bind', 'Tackle'] },
        { name: 'Geodude', type: 'Water', moves: ['Rock Throw', 'Seismic Toss', 'Tackle'] },
        { name: 'Vulpix', type: 'Fire', moves: ['Ember', 'Quick Attack', 'Confuse Ray'] }
      ]
    ];
    
    // Insert trainers and their Pokémon
    for (let i = 0; i < trainers.length; i++) {
      const trainer = trainers[i];
      const pokemon = trainerPokemon[i];
      
      // Insert trainer
      const [trainerResult] = await pool.query(
        'INSERT INTO trainers (name) VALUES (?)',
        [trainer.name]
      );
      const trainerId = (trainerResult as any).insertId;
      
      // Insert Pokémon for this trainer
      for (const poke of pokemon) {
        const pokemonId = uuidv4();
        
        // Insert Pokémon
        await pool.query(
          'INSERT INTO pokemon (name, type, pokemon_id) VALUES (?, ?, ?)',
          [poke.name, poke.type, pokemonId]
        );
        
        // Link Pokémon to trainer
        await pool.query(
          'INSERT INTO trainer_pokemon (trainer_id, pokemon_reference) VALUES (?, ?)',
          [trainerId, pokemonId]
        );
        
        // Add moves for this Pokémon
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