import {
  useGetPokemonByNameQuery,
  useGetPokemonMatchesByNameQuery,
  useLazyGetPokemonByNameQuery,
  useLazyGetPokemonMatchesByNameQuery,
} from "./features/entities/pokemonApi"
import "./App.css"
import React, { useEffect, useState } from "react"
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query"
import { SerializedError } from "@reduxjs/toolkit"

type DebounceOptions = {
  delay?: number
  debounce?: boolean
}

function useDebounce<T>(
  value: T,
  { delay = 1000, debounce = true }: DebounceOptions,
) {
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
  const [getPokemon, { data: pokemon }] = useLazyGetPokemonByNameQuery()

  const [
    getPokemonMatches,
    { data: pokemonMatches = [], isLoading, isError, error },
  ] = useLazyGetPokemonMatchesByNameQuery()

  const onPokemonNameChange = (value: string) => {
    getPokemonMatches(value, true)
  }

  const onPokemonSelect = (value: string) => {
    getPokemon(value)
  }

  const errMsg: React.ReactNode = error ? getErrorMsg(error) : null

  return (
    <div className="App flex flex-col items-center">
      <div className="w-56 mt-10">
        <TypeAhead
          className="border-2 border-slate-200 p-1"
          onValueChange={onPokemonNameChange}
          onSelect={onPokemonSelect}
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
  options: string[]
  onValueChange: (value: string) => void
  onSelect: (value: string) => void
  className: string
  placeholder: string
}

const TypeAhead = ({
  options,
  onValueChange,
  onSelect,
  className,
  placeholder,
}: TypeaheadProps) => {
  const [value, setValue] = useState<null | string>("")
  const [selectedValue, setSelectedValue] = useState("")
  const nonNullValue = value ?? ""
  const debouncedValue = useDebounce<string>(nonNullValue, {
    debounce: nonNullValue.length > 2,
  })

  useEffect(() => {
    onValueChange(debouncedValue)
  }, [debouncedValue])

  return (
    <div>
      <input
        className={className}
        placeholder={placeholder}
        value={value ?? selectedValue}
        onChange={(e) => {
          setValue(e.target.value)
        }}
      />
      {value === debouncedValue && (
        <ul role="listbox">
          {options.map((o) => (
            <li
              key={o}
              role="option"
              onClick={() => {
                onSelect(o)
                setSelectedValue(o)
                setValue(null)
              }}
            >
              {o}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
export default App
