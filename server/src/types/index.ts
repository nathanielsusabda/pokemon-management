// src/types/index.ts
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