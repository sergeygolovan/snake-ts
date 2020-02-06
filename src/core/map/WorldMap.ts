import { Game } from '../Game';
import { Cell } from './Cell';
import { Container } from 'pixi.js';
import * as PF from 'pathfinding';
import { Size, Position } from '../utils/SharedInterfaces';

export class WorldMap {

    private readonly container: Container = new Container();
    private readonly cells: Cell[][] = [];

    constructor(
        private readonly game: Game,
        private readonly size: Size
    ) {
        this.createCells();
    }

    // Инициализация клеток карты
    private createCells() {
        for (let x = 1; x <= this.size.width; x++) {
            this.cells[x - 1] = [];
            for (let y = 1; y <= this.size.height; y++) {
                this.createDefaultCellAt({x, y});
            }
        }
    }

    // Инициализация клетки по умолчанию
    private createDefaultCellAt(pos: Position) {

        let tile = this.game.getTileFactory().createTile("floor");

        this.cells[pos.x - 1][pos.y - 1] = new Cell(pos, tile, null);
    }

    // Отрисовка карты
    public render(parentContainer: Container) {

        this.container.removeChildren();

        this.cells.forEach((_, i) => {
            this.cells[i].forEach((_, j) => {
                this.addCellToContainer(this.cells[i][j])
            });
        });

        parentContainer.addChild(this.container);
    }

    // Поиск пути из стартовой точки в конечную (в случае отсутствия )
    public findPath(startPosition: Position, endPosition: Position): Cell[] {

        let startCell = this.getCell(startPosition),
            endCell = this.getCell(endPosition);

        if (startCell == endCell) {
            return null;
        }

        let matrix = [];

        for (let y = 0; y < this.size.height; y++) {
            matrix[y] = [];
            for (let x = 0; x < this.size.width; x++) {
                let cell = this.cells[x][y]
                matrix[y][x] = + !(!cell.isOccupied() || cell == startCell || cell == endCell);
            }
        }

        let grid = new PF.Grid(matrix);

        let finder = new PF.AStarFinder(),
            path = finder.findPath(startPosition.x - 1, startPosition.y - 1, endPosition.x - 1, endPosition.y - 1, grid);

        return path.length && path.map(
            (point: [number, number]) => this.getCell({ x: point[0] + 1, y: point[1] + 1 })
        );
    }


    // Получение доступа к выбранной клетке карты
    public getCell(position: Position): Cell {
        if (position.x > this.size.width || position.x < 1 || position.y > this.size.height || position.y < 1) {
            return null;
        }

        return this.cells[position.x - 1][position.y - 1];
    }

    public getHeight(): number {
        return this.size.height;
    }

    public getWidth(): number {
        return this.size.width;
    }

    private addCellToContainer(cell: Cell) {
        let tile = cell.getTile();

        if (tile) {
            let sprite = tile.getSprite();
            tile.setPosition(cell.getPosition())

            this.container.addChild(sprite);
        }
    }
}