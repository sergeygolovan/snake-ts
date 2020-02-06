import { BaseObject } from "./BaseObject";
import { Game } from "../Game";
import { Position, isPositionsEqual } from '../utils/SharedInterfaces';
import { Cell } from "../map/Cell";
import { Container } from "pixi.js";

export class Wall extends BaseObject {
    
    readonly tile = this.tileFactory.createTile("wall");

    constructor(game: Game, options: any) {
        super(game, options);
        this.tile.setPosition(this.position);
    }

    public render(parentContainer: Container) {
        parentContainer.removeChild(this.container);
        this.container.removeChildren();
        this.container.addChild(this.tile.getSprite());
        parentContainer.addChild(this.container);
    }

    public spawn() {

    }

    public destroy() {
        this.container.removeChildren();
        this.game.removeStaticObject(this);
    }
}