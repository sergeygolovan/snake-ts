import { Tile } from '../map/Tile';
import * as tileMetadata from '../../config/tiles.json';
import { Size } from '../utils/SharedInterfaces';
import { Texture, Sprite, Graphics } from 'pixi.js';

type TileConstructor = (sprite: Sprite | Graphics) => Tile;

export class TileFactory {

    private textures: Map<string, Texture> = new Map<string, Texture>();
    private constructors: Map<string, TileConstructor> = new Map<string, TileConstructor>();

    constructor(
        private readonly tileSize: Size
    ) {
        this.loadResources();
    }

    private loadResources() {
        for (let [name, path] of Object.entries(tileMetadata)) {
            this.initTileConstructor(name)
            this.textures.set(name, Texture.from(path));
        }

        this.initTileConstructor(null);
    }

    private initTileConstructor(name?: string, tileSettings?: object) {
        this.constructors.set(name, (sprite: Sprite) => {
            return new Tile(sprite);
        });
    }

    public createTile(name?: string, fillColor?: number): Tile {

        let sprite = null;
        
        if (name) {
            sprite = new Sprite(this.textures.get(name));
            
            sprite.height = this.tileSize.height;
            sprite.width = this.tileSize.width;

        } else {
            sprite = new Graphics();
            sprite.beginFill(fillColor);
            sprite.drawRect(5, 5, this.tileSize.width, this.tileSize.height);
            sprite.endFill();
        }

        sprite.interactive = true;

        return this.constructors.get(name).call(this, sprite)
    }

    public getTileSize(): Size {
        return this.tileSize;
    }

    public getTextures() {
        return this.textures;
    }
}