import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { Pokemon, PokemonMatches, PokemonMatchesQuery } from "./types"

export const pokemonApi = createApi({
  reducerPath: "pokemonApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5075/api/" }),
  endpoints: (builder) => ({
    getPokemonByName: builder.query<Pokemon, string>({
      query: (name) => `pokemon/${name}`,
    }),
    getPokemonMatchesByName: builder.query<
      PokemonMatches | void,
      PokemonMatchesQuery
    >({
      queryFn: async ({ name, page }, api, extraOptions, baseQuery) => {
        if (name.length > 2) {
          return baseQuery(`pokemon/matches/${name}/?page=${page}`) as {
            data: PokemonMatches
          }
        }
        return { data: undefined }
      },
    }),
  }),
})

export const { useGetPokemonByNameQuery, useGetPokemonMatchesByNameQuery } =
  pokemonApi
