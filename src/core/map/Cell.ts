import { Tile } from './Tile';
import { Position } from '../utils/SharedInterfaces';
import { BaseObject } from '../objects/BaseObject';

export class Cell {
    constructor(
        readonly position: Position,
        private tile: Tile,
        private content: BaseObject = null
    ) {}

    public getPosition(): Position {
        return this.position;
    }

    public getTile(): Tile {
        return this.tile;
    }

    public setTile(tile: Tile): Cell {
        this.tile = tile;
        return this;
    }

    public isOccupied(): boolean {
        return !!this.content;
    }

    public getContent(): BaseObject {
        return this.content;
    }

    public setContent(content: BaseObject): Cell {
        this.content = content;
        return this;
    }
}