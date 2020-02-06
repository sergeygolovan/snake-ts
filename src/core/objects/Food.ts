import { BaseObject } from "./BaseObject";
import { Game } from "../Game";
import { Position, isPositionsEqual } from '../utils/SharedInterfaces';
import { Cell } from "../map/Cell";
import { Container } from "pixi.js";

export class Food extends BaseObject {
    
    readonly tile = this.tileFactory.createTile(null, 0xDDDDDD);

    constructor(game: Game, options: any) {
        super(game, options);
    }

    public spawn() {
        this.reset()
    }

    public reset() {
        let targetCell = this.findCellToSpawn();

        this.setPosition(targetCell.getPosition(), false);
        this.tile.setPosition(targetCell.getPosition());
    }

    protected findCellToSpawn(): Cell {
        let targetCell = null;

        do {
            targetCell = super.findBestEmptyCell()
        } while (
            this.game.getDynamicObjects()
            .filter( obj => obj instanceof Food)
            .some(obj => isPositionsEqual(obj.getPosition(), targetCell.getPosition()))
        )

        return targetCell;
    }

    public destroy() {
        this.container.removeChildren();

        this.game.removeDynamicObject(this);
    }

    public render(parentContainer: Container) {
        parentContainer.removeChild(this.container);
        this.container.removeChildren();
        this.container.addChild(this.tile.getSprite());
        parentContainer.addChild(this.container);
    }
}