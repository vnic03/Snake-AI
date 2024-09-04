document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;

    const title = createTitle();

    const scoreContainer = createScore();

    const controlButtons = document.createElement('div');
    controlButtons.id = 'control-buttons';

    const speedControls = document.createElement('div');
    speedControls.id = 'speed-controls';
    speedControls.style.display = 'none'; 


    const gameButton = createButton('game', 'Game', true);
    const aiButton = createButton('ai', 'AI', true);

    const fasterButton = createButton('faster', 'faster', false);
    const slowerButton = createButton('slower', 'slower', false);


    body.appendChild(speedControls);
    body.appendChild(controlButtons);


    const gameContainer = createGameContainer();

    const footer = createFooter();

    gameButton.addEventListener('click', () => startGame('Snake-AI/dist/Snake.js'));
    aiButton.addEventListener('click', () => startGame('Snake-AI/dist/AI.js'));

    fasterButton.addEventListener('click', () => {
        const event = new CustomEvent('speedChange', { detail: { change: 'faster' } });
        document.dispatchEvent(event);
    });

    slowerButton.addEventListener('click', () => {
        const event = new CustomEvent('speedChange', { detail: { change: 'slower' } });
        document.dispatchEvent(event);
    });

    function startGame(scriptSrc: string) {
        controlButtons.style.display = 'none';
        speedControls.style.display = 'block';
        gameContainer.style.display = 'grid';
        scoreContainer.style.display = 'block';
        footer.style.display = 'none';
        title.style.display = 'none';

        const script = document.createElement('script');
        script.type = 'module';
        script.src = scriptSrc;
        body.appendChild(script);
    }

    function createButton(id: string, txt: string, type: boolean) : HTMLButtonElement {
        const button = document.createElement('button');
        button.id = id;
        button.textContent = txt;
        if (type) controlButtons.appendChild(button);
        else speedControls.appendChild(button);
        return button;
    }

    function createTitle() {
        const title = document.createElement('div');
        title.id = 'game-title';
        title.textContent = 'SNAKE ¿ AI ?';
        body.appendChild(title);
        return title;
    }

    function createScore() {
        const scoreContainer = document.createElement('div');
        scoreContainer.id = 'score-container';
        scoreContainer.innerHTML = 'Score: <span id="score">0</span>';
        scoreContainer.style.display = 'none';
        body.appendChild(scoreContainer);
        return scoreContainer;
    }

    function createGameContainer() {
        const gameContainer = document.createElement('div');
        gameContainer.id = 'game-container';
        body.appendChild(gameContainer);
        return gameContainer;
    }


    function createFooter() {
        const footer = document.createElement('div');
        footer.id = 'footer';
        footer.innerHTML = '&copy; 2024 Nico - Licensed under the MIT License';
        body.appendChild(footer);
        return footer;
    }
});
