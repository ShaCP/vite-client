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
      queryFn: async (name, queryApi, extraOptions, baseQuery) => {
        // Check the argument passed to the endpoint
        if (!name || name.length < 3) {
          // If it matches the condition, return a custom value
          return { data: []  }
        }

        // If not, proceed with the actual HTTP call to the specific endpoint
        const result = await baseQuery(`pokemon/matches/${name}`) as { data: string[] }

        return result
      },
    }),
  }),
})

export const {
  useGetPokemonByNameQuery,
  useGetPokemonMatchesByNameQuery,
  useLazyGetPokemonMatchesByNameQuery,
} = pokemonApi
