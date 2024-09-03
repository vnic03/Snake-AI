export default class Grid {
    
    private gameContainer: HTMLElement; 

    constructor(id: string) {
        const container = document.getElementById(id);
        if (!container) throw new Error(`Element with id "${id}}" not found`);
        
        this.gameContainer = container;
    }

    public create(rows: number, cols: number): HTMLElement[][] {
        const cells: HTMLElement[][] = [];

        for (let row = 0; row < rows; row++) {
            const rowCells: HTMLElement[] = [];
            
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