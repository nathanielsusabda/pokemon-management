// client/src/api/apiSlice.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  Trainer,
  TrainerWithPokemon,
  Pokemon,
  PokemonWithMoves,
  PokemonMove,
  CreateTrainerRequest,
  UpdateTrainerRequest,
  CreatePokemonRequest,
  UpdatePokemonRequest,
  AddPokemonToTrainerRequest,
  AddMoveToPokemonRequest,
  UpdateMoveRequest,
  // Battle
  BattleResult,
  AvailablePokemon,
  TrainerWithBattlePokemon
} from '../types';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: process.env.REACT_APP_API_URL || '/api'
  }),
  tagTypes: ['Trainer', 'Pokemon', 'Move'],
  endpoints: (builder) => ({
    // Trainer endpoints
    getTrainers: builder.query<TrainerWithPokemon[], void>({
      query: () => '/trainers',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Trainer' as const, id })),
              { type: 'Trainer', id: 'LIST' }
            ]
          : [{ type: 'Trainer', id: 'LIST' }]
    }),
    
    getTrainerById: builder.query<TrainerWithPokemon, number>({
      query: (id) => `/trainers/${id}`,
      providesTags: (result, error, id) => [{ type: 'Trainer', id }]
    }),
    
    createTrainer: builder.mutation<Trainer, CreateTrainerRequest>({
      query: (body) => ({
        url: '/trainers',
        method: 'POST',
        body
      }),
      invalidatesTags: [{ type: 'Trainer', id: 'LIST' }]
    }),
    
    updateTrainer: builder.mutation<Trainer, UpdateTrainerRequest>({
      query: ({ id, ...body }) => ({
        url: `/trainers/${id}`,
        method: 'PUT',
        body
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Trainer', id },
        { type: 'Trainer', id: 'LIST' }
      ]
    }),
    
    deleteTrainer: builder.mutation<void, number>({
      query: (id) => ({
        url: `/trainers/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: [{ type: 'Trainer', id: 'LIST' }, { type: 'Pokemon', id: 'LIST' }]
    }),
    
    addPokemonToTrainer: builder.mutation<void, AddPokemonToTrainerRequest>({
      query: (body) => ({
        url: '/trainers/pokemon',
        method: 'POST',
        body
      }),
      invalidatesTags: (result, error, { trainerId }) => [
        { type: 'Trainer', id: trainerId },
        { type: 'Trainer', id: 'LIST' }
      ]
    }),
    
    searchTrainers: builder.query<Trainer[], string>({
      query: (query) => `/trainers/search?query=${encodeURIComponent(query)}`,
      providesTags: [{ type: 'Trainer', id: 'LIST' }]
    }),
    
    // Pokemon endpoints
    getPokemon: builder.query<PokemonWithMoves[], void>({
      query: () => '/pokemon',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ pokemon_id }) => ({ type: 'Pokemon' as const, id: pokemon_id })),
              { type: 'Pokemon', id: 'LIST' }
            ]
          : [{ type: 'Pokemon', id: 'LIST' }]
    }),
    
    getPokemonById: builder.query<PokemonWithMoves, string>({
      query: (id) => `/pokemon/${id}`,
      providesTags: (result, error, id) => [{ type: 'Pokemon', id }]
    }),

    getAvailablePokemonForTrainer: builder.query<PokemonWithMoves[], void>({
      query: () => '/pokemon/available-for-trainer',
      providesTags: [{ type: 'Pokemon', id: 'AVAILABLE_FOR_TRAINER' }]
    }),
    
    createPokemon: builder.mutation<Pokemon, CreatePokemonRequest>({
      query: (body) => ({
        url: '/pokemon',
        method: 'POST',
        body
      }),
      invalidatesTags: [{ type: 'Pokemon', id: 'LIST' }]
    }),
    
    updatePokemon: builder.mutation<Pokemon, UpdatePokemonRequest>({
      query: ({ id, ...body }) => ({
        url: `/pokemon/${id}`,
        method: 'PUT',
        body
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Pokemon', id },
        { type: 'Pokemon', id: 'LIST' }
      ]
    }),
    
    deletePokemon: builder.mutation<void, string>({
      query: (id) => ({
        url: `/pokemon/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: [{ type: 'Pokemon', id: 'LIST' }, { type: 'Trainer', id: 'LIST' }]
    }),
    
    // Move endpoints
    addMoveToPokemon: builder.mutation<PokemonMove, AddMoveToPokemonRequest>({
      query: (body) => ({
        url: '/moves',
        method: 'POST',
        body
      }),
      invalidatesTags: (result, error, { pokemonId }) => [
        { type: 'Pokemon', id: pokemonId },
        { type: 'Pokemon', id: 'LIST' },
        { type: 'Trainer', id: 'LIST' }
      ]
    }),
    
    updateMove: builder.mutation<PokemonMove, UpdateMoveRequest>({
      query: ({ id, ...body }) => ({
        url: `/moves/${id}`,
        method: 'PUT',
        body
      }),
      invalidatesTags: [
        { type: 'Move', id: 'LIST' },
        { type: 'Pokemon', id: 'LIST' },
        { type: 'Trainer', id: 'LIST' }
      ]
    }),
    
    deleteMove: builder.mutation<void, number>({
      query: (id) => ({
        url: `/moves/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: [
        { type: 'Move', id: 'LIST' },
        { type: 'Pokemon', id: 'LIST' },
        { type: 'Trainer', id: 'LIST' }
      ]
    }),

    // Battle
    battlePokemon: builder.mutation<BattleResult, { pokemon1Id: string; pokemon2Id: string }>({
      query: (body) => ({
        url: '/battle',
        method: 'POST',
        body
      })
    }),

    getAvailablePokemon: builder.query<AvailablePokemon[], void>({
      query: () => '/battle/pokemon',
      providesTags: [{ type: 'Pokemon', id: 'LIST' }]
    }),

    getTrainersWithPokemon: builder.query<TrainerWithBattlePokemon[], void>({
      query: () => '/battle/trainers',
      providesTags: [{ type: 'Trainer', id: 'LIST' }]
    }),
  })
});

export const {
  useGetTrainersQuery,
  useGetTrainerByIdQuery,
  useCreateTrainerMutation,
  useUpdateTrainerMutation,
  useDeleteTrainerMutation,
  useAddPokemonToTrainerMutation,
  useSearchTrainersQuery,
  useGetPokemonQuery,
  useGetPokemonByIdQuery,
  useGetAvailablePokemonForTrainerQuery,
  useCreatePokemonMutation,
  useUpdatePokemonMutation,
  useDeletePokemonMutation,
  useAddMoveToPokemonMutation,
  useUpdateMoveMutation,
  useDeleteMoveMutation,
  useBattlePokemonMutation,
  useGetAvailablePokemonQuery,
  useGetTrainersWithPokemonQuery
} = apiSlice;