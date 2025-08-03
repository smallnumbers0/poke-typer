class PokeTyping {
    constructor() {
        this.pokemonNames = [];
        this.text = "";

    }
    async fetchPokemonNames() {
        try {
            const response = await fetch('https://pokeapi.co/api/v2/pokemon');
            const data = await response.json();
            let pokemonArr = data.results.map(pokemon => pokemon.name);
            this.pokemonNames = this.getRandomPokemonNames(pokemonArr, 100);
            this.text = this.pokemonNames.join(' ');
            this.displayText();
            console.log(this.pokemonNames);
            
        } catch (error) {
            console.error(error);
        }
    }

    getRandomPokemonNames(pokemonArr, count) {
        let randomNum = 0;
        let randomPokemonNames = [];
        for (let i = 0; i < count; i++) {
            randomNum = Math.floor(Math.random() * pokemonArr.length);
            randomPokemonNames.push(pokemonArr[randomNum]);
        }
        return randomPokemonNames;
    }

    displayText() {
        const textElement = document.getElementById('text-to-type');
        textElement.textContent = this.text;
    }

}

const newGame = new PokeTyping();
newGame.fetchPokemonNames()
