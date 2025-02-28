// server/src/utils/resetDatabase.ts
import pool from '../config/db';
import { seedDatabase } from './seedData';

export async function resetAndSeedDatabase() {
  try {
    console.log('Resetting database...');
    
    // Delete all data from tables in the correct order to respect foreign keys
    await pool.query('DELETE FROM pokemon_moves');
    await pool.query('DELETE FROM trainer_pokemon');
    await pool.query('DELETE FROM pokemon');
    await pool.query('DELETE FROM trainers');
    
    console.log('Database reset complete');
    
    // Seed the database with new data
    await seedDatabase();
    
    console.log('Database reset and seed complete!');
  } catch (error) {
    console.error('Error resetting database:', error);
    throw error;
  }
}

// Run the reset if this file is executed directly
if (require.main === module) {
  resetAndSeedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}