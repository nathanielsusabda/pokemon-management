// client/src/types/index.ts

export interface Trainer {
  id?: number;
  name: string;
}

export interface Pokemon {
  id?: number;
  name: string;
  type: string;
  pokemon_id: string;
}

export interface PokemonMove {
  id?: number;
  pokemon_id: string;
  move_name: string;
}

export interface TrainerPokemon {
  trainer_id: number;
  pokemon_reference: string;
}

export interface TrainerWithPokemon extends Trainer {
  pokemon: PokemonWithMoves[];
}

export interface PokemonWithMoves extends Pokemon {
  moves: PokemonMove[];
}

// Request types
export interface CreateTrainerRequest {
  name: string;
}

export interface UpdateTrainerRequest {
  id: number;
  name: string;
}

export interface CreatePokemonRequest {
  name: string;
  type: string;
}

export interface UpdatePokemonRequest {
  id: string;
  name: string;
  type: string;
}

export interface AddPokemonToTrainerRequest {
  trainerId: number;
  pokemonId: string;
}

export interface AddMoveToPokemonRequest {
  pokemonId: string;
  moveName: string;
}

export interface UpdateMoveRequest {
  id: number;
  moveName: string;
}

export interface SearchTrainersRequest {
  query: string;
}


export interface BattleResult {
  pokemon1: {
    id: string;
    name: string;
    type: string;
  };
  pokemon2: {
    id: string;
    name: string;
    type: string;
  };
  result: {
    winner: number; // 0 for draw, 1 for Pokemon 1, 2 for Pokemon 2
    message: string;
  };
}

export interface AvailablePokemon {
  id: string;
  name: string;
  type: string;
}

export interface BattlePokemon {
  id: string;
  name: string;
  type: string;
}

export interface TrainerWithBattlePokemon {
  id: number;
  name: string;
  pokemon: BattlePokemon[];
}