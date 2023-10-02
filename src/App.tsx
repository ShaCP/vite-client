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
        console.log("debounce")
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
  const [pokemonName, setPokemonName] = useState("")
  const [selectedPokemonName, setSelectedPokemonName] = useState("")

  const debouncedPokemonName = useDebounce<string>(pokemonName, {
    debounce: pokemonName.length > 2,
  })

  const {
    currentData: pokemonMatches,
    isLoading,
    isError,
    error,
  } = useGetPokemonMatchesByNameQuery(debouncedPokemonName.toLowerCase(), {
    skip: debouncedPokemonName.length < 3,
  })

  const { data: pokemon } = useGetPokemonByNameQuery(selectedPokemonName, {
    skip: !selectedPokemonName,
  })

  const onPokemonNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPokemonName(e.target.value)
  }

  const onPokemonSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPokemonName(e.target.value)
    setPokemonName(e.target.value)
  }

  const errMsg: React.ReactNode = error ? getErrorMsg(error) : null

  return (
    <div className="App flex flex-col items-center">
      <div className="w-56 mt-10">
        <TypeAhead
          className="border-2 border-slate-200 p-1"
          value={pokemonName}
          selectedValue={selectedPokemonName}
          onValueChange={onPokemonNameChange}
          onSelectionChange={onPokemonSelectChange}
          placeholder="Enter pokemon name"
          options={pokemonMatches}
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
  selectedValue: string
  options?: string[]
  onValueChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSelectionChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  className: string
  placeholder: string
}

const TypeAhead = ({
  value = "",
  selectedValue = "",
  options = [],
  onValueChange,
  onSelectionChange,
  className,
  placeholder,
}: TypeaheadProps) => {
  return (
    <div>
      <input
        className={className}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          onValueChange(e)
        }}
      />
      <ul role="listbox">
        {options.map((o) => (
          <li key={o} role="option">
            <label>
              {o}
              <input
                style={{ display: "none" }}
                type="radio"
                value={o}
                onChange={(e) => {
                  onSelectionChange(e)
                }}
                checked={selectedValue === o}
              />
            </label>
          </li>
        ))}
      </ul>
    </div>
  )
}
export default App
