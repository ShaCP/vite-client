import {
  useGetPokemonByNameQuery,
  useGetPokemonMatchesByNameQuery,
} from "./features/entities/pokemonApi"
import "./App.css"
import { useEffect, useState } from "react"
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query"
import { SerializedError } from "@reduxjs/toolkit"

function useDebounce<T>(value: T, delay: number = 1000) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

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

  const debouncedPokemonName = useDebounce<string>(pokemonName)

  const { data, isLoading, isError, error } = useGetPokemonMatchesByNameQuery(
    debouncedPokemonName.toLowerCase(),
    {
      skip: !debouncedPokemonName || debouncedPokemonName.length < 3,
    },
  )

  const onPokemonNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPokemonName(e.target.value)
  }

  const errMsg: React.ReactNode = error ? getErrorMsg(error) : null

  return (
    <div className="App flex flex-col items-center">
      <div className="w-56 mt-10">
        <input
          className="border-2 border-slate-200 p-1"
          value={pokemonName}
          onChange={onPokemonNameChange}
          placeholder="Enter pokemon name"
        />
        {isLoading ? (
          "...loading"
        ) : isError ? (
          <p>{errMsg}</p>
        ) : (
          <div>
            <ul>
              {data?.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
            {/* {data?.name}
            {data?.sprites.front_default && (
              <img
                className="w-full"
                alt={`${data?.name.toUpperCase()} sprite`}
                src={data.sprites.front_default}
              />
            )} */}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
