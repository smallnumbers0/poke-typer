class PokeTyping {
    constructor() {
        this.pokemonNames = [];

    }
    async fetchPokemonNames() {
        try {
            const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000');
            const data = await response.json();
            this.pokemonNames = data.results.map(pokemon => pokemon.name);
            console.log(this.pokemonNames);
        } catch (error) {
            console.error('Error fetching Pokémon names:', error);
        }
    }

}

const newGame = new PokeTyping();
newGame.fetchPokemonNames();
