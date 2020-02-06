import { Sprite, Graphics } from "pixi.js";
import { Position } from '../utils/SharedInterfaces';

export class Tile {
    constructor(
        readonly sprite: Sprite | Graphics
    ) {}

    public setPosition(pos: Position): Tile {
        this.sprite.position.set( (pos.x - 1) * this.sprite.width, (pos.y - 1) * this.sprite.height);

        return this;
    }

    public getSprite(): Sprite | Graphics {
        return this.sprite;
    }
}