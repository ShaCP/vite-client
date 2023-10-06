import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { Pokemon } from "./types"
import { QueryReturnValue } from "@reduxjs/toolkit/dist/query/baseQueryTypes"

export const pokemonApi = createApi({
  reducerPath: "pokemonApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5075/api/" }),
  endpoints: (builder) => ({
    getPokemonByName: builder.query<Pokemon, string>({
      query: (name) => `pokemon/${name}`,
    }),
    getPokemonMatchesByName: builder.query<string[], string>({
      queryFn: async (name, api, extraOptions, baseQuery) => {
        if (name.length > 2) {
          return baseQuery(`pokemon/matches/${name}`) as { data: string[] }
        }
        return { data: [] }
      },
    }),
  }),
})

export const { useGetPokemonByNameQuery, useGetPokemonMatchesByNameQuery } =
  pokemonApi
