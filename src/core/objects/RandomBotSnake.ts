import { Snake } from "./Snake";
import { Game } from "../Game";
import { WorldMap } from "../map/WorldMap";
import { Cell } from "../map/Cell";

export class RandomBotSnake extends Snake {
    constructor(game: Game, options: any) {
        super(game, options);
    }

    private updateDirection() {

        let dx: number, dy: number, cell: Cell;

        do {
            dx = Math.floor(Math.random() * 3) - 1;
            dy = Math.floor(Math.random() * 3) - 1;
            cell = this.map.getCell({
                x: this.position.x + dx,
                y: this.position.y + dy
            });
        } while (
            Math.abs(dx + dy) !== 1 || 
            dx * this.direction.dx == -1 || 
            dy * this.direction.dy == -1 ||
            !cell || cell.isOccupied()
            );

        this.setDirection({dx,dy})
    }

    public spawn() {
        super.spawn();

        this.move();
    }

    protected moveToNextCell() {
        this.updateDirection();
        super.moveToNextCell();
    }
}