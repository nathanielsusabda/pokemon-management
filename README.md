# Pokémon Management Application

A full-stack web application for managing Pokémon trainers, their Pokémon, and their moves.

## Features

- Manage trainers (add, edit, delete)
- Manage Pokémon (add, edit, delete)
- Manage Pokémon moves (add, delete)
- Assign Pokémon to trainers
- Search for trainers by name or Pokémon

## Tech Stack

### Frontend
- React
- TypeScript
- Redux Toolkit (RTK Query)
- Material UI
- React Router

### Backend
- Node.js
- Express
- TypeScript
- MySQL

## Project Structure

```
pokemon-management/
├── client/                     # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── api/                # RTK Query API definitions
│   │   ├── components/         # Reusable UI components
│   │   ├── features/           # Feature-specific components
│   │   │   ├── trainers/
│   │   │   ├── pokemon/
│   │   │   └── moves/
│   │   ├── store/              # Redux store configuration
│   │   ├── types/              # TypeScript interfaces
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── package.json
│   └── tsconfig.json
│
├── server/                     # Node.js/Express Backend
│   ├── src/
│   │   ├── config/             # Database configuration
│   │   ├── controllers/        # Request handlers
│   │   ├── models/             # Database models
│   │   ├── routes/             # API routes
│   │   ├── types/              # TypeScript interfaces
│   │   ├── utils/              # Helper functions
│   │   └── index.ts            # Entry point
│   ├── package.json
│   └── tsconfig.json
│
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v14+)
- MySQL (v8+)

### Database Setup

1. Create a MySQL database named `pokemon_management`
2. Configure database connection in `server/.env` (sample provided in `server/.env.example`)

### Installation

1. Clone the repository
2. Install server dependencies:
   ```bash
   cd server
   npm install
   ```
3. Install client dependencies:
   ```bash
   cd client
   npm install
   ```

### Running the Application

1. Start the server:
   ```bash
   cd server
   npm run dev
   ```
2. Start the client:
   ```bash
   cd client
   npm start
   ```
3. Open your browser and navigate to `http://localhost:3000`

## API Endpoints

### Trainers
- `GET /api/trainers` - Get all trainers with their Pokémon and moves
- `GET /api/trainers/:id` - Get a single trainer by ID
- `POST /api/trainers` - Create a new trainer
- `PUT /api/trainers/:id` - Update a trainer
- `DELETE /api/trainers/:id` - Delete a trainer
- `POST /api/trainers/pokemon` - Add a Pokémon to a trainer
- `GET /api/trainers/search` - Search trainers by name or Pokémon

### Pokémon
- `GET /api/pokemon` - Get all Pokémon with their moves
- `GET /api/pokemon/:id` - Get a single Pokémon by ID
- `POST /api/pokemon` - Create a new Pokémon
- `PUT /api/pokemon/:id` - Update a Pokémon
- `DELETE /api/pokemon/:id` - Delete a Pokémon

### Moves
- `POST /api/moves` - Add a move to a Pokémon
- `PUT /api/moves/:id` - Update a move
- `DELETE /api/moves/:id` - Delete a move

## Data Models

### Trainers
```
{
  id: number;
  name: string;
  pokemon: PokemonWithMoves[];
}
```

### Pokémon
```
{
  id: number;
  name: string;
  type: string;
  pokemon_id: string;
  moves: PokemonMove[];
}
```

### Pokémon Moves
```
{
  id: number;
  pokemon_id: string;
  move_name: string;
}
```

## Database Schema

### trainers
- `id` (Primary Key, Auto Increment)
- `name` (VARCHAR)

### pokemon
- `id` (Primary Key, Auto Increment)
- `name` (VARCHAR)
- `type` (VARCHAR)
- `pokemon_id` (VARCHAR, Unique)

### pokemon_moves
- `id` (Primary Key, Auto Increment)
- `pokemon_id` (Foreign Key linking to pokemon table)
- `move_name` (VARCHAR)

### trainer_pokemon
- `trainer_id` (Foreign Key linking to trainers table)
- `pokemon_reference` (Foreign Key linking to pokemon table)

```

┌─────────────┐       ┌──────────────────────┐       ┌───────────────┐
│   trainers  │       │   trainer_pokemon    │       │    pokemon    │
├─────────────┤       ├──────────────────────┤       ├───────────────┤
│ id (PK)     │◄──────┤ trainer_id (PK, FK1) │       │ id (PK)       │
│ name        │       │ pokemon_reference    │──────►│ name          │
│             │       │    (PK, FK2)         │       │ type          │
└─────────────┘       └──────────────────────┘       │ pokemon_id    │
                                                     │  (Unique)     │
                                                     └───────┬───────┘
                                                             │
                                                             │
                                                             │
                                                             │
                                                             ▼
                                                      ┌───────────────┐
                                                      │ pokemon_moves │
                                                      ├───────────────┤
                                                      │ id (PK)       │
                                                      │ pokemon_id    │
                                                      │   (FK)        │
                                                      │ move_name     │
                                                      └───────────────┘
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
