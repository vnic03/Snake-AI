export default class Grid {
    constructor(id) {
        const container = document.getElementById(id);
        if (!container)
            throw new Error(`Element with id "${id}}" not found`);
        this.gameContainer = container;
    }
    create(rows, cols) {
        const cells = [];
        for (let row = 0; row < rows; row++) {
            const rowCells = [];
            for (let col = 0; col < cols; col++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                this.gameContainer.appendChild(cell);
                rowCells.push(cell);
            }
            cells.push(rowCells);
        }
        return cells;
    }
}
