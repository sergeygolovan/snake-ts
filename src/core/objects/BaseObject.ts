import { Game } from "../Game";
import { Container } from "pixi.js";
import { TileFactory } from "../factory/TileFactory";
import { ObjectFactory } from "../factory/ObjectFactory";
import { WorldMap } from "../map/WorldMap";
import { Position } from "../utils/SharedInterfaces";

export abstract class BaseObject {
    protected readonly container: Container = new Container();
    protected readonly map: WorldMap;
    protected readonly tileFactory: TileFactory;
    protected readonly objectFactory: ObjectFactory;

    protected position: Position;

    constructor(
        protected readonly game: Game,
        options: any = {}
    ) {
        this.map = this.game.getMap();
        this.tileFactory = this.game.getTileFactory();
        this.objectFactory = this.game.getObjectFactory();

        
        this.setPosition(options.position || this.findBestEmptyCell().getPosition());
    }

    public getPosition(): Position {
        return this.position;
    }

    public setPosition(position: Position, occupied: boolean = true) {
        this.position = position;
        this.map.getCell(position).setContent(this);
    }

    public getContainer(): Container {
        return this.container;
    }

    protected findBestEmptyCell() {
        let x: number, y: number;

        do {
            x = Math.floor(Math.random() * this.map.getWidth()) + 1;
            y = Math.floor(Math.random() * this.map.getHeight()) + 1;

            console.log(x, y);
        } while (this.map.getCell({x, y}).isOccupied())

        return this.map.getCell({x, y})
    }

    abstract spawn(): ThisParameterType<BaseObject>;

    abstract render(parentContainer: Container): ThisParameterType<BaseObject>;

    abstract destroy(): ThisParameterType<BaseObject>;
}