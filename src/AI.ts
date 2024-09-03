import { GameBase, Position } from "./GameBase";


class AI extends GameBase {

    private readonly HC: Position[] = this.HamiltonianCycle();

    constructor(rows: number, cols: number) {
        super(rows, cols);
    }

    move(): void {
        const head: Position = this.snake[0];

        if (this.isSafeMove(this.applePos)) {
            
            let move = this.getShortcutMove(head);
            
            if (move) {
                this.executeMove(move);
            
            } else {
                let fallbackMove = this.getFallbackMove(head);
                
                if (fallbackMove) {
                    this.executeMove(fallbackMove);
                } else {
                    clearInterval(this.gameInterval);
                }
            }
        
        } else {
            let fallbackMove = this.getFallbackMove(head);
            
            if (fallbackMove) {
                this.executeMove(fallbackMove);
            
            } else {
                clearInterval(this.gameInterval);
            }
        }

        this.updateScore();
    }

    private executeMove(head: Position): void {
        this.snake.unshift(head);
        this.snakeSet.add(`${head.row}-${head.col}`);

        if (this.posEquals(head, this.applePos)) {
            this.growing = true;
            this.applePos = this.generateApplePos();
            this.drawApple();
        
        } else {
            this.growing = false;
        }

        if (!this.growing) {
            let tail = this.snake.pop();
            if (tail) {
                this.snakeSet.delete(`${tail.row}-${tail.col}`);
                this.grid[tail.row][tail.col].style.backgroundColor = '';
            }
        }

        this.updateScore();
        this.drawSnake();
    }

    private getShortcutMove(head: Position): Position | null {
        // all possible moves
        const moves: Position[] = this.getAdjacentMoves(head);
        
        let bestMove = null;
        let minDistance = Infinity;
    
        for (let move of moves) {
            if (this.isSafeMove(move) && this.isLegalMove(head, move)) {
                let distance = Math.abs(move.row - this.applePos.row) + Math.abs(move.col - this.applePos.col);
                
                if (this.isSpaceAvailableAfterMove(move)) {
                    if (distance < minDistance) {
                        minDistance = distance;
                        bestMove = move;
                    }
                }
            }
        }
    
        if (!bestMove) {
            for (let move of moves) {
                if (this.isSafeMove(move) && this.isLegalMove(head, move)) 
                {
                    bestMove = move;
                    break;
                }
            }
        }
        
        if (bestMove) return bestMove;
        
        let index = this.HC.findIndex(pos => this.posEquals(pos, head)); 

        let nextIndex = (index + 1) % this.HC.length;
        
        let fallbackMove = this.HC[nextIndex];
        
        return this.isSafeMove(fallbackMove) && this.isLegalMove(head, fallbackMove) 
                ? fallbackMove : null;
    }
    
    private getFallbackMove(head: Position): Position | null {
        let index = this.HC.findIndex(pos => this.posEquals(pos, head));
        let nextIndex = (index + 1) % this.HC.length;
        let fallbackMove = this.HC[nextIndex];

        if (this.isSafeMove(fallbackMove)) {
            return fallbackMove;
        }

        let possibleMoves = this.getAdjacentMoves(head).filter(move => 
            this.isSafeMove(move) && this.isLegalMove(head, move)
        );

        for (let move of possibleMoves) {
            if (this.isSpaceAvailableAfterMove(move)) {
                return move;
            }
        }

        return this.isSafeMove(fallbackMove) && this.isLegalMove(head, fallbackMove)
                ? fallbackMove : null;
    }

    private isLegalMove(current: Position, next: Position): boolean {
        const rowDiff = Math.abs(current.row - next.row);
        const colDiff = Math.abs(current.col - next.col);
        return (rowDiff + colDiff === 1);
    }

    // BFS to check if there's enough space for the snake to fully move after the given position.
    private isSpaceAvailableAfterMove(move: Position): boolean {
        const visited: boolean[][] = Array.from(
            { length: this.rows }, () => Array(this.cols).fill(false)
        );
        
        const queue = [move];
        
        let counter = 0;
    
        while (queue.length > 0) {
            const current = queue.shift()!;
            const possibleMoves = this.getAdjacentMoves(current);
    
            for (const next of possibleMoves) {
                if (
                    next.row >= 0 && next.row < this.rows &&
                    next.col >= 0 && next.col < this.cols &&
                    !visited[next.row][next.col] && !this.snakeSet.has(`${next.row}-${next.col}`)
                ) {
                    queue.push(next);
                    visited[next.row][next.col] = true;
                    counter++;
                }
            }
        }
    
        return counter >= this.snake.length;  
    }
    

    private HamiltonianCycle(): Position[] {
        let cycle: Position[] = [];

        for (let row = 0; row < this.rows; row += 2) {
            for (let col = 0; col < this.cols; col += 2) {
                cycle.push({ row: row, col: col });

                if (col + 1 < this.cols) cycle.push({ row: row, col: col + 1 });

                if (row + 1 < this.rows) {
                    cycle.push({ row: row + 1, col: col + 1 });
                    cycle.push({ row: row + 1, col: col });
                }
            }
        }
    
        for (let i = this.rows - 2; i >= 0; i -= 2) {
            for (let j = this.cols - 2; j >= 0; j -= 2) {
                if (i > 0 && j > 0) cycle.push({ row: i, col: j });
            }
        }
    
        return cycle;
    }

    private isSafeMove(pos: Position): boolean {
        if (pos.row < 0 || pos.row >= this.rows || pos.col < 0 || pos.col >= this.cols || 
            this.snakeSet.has(`${pos.row}-${pos.col}`)) 
        {
            return false;
        }
    
        if (this.isCorner(pos)) {
            return this.isCornerSafe(pos);
        }
    
        let simulatedSnake = [...this.snake];
        simulatedSnake.unshift(pos);
        
        // simulated snake set
        let set = new Set(this.snakeSet);
        set.add(`${pos.row}-${pos.col}`);
    
        if (!this.growing) {
            let tail = simulatedSnake.pop();
            if (tail) set.delete(`${tail.row}-${tail.col}`);
        }
    
        let possibleMoves = this.getAdjacentMoves(pos);

        // holds the amount of safe moves
        let counter = possibleMoves.filter(move =>
            move.row >= 0 && move.row < this.rows &&
            move.col >= 0 && move.col < this.cols &&
            !set.has(`${move.row}-${move.col}`)
        ).length;
    
        return counter >= 1;
    }
    
    private isCorner(pos: Position): boolean {
        return (pos.row === 0 && pos.col === 0) ||
               (pos.row === 0 && pos.col === this.cols - 1) ||
               (pos.row === this.rows - 1 && pos.col === 0) ||
               (pos.row === this.rows - 1 && pos.col === this.cols - 1);
    }

    private isCornerSafe(pos: Position): boolean {
        return this.getAdjacentMoves(pos).some(move => this.isSafeMove(move));
    }

    private getAdjacentMoves(pos: Position): Position[] {
        return [
            { row: pos.row - 1, col: pos.col },
            { row: pos.row + 1, col: pos.col },
            { row: pos.row, col: pos.col - 1 },
            { row: pos.row, col: pos.col + 1 }
        ];
    }

    run(): void {
        this.drawApple();
        this.gameInterval = setInterval(() => this.move(), this.speed);
    }
}

new AI(20, 20).run();
