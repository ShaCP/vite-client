import {
  useGetPokemonByNameQuery,
  useGetPokemonMatchesByNameQuery,
} from "./features/entities/pokemonApi"
import "./App.css"
import { useEffect, useState } from "react"
import { SerializedError } from "@reduxjs/toolkit"
import { TypeAhead } from "./TypeAhead"
import { FetchBaseQueryError } from "@reduxjs/toolkit/query"

function useDebounce<T>(value: T, { delay = 1000, debounce = true }) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    let handler: number
    if (debounce) {
      handler = window.setTimeout(() => {
        setDebouncedValue(value)
      }, delay)
    } else {
      setDebouncedValue(value)
    }
    return () => clearTimeout(handler)
  }, [debounce, delay, value])

  return debouncedValue
}

type ServerError = {
  message: string
}

// Type guard for server error
const getErrorMsg = (error: FetchBaseQueryError | SerializedError): string => {
  const isServerError = (error: any): error is ServerError =>
    error && typeof error.message === "string"

  if ("status" in error) {
    if ("error" in error) {
      return error.error
    } else if (isServerError(error.data)) {
      return error.data.message
    } else {
      return JSON.stringify(error)
    }
  } else if ("message" in error && error.message) {
    return error.message
  }
  return "An error occurred"
}

function App() {
  const [pokemonName, setPokemonName] = useState<null | string>("")
  const [selectedPokemonName, setSelectedPokemonName] = useState("")
  const [page, setPage] = useState(1)
  const [suggestions, setSuggestions] = useState<string[]>([])

  const debouncedPokemonName = useDebounce<string>(pokemonName ?? "", {
    debounce: !!pokemonName && pokemonName.length > 2,
  })

  const {
    // If I use "currentData" instead, there will be an empty array while it loads new results, causing a flash between results
    data: pokemonMatches,
    currentData: currentPokemonMatches,
    isFetching: isLoadingMatches,
    isError,
    error,
  } = useGetPokemonMatchesByNameQuery({
    name: debouncedPokemonName.toLowerCase(),
    page,
  })

  const { data: pokemon, isFetching: isLoadingPokemon } =
    useGetPokemonByNameQuery(selectedPokemonName, {
      skip: !selectedPokemonName,
    })

  useEffect(() => {
    if (page > 1) {
      setSuggestions((suggestions) =>
        suggestions.concat(currentPokemonMatches?.results ?? []),
      )
    } else {
      setSuggestions(pokemonMatches?.results ?? [])
    }
  }, [currentPokemonMatches?.results, page, pokemonMatches?.results])

  const onPokemonNameChange = (value: string | null) => {
    setPokemonName(value)
    setPage(1)
  }

  const onPokemonSelection = (value: string) => {
    setSelectedPokemonName(value)
    setPokemonName("")
  }

  const onPaginate = () => setPage((pg) => pg + 1)

  const errMsg = error ? getErrorMsg(error) : null

  console.log(isLoadingMatches, pokemonMatches, isLoadingPokemon)

  return (
    <div className="App flex flex-col items-center">
      <div className="w-56 mt-10">
        <TypeAhead
          className="border-2 border-slate-200 p-1 typeahead-input"
          value={pokemonName ?? selectedPokemonName}
          onInputChange={onPokemonNameChange}
          onSelection={onPokemonSelection}
          onPaginate={onPaginate}
          placeholder="Enter pokemon name"
          suggestions={suggestions}
          showPagination={page < (pokemonMatches?.totalPages ?? 0)}
          paginationText="More results..."
          isLoading={isLoadingMatches}
        />
        {isLoadingPokemon ? (
          "...loading"
        ) : isError ? (
          <p>{errMsg}</p>
        ) : (
          <div>
            {pokemon?.name}
            {pokemon?.sprites.front_default && (
              <img
                className="w-full"
                alt={`${pokemon?.name.toUpperCase()} sprite`}
                src={pokemon.sprites.front_default}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
