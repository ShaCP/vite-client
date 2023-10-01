import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { Pokemon } from "./types"

export const pokemonApi = createApi({
  reducerPath: "pokemonApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5075/api/" }),
  endpoints: (builder) => ({
    getPokemonByName: builder.query<Pokemon, string>({
      query: (name) => `pokemon/${name}`,
    }),
    getPokemonMatchesByName: builder.query<string[], string>({
      query: (name) => `pokemon/matches/${name}`,
    }),
  }),
})

export const { useGetPokemonByNameQuery, useGetPokemonMatchesByNameQuery } =
  pokemonApi
