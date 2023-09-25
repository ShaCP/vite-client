export interface Pokemon {
  abilities: Ability[]
  base_experience: number
  forms: Details[]
  game_indices: GameIndex[]
  height: number
  held_items: HeldItem[]
  id: number
  is_default: boolean
  location_area_encounters: string
  moves: Move[]
  name: string
  order: number
  past_types: any[]
  species: Details
  sprites: Sprites
  stats: Stat[]
  types: Type[]
  weight: number
}

export interface HeldItem {
  item: Details
  version_details: VersionDetail[]
}

export interface VersionDetail {
  rarity: number
  version: Details
}

export interface Ability {
  ability: Details
  is_hidden: boolean
  slot: number
}

export interface Details {
  name: string
  url: string
}

export interface GameIndex {
  game_index: number
  version: Details
}

export interface Move {
  move: Details
  version_group_details: VersionGroupDetail[]
}

export interface VersionGroupDetail {
  level_learned_at: number
  move_learn_method: Details
  version_group: Details
}

export interface GenerationV {
  "black-white": Sprites
}

export interface GenerationIV {
  "diamond-pearl": Sprites
  "heartgold-soulsilver": Sprites
  platinum: Sprites
}

export interface Versions {
  "generation-i": GenerationI
  "generation-ii": GenerationII
  "generation-iii": GenerationIII
  "generation-iv": GenerationIV
  "generation-v": GenerationV
  "generation-vi": { [key: string]: Home }
  "generation-vii": GenerationVII
  "generation-viii": GenerationVIII
}

export interface Sprites {
  back_default: string
  back_female: string
  back_shiny: string
  back_shiny_female: string
  front_default: string
  front_female: string
  front_shiny: string
  front_shiny_female: string
  other?: Other
  versions?: Versions
  animated?: Sprites
}

export interface GenerationI {
  "red-blue": RedBlue
  yellow: RedBlue
}

export interface RedBlue {
  back_default: string
  back_gray: string
  back_transparent: string
  front_default: string
  front_gray: string
  front_transparent: string
}

export interface GenerationII {
  crystal: Crystal
  gold: Gold
  silver: Gold
}

export interface Crystal {
  back_default: string
  back_shiny: string
  back_shiny_transparent: string
  back_transparent: string
  front_default: string
  front_shiny: string
  front_shiny_transparent: string
  front_transparent: string
}

export interface Gold {
  back_default: string
  back_shiny: string
  front_default: string
  front_shiny: string
  front_transparent?: string
}

export interface GenerationIII {
  emerald: OfficialArtwork
  "firered-leafgreen": Gold
  "ruby-sapphire": Gold
}

export interface OfficialArtwork {
  front_default: string
  front_shiny: string
}

export interface Home {
  front_default: string
  front_female: string
  front_shiny: string
  front_shiny_female: string
}

export interface GenerationVII {
  icons: DreamWorld
  "ultra-sun-ultra-moon": Home
}

export interface DreamWorld {
  front_default: string
  front_female: string
}

export interface GenerationVIII {
  icons: DreamWorld
}

export interface Other {
  dream_world: DreamWorld
  home: Home
  "official-artwork": OfficialArtwork
}

export interface Stat {
  base_stat: number
  effort: number
  stat: Details
}

export interface Type {
  slot: number
  type: Details
}
