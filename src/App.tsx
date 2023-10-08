import {
  useGetPokemonByNameQuery,
  useGetPokemonMatchesByNameQuery,
} from "./features/entities/pokemonApi"
import "./App.css"
import { useEffect, useState } from "react"
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query"
import { SerializedError } from "@reduxjs/toolkit"

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
  })

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

  const debouncedPokemonName = useDebounce<string>(pokemonName ?? "", {
    debounce: !!pokemonName && pokemonName.length > 2,
  })

  const {
    currentData: pokemonMatches,
    isLoading,
    isError,
    error,
  } = useGetPokemonMatchesByNameQuery({
    name: debouncedPokemonName.toLowerCase(),
    page,
  })

  const { data: pokemon } = useGetPokemonByNameQuery(selectedPokemonName, {
    skip: !selectedPokemonName,
  })

  const onPokemonNameChange = (value: string | null) => {
    setPokemonName(value)
    setPage(1)
  }

  const onPokemonSelection = (value: string) => {
    setSelectedPokemonName(value)
    setPokemonName("")
  }

  const onPaginate = () => setPage((pg) => pg + 1)

  const errMsg: React.ReactNode = error ? getErrorMsg(error) : null

  return (
    <div className="App flex flex-col items-center">
      <div className="w-56 mt-10">
        <TypeAhead
          className="border-2 border-slate-200 p-1"
          value={pokemonName ?? selectedPokemonName}
          onInputChange={onPokemonNameChange}
          onSelection={onPokemonSelection}
          onPaginate={onPaginate}
          placeholder="Enter pokemon name"
          options={pokemonMatches?.results}
          showPagination={page < (pokemonMatches?.totalPages ?? 0)}
        />
        {isLoading ? (
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

type TypeaheadProps = {
  value: string
  options?: string[]
  onInputChange: (value: string | null) => void
  onSelection: (value: string) => void
  onPaginate: () => void
  className: string
  showPagination: boolean
  placeholder: string
}

const TypeAhead = ({
  value = "",
  options = [],
  onInputChange,
  onSelection,
  onPaginate,
  showPagination = false,
  className,
  placeholder,
}: TypeaheadProps) => {
  const [localValue, setLocalValue] = useState<string | null>("")

  useEffect(() => {
    onInputChange(localValue)
  }, [localValue])

  return (
    <div className="flex flex-col relative">
      <input
        className={className}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setLocalValue(e.target.value)}
      />
      {options.length > 0 && (
        <ul
          role="listbox"
          className={`text-left absolute top-full bg-white w-full ${
            options.length > 0 ? "border-2 border-slate-200" : ""
          }`}
        >
          {options.map((o) => (
            <li
              className="p-1 hover:bg-slate-200 cursor-pointer"
              key={o}
              role="option"
              onClick={() => {
                onSelection(o)
                onInputChange(null)
                setLocalValue(null)
              }}
            >
              {o}
            </li>
          ))}
          {options.length > 0 && showPagination && (
            <li
              className="p-1 bg-slate-100 hover:bg-slate-200 cursor-pointer text-center"
              onClick={onPaginate}
            >
              More results...
            </li>
          )}
        </ul>
      )}
    </div>
  )
}
export default App
