import { GameBase } from "./GameBase.js";
class Snake extends GameBase {
    constructor(rows, cols) {
        super(rows, cols);
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        this.nextDir = { x: 1, y: 0 };
    }
    move() {
        let tail;
        this.dir = { ...this.nextDir };
        const newHead = {
            row: this.snake[0].row + this.dir.y,
            col: this.snake[0].col + this.dir.x
        };
        if (this.gameover(newHead)) {
            alert("Game Over!");
            clearInterval(this.gameInterval);
            return;
        }
        this.snake.unshift(newHead);
        this.snakeSet.add(`${newHead.row}-${newHead.col}`);
        if (this.posEquals(newHead, this.applePos)) {
            this.growing = true;
            this.applePos = this.generateApplePos();
            this.drawApple();
        }
        else {
            this.growing = false;
        }
        if (!this.growing) {
            tail = this.snake.pop();
            if (tail) {
                this.snakeSet.delete(`${tail.row}-${tail.col}`);
                this.grid[tail.row][tail.col].style.backgroundColor = '';
            }
        }
        this.updateScore();
        this.drawSnake();
    }
    run() {
        this.drawApple();
        this.gameInterval = setInterval(() => this.move(), this.speed);
    }
    handleKeyDown(event) {
        switch (event.key) {
            case 'w':
            case 'ArrowUp':
                if (this.dir.y === 0)
                    this.nextDir = { x: 0, y: -1 };
                break;
            case 'd':
            case 'ArrowRight':
                if (this.dir.x === 0)
                    this.nextDir = { x: 1, y: 0 };
                break;
            case 's':
            case 'ArrowDown':
                if (this.dir.y === 0)
                    this.nextDir = { x: 0, y: 1 };
                break;
            case 'a':
            case 'ArrowLeft':
                if (this.dir.x === 0)
                    this.nextDir = { x: -1, y: 0 };
                break;
        }
    }
}
new Snake(20, 20).run();
