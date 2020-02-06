import { Snake } from "./Snake";
import { Game } from "../Game";
import { WorldMap } from "../map/WorldMap";
import { Cell } from "../map/Cell";
import { Food } from "./Food";
import { getDistance, Direction, Position, isPositionsEqual } from "../utils/SharedInterfaces";
import { BaseObject } from "./BaseObject";

export class HungryBotSnake extends Snake {

    private targetPosition: Position;
    private pathIterator: Iterable<Cell>;

    constructor(game: Game, options: any) {
        super(game, options);
    }

    private updateDirection() {
        if (!this.targetPosition || isPositionsEqual(this.position, this.targetPosition)) {

        } else {
            this.targetPosition = this.findTargetPath()[0].getPosition();
        }
    }

    private findTargetPath(): Cell[] {
        let paths = this.game.getDynamicObjects()
        .filter(obj => obj instanceof Food)
        .map((obj: BaseObject) => ({
            target: obj, 
            path: this.map.findPath(this.position, obj.getPosition())
        }))
        .sort((a: any, b: any): number => {
            let l1 = a.path ? a.path.length : 0,
                l2 = b.path ? b.path.length : 0;

            return l2 - l1;
        })
        .filter((a: any) => a.path.length);

        let selectedPath = paths[0];

    
        return paths[0].path;
    }

    private setNextPathDirection() {

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