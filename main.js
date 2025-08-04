class PokeTyping {
    constructor() {
        this.pokemonNames = [];
        this.text = "";

        this.gameRunning = false;
        this.startTime = null;
        this.endTime = null;
        this.timer = null;
        this.ppmUpdateTimer = null;
        this.gameTimer = null;
        this.timeLimit = 30; 
        this.timeRemaining = this.timeLimit;
        this.currentIndex = 0;
        this.errors = 0;
        this.hasStartedTyping = false;

        this.userInput = document.getElementById('user-input');
        this.ppmDisplay = document.querySelector('.wpm-value');
        this.timeDisplay = document.querySelector('.time-value');
        this.highScoreDisplay = document.getElementById('high-score');
        this.errorDisplay = document.getElementById('error-count');
        
        this.userInput.addEventListener('input', (event) => this.handleInput(event));
        
        this.loadHighScore();
        console.log('High score element:', this.highScoreDisplay);
        console.log('Error display element:', this.errorDisplay);
    }
    async fetchPokemonNames() {
        try {
            const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=500');
            const data = await response.json();
            let pokemonArr = data.results.map(pokemon => pokemon.name);
            this.pokemonNames = this.getRandomPokemonNames(pokemonArr, 20);
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
        const textDisplay = document.getElementById('text-to-type');
        textDisplay.innerHTML = this.text.split('')
            .map((char, index) => `<span class="char-${index}" data-index="${index}">${char}</span>`)
            .join('');
    }

    handleInput(event) {
        if(!this.gameRunning) return;
        
        const inputText = this.userInput.textContent;
        
        if (!this.hasStartedTyping && inputText.length > 0) {
            this.startTimer();
            this.hasStartedTyping = true;
        }
        
        for (let i = this.currentIndex; i < inputText.length; i++) {
            const currentChar = this.text[i];
            const userInputChar = inputText[i];
            
            if (userInputChar === currentChar) {
                this.currentIndex++;
                if (this.currentIndex >= this.text.length) {
                    this.endGame();
                    return;
                }
            } else {
                this.errors++;
                break; 
            }
        }
        
        this.updateInputDisplay(inputText);
    }

    loadHighScore() {
        const highScore = localStorage.getItem('pokeTyperHighScore');
        
        if (highScore) {
            this.highScoreDisplay.textContent = highScore;
        } else {
            this.highScoreDisplay.textContent = "0";
        }
    }

    saveHighScore(score) {
        const currentHighScore = parseInt(localStorage.getItem('pokeTyperHighScore')) || 0;
        
        if (score > currentHighScore) {
            localStorage.setItem('pokeTyperHighScore', score.toString());
            this.highScoreDisplay.textContent = score;
            return true;
        }
        return false;
    }

    updateInputDisplay(inputText) {
        let inputChar = '';
        for (let i = 0; i < inputText.length; i++) {
            const char = inputText[i];
            const targetChar = this.text[i];
            
            if (char === targetChar) {
                inputChar += `<span class="correct">${char}</span>`;
            } else {
                inputChar += `<span class="incorrect">${char}</span>`;
            }
        }

        this.userInput.innerHTML = inputChar;

        const range = document.createRange();
        range.selectNodeContents(this.userInput);
        range.collapse(false);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }

    startGame() {
        this.gameRunning = true;
        this.updatePPMDisplay();
        this.updateTimeDisplay();
    }

    startTimer() {
        this.startTime = Date.now();
        this.ppmUpdateTimer = setInterval(() => {
            if (this.gameRunning) {
                this.updatePPMDisplay();
                this.updateTimeDisplay();
            }
        }, 1000);
    }

    getPokemonPerMin() {
        if (!this.startTime) return 0;
        
        const currentTime = this.gameRunning ? Date.now() : this.endTime;
        const elapsedTimeInMinutes = (currentTime - this.startTime) / (1000 * 60);
        
        //weird pokemon per minute calculation for now.
        const pokemonTyped = this.currentIndex / 7;
        const ppm = Math.round(pokemonTyped / elapsedTimeInMinutes);
        
        return isNaN(ppm) || !isFinite(ppm) ? 0 : ppm;
    }

    updatePPMDisplay() {
        const currentPPM = this.getPokemonPerMin();
        this.ppmDisplay.textContent = currentPPM;
    }

    updateTimeDisplay() {
        if (!this.hasStartedTyping) {
            this.timeDisplay.textContent = this.timeLimit.toString();
            return;
        }
        
        if (!this.startTime) return;
        
        const currentTime = this.gameRunning ? Date.now() : this.endTime;
        const elapsedTimeInSeconds = Math.floor((currentTime - this.startTime) / 1000);
        this.timeRemaining = Math.max(0, this.timeLimit - elapsedTimeInSeconds);
        
        this.timeDisplay.textContent = this.timeRemaining.toString();
        
 
        if (this.timeRemaining <= 0 && this.gameRunning) {
            this.endGame();
        }
    }

    endGame() {
        this.gameRunning = false;
        this.endTime = Date.now();
        
        this.userInput.contentEditable = false;
        this.userInput.style.pointerEvents = 'none';
        this.userInput.style.opacity = '0.6';

        if (this.ppmUpdateTimer) {
            clearInterval(this.ppmUpdateTimer);
        }

        this.updatePPMDisplay();
        this.updateTimeDisplay();
   
        
        const finalPPM = this.getPokemonPerMin();
        const timeUsed = this.timeLimit - this.timeRemaining;
        const isNewHighScore = this.saveHighScore(finalPPM);

    }
}

const newGame = new PokeTyping();
newGame.fetchPokemonNames();
newGame.startGame();
