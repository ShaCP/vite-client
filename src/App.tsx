import {
  useGetPokemonByNameQuery,
  useGetPokemonMatchesByNameQuery,
  useLazyGetPokemonMatchesByNameQuery,
} from "./features/entities/pokemonApi"
import "./App.css"
import { useEffect, useState } from "react"
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
  const [selectedPokemonName, setSelectedPokemonName] = useState("")

  const { data: pokemon } = useGetPokemonByNameQuery(selectedPokemonName, {
    skip: !selectedPokemonName,
  })

  const [
    trigger,
    {
      data: pokemonMatches = [],
      isLoading,
      isError,
      isSuccess,
      error,
      isFetching,
    },
  ] = useLazyGetPokemonMatchesByNameQuery()

  console.log(
    "isSuccess",
    isSuccess,
    "isLoading",
    isLoading,
    "data",
    "isFetching",
    isFetching,
    "data",
    pokemonMatches,
  )

  const onPokemonNameChange = (value: string) => {
    trigger(value, true)
  }

  const onPokemonSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPokemonName(e.target.value)
  }

  const errMsg: React.ReactNode = error ? getErrorMsg(error) : null

  return (
    <div className="App flex flex-col items-center">
      <div className="w-56 mt-10">
        <TypeAhead
          className="border-2 border-slate-200 p-1"
          selectedValue={selectedPokemonName}
          onValueChange={onPokemonNameChange}
          onSelectionChange={onPokemonSelectChange}
          placeholder="Enter pokemon name"
          options={isSuccess ? pokemonMatches : []}
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
  selectedValue: string
  options: string[]
  onValueChange: (e: string) => void
  onSelectionChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  className: string
  placeholder: string
}

const TypeAhead = ({
  selectedValue = "",
  options,
  onValueChange,
  onSelectionChange,
  className,
  placeholder,
}: TypeaheadProps) => {
  const [value, setValue] = useState("")
  const debouncedValue = useDebounce<string>(value, {})

  useEffect(() => {
    onValueChange(debouncedValue)
  }, [debouncedValue])

  return (
    <div>
      <input
        className={className}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          setValue(e.target.value)
        }}
      />
      {value === debouncedValue && (
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
                    setValue(o)
                  }}
                  checked={selectedValue === o}
                />
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
export default App
