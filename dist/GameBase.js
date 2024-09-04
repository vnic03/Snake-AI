import Grid from "./Grid.js";
export class GameBase {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.grid = new Grid('game-container').create(rows, cols);
        this.snake = [{ row: Math.floor(Math.random() * 20), col: Math.floor(Math.random() * 15) }];
        this.snakeSet = new Set([`${this.snake[0].row}-${this.snake[0].col}`]);
        this.growing = false;
        this.applePos = this.generateApplePos();
        this.dir = { x: 1, y: 0 };
        this.pause = false;
        this.pauseListener();
        this.score = this.snake.length;
        this.speed = 100;
        this.speedListener();
    }
    generateApplePos() {
        // holds free positions the apple can spawn 
        const pos = [];
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (!this.snakeSet.has(`${row}-${col}`)) {
                    pos.push({ row: row, col: col });
                }
            }
        }
        return pos[Math.floor(Math.random() * pos.length)];
    }
    drawSnake() {
        this.grid.forEach(row => {
            row.forEach(cell => {
                cell.style.backgroundColor = '';
                cell.innerHTML = '';
                cell.style.position = '';
            });
        });
        const eyeStyle = (eye, position) => {
            eye.style.width = '4px';
            eye.style.height = '4px';
            eye.style.backgroundColor = 'red';
            eye.style.borderRadius = '50%';
            eye.style.position = 'absolute';
            eye.style.top = '5px';
            if (position === 'left')
                eye.style.left = '5px';
            else
                eye.style.right = '5px';
        };
        this.snake.forEach((part, index) => {
            const cell = this.grid[part.row][part.col];
            if (index === 0) {
                cell.style.backgroundColor = 'green';
                cell.style.position = 'relative';
                const eye1 = document.createElement('div');
                eyeStyle(eye1, 'left');
                const eye2 = document.createElement('div');
                eyeStyle(eye2, 'right');
                cell.appendChild(eye1);
                cell.appendChild(eye2);
            }
            else {
                cell.style.backgroundColor = 'green';
            }
        });
        this.drawApple();
    }
    drawApple() {
        const cell = this.grid[this.applePos.row][this.applePos.col];
        cell.innerHTML = '';
        cell.style.position = 'relative';
        const apple = document.createElement('div');
        apple.style.width = '20px';
        apple.style.height = '20px';
        apple.style.backgroundColor = 'red';
        apple.style.borderRadius = '50%';
        apple.style.position = 'absolute';
        apple.style.top = '50%';
        apple.style.left = '50%';
        apple.style.transform = 'translate(-50%, -50%)';
        const styleLeaf = (leaf, left, rotate) => {
            leaf.style.width = '8px';
            leaf.style.height = '4px';
            leaf.style.backgroundColor = 'green';
            leaf.style.borderRadius = '50%';
            leaf.style.position = 'absolute';
            leaf.style.top = '-4px';
            leaf.style.left = left;
            leaf.style.transform = rotate;
        };
        const leaf1 = document.createElement('div');
        styleLeaf(leaf1, '6px', 'rotate(-30deg)');
        const leaf2 = document.createElement('div');
        styleLeaf(leaf2, '12px', 'rotate(30deg)');
        apple.appendChild(leaf1);
        apple.appendChild(leaf2);
        cell.appendChild(apple);
    }
    pauseListener() {
        document.addEventListener('keydown', (event) => {
            if (event.key === 'p') {
                this.pause = !this.pause;
                if (this.pause) {
                    clearInterval(this.gameInterval);
                }
                else {
                    this.gameInterval = setInterval(() => this.move(), this.speed);
                }
            }
        });
    }
    speedListener() {
        document.addEventListener('speedChange', (event) => {
            const custom = event;
            if (custom.detail.change === 'faster') {
                this.speed = Math.max(10, this.speed - 10);
            }
            else if (custom.detail.change === 'slower') {
                this.speed += 10;
            }
            if (!this.pause) {
                clearInterval(this.gameInterval);
                this.gameInterval = setInterval(() => this.move(), this.speed);
            }
        });
    }
    updateScore() {
        this.score = this.snake.length;
        const scr = document.getElementById('score');
        if (scr)
            scr.textContent = this.score.toString();
    }
    posEquals(one, two) {
        return one.row === two.row && one.col === two.col;
    }
    gameover(pos) {
        return (pos.row < 0 ||
            pos.row >= this.rows ||
            pos.col < 0 ||
            pos.col >= this.cols ||
            this.snakeSet.has(`${pos.row}-${pos.col}`));
    }
}
