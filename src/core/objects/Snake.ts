import { BaseObject } from './BaseObject';
import { KeyboardController } from '../utils/KeyboardController';
import { Game } from '../Game';
import { Direction, Position, isPositionsEqual } from '../utils/SharedInterfaces';
import { Cell } from '../map/Cell';
import { Tile } from '../map/Tile';
import { Container } from 'pixi.js';
import { Food } from './Food';

export class Snake extends BaseObject {

    protected direction: Direction = { dx: 0, dy: 0}
    protected color: number = 0xFF0000;
    protected speed: number = 1;
    protected acceleration: number = 0;
    protected length: number = 1;
    protected cells: Cell[] = [];
    protected tiles: Tile[] = [];

    protected tickerID: number = null;

    constructor(game: Game, options: any) {
        super(game, options);

        if (options.color) {
            this.color = parseInt(options.color);
        }

        if (options.speed) {
            this.speed = options.speed;
        }

        if (options.direction) {
            this.setDirection(options.direction);
        }

        this.length = options.length || 1;

        this.initBodyCells();
    }

    protected initBodyCells() {
        this.cells = [];
        this.tiles = [];

        for (let i = 0; i < this.length; i++) {

            let x = this.position.x - this.direction.dx * i,
                y = this.position.y - this.direction.dy * i;

            let cell = this.map.getCell({x, y});

            if (cell && (isPositionsEqual(this.position, {x, y}) || !cell.isOccupied())) {
                cell.setContent(this);
                this.cells.push(cell);

                this.tiles.push(this.createTile(i));
            } else {
                this.length = i;
                break;
            }
        }
    }

    protected createTile(index: number): Tile {
        let color = this.color;

        color = Math.max(color & 0xFF0000 - 0x110000 * (index % 3), 0) + 
                Math.max(color & 0x00FF00 - 0x001100 * (index % 3), 0) + 
                Math.max(color & 0x0000FF - 0x000011 * (index % 3), 0);
    
        let tile = this.tileFactory.createTile(null, color), 
            sprite = tile.getSprite();

        sprite.zIndex = 9999;

        return tile;
    }

    public reset() {

        clearInterval(this.tickerID);
        this.tickerID = null;

        this.cells.forEach((cell: Cell) => cell.setContent(null));

        this.length = 1;
        this.acceleration = 0;

        this.cells = [];
        this.tiles = [];
    }

    public spawn() {
        this.render(this.game.getView().stage)
    }

    public move() {
        if (this.tickerID) {
            clearInterval(this.tickerID);
            this.tickerID = null;
        }

        this.tickerID = setInterval(this.moveToNextCell.bind(this),  150 / Math.min(this.speed + this.acceleration, 4));
    }

    public moveTo(targetCell: Cell) {
        let map = this.map,
            currentCell = map.getCell(this.position);

        if (targetCell !== currentCell) {

            if (this.tickerID) {
                clearInterval(this.tickerID);
                this.tickerID = null;
            }
        }
    }

    protected moveToNextCell() {
        let nextCell = this.map.getCell({
                x: this.position.x + this.direction.dx, 
                y: this.position.y + this.direction.dy
            });


        if (nextCell && (!nextCell.isOccupied() || (nextCell.getContent() instanceof Food))) {
            let lastCell = this.cells[this.length - 1];

            lastCell.setContent(null);

            this.cells = [nextCell, ...this.cells.slice(0, -1)];

            let tile = this.tiles[this.length - 1];
            this.tiles = [tile, ...this.tiles.slice(0, -1)];

            this.setPosition(nextCell.getPosition());
            tile.setPosition(nextCell.getPosition());

            this.checkInteractionWithObjects(lastCell);
        } else {
            this.destroy();
        }
    }

    public destroy() {
        this.reset();
        this.container.removeChildren();

        this.game.removeDynamicObject(this);
    }

    protected checkInteractionWithObjects(lastCell: Cell) {
        let selectedObject = this.game.getDynamicObjects().find(
            (obj: BaseObject) => obj !== this && isPositionsEqual(obj.getPosition(), this.position)
        );

        if (selectedObject instanceof Food) {
            (<Food>selectedObject).spawn();
            this.grow(lastCell);
        }
    }

    protected grow(targetCell: Cell) {

        let tile = this.createTile(this.length);

        targetCell.setContent(this);
        this.cells.push(targetCell);  
        this.tiles.push(tile);

        tile.setPosition(targetCell.getPosition());
        this.container.addChild(tile.getSprite());
        
        this.length += 1;
        this.acceleration += 0.1;
    }

    public setDirection(direction: Direction) {
        this.direction = direction;
    }

    public render(parentContainer: Container) {
        parentContainer.removeChild(this.container);
        this.container.removeChildren();

        this.tiles.forEach((tile, i) => {
            tile.setPosition(this.cells[i].getPosition());
            this.container.addChild(tile.getSprite());
        })

        parentContainer.addChild(this.container);
    }


}