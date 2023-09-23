import { useGetPokemonByNameQuery } from "./features/entities/pokemonApi"
import "./App.css"

function App() {
  const { data, isLoading } = useGetPokemonByNameQuery("bulbasaur")

  return (
    <div className="App">
      <div className="flex flex-col items-center">
        {isLoading || data == null ? (
          "...loading"
        ) : (
          <div className="w-56">
            {data.name}
            {data.sprites.front_default && (
              <img className="w-full" src={data.sprites.front_default} />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
