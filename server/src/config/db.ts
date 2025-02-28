// src/config/db.ts
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'pokemon_management',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Database initialization function
export async function initializeDatabase() {
  try {
    // Create Trainers table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS trainers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL
      )
    `);

    // Create Pokemon table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pokemon (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        pokemon_id VARCHAR(255) UNIQUE NOT NULL
      )
    `);

    // Create Pokemon_Moves table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pokemon_moves (
        id INT AUTO_INCREMENT PRIMARY KEY,
        pokemon_id VARCHAR(255) NOT NULL,
        move_name VARCHAR(255) NOT NULL,
        FOREIGN KEY (pokemon_id) REFERENCES pokemon(pokemon_id) ON DELETE CASCADE
      )
    `);

    // Create junction table for Trainers and Pokemon
    await pool.query(`
      CREATE TABLE IF NOT EXISTS trainer_pokemon (
        trainer_id INT NOT NULL,
        pokemon_reference VARCHAR(255) NOT NULL,
        PRIMARY KEY (trainer_id, pokemon_reference),
        FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE CASCADE,
        FOREIGN KEY (pokemon_reference) REFERENCES pokemon(pokemon_id) ON DELETE CASCADE
      )
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

export default pool;