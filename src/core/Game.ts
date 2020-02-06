import { TileFactory } from './factory/TileFactory';
import { ObjectFactory } from './factory/ObjectFactory';
import { WorldMap } from './map/WorldMap';
import { Cell } from './map/Cell';
import { Application } from 'pixi.js';
import { BaseObject } from './objects/BaseObject';
import { Tile } from './map/Tile';
import { Size } from './utils/SharedInterfaces';

type Listener = (Cell) => void;

export class Game {

    private readonly tileFactory: TileFactory;
    private readonly objectFactory: ObjectFactory = new ObjectFactory(this);

    private map: WorldMap;
    private view: Application;
    private dynamicObjects: BaseObject[] = [];
    private staticObjects: BaseObject[] = [];
    private readonly listeners: Map<string, Listener[]> = new Map<string, Listener[]>();
    private readonly tileSize: Size = { width: 20, height: 20 };

    constructor(settings: any) {

        if (settings.map.tileSize) {
            this.tileSize = settings.map.tileSize;
        }

        this.tileFactory = new TileFactory(this.tileSize);

        this.initView(settings.map);
        this.initMap(settings.map);
        this.initStaticObjects(settings.staticObjects);
        this.initDynamicObjects(settings.dynamicObjects, settings.food);

        this.render();
    }

    static loadFromFile = async (url: string) => {
        let response = await fetch(url),
            data = await response.json();
    
        return new Game(data.config);
    }

    private initView(mapSettings: any) {

        let tileSize: Size = mapSettings.tileSize || {}

        this.view = new Application({
            width: this.tileSize.width * mapSettings.rows, 
            height: this.tileSize.height * mapSettings.cols,                       
            antialias: true, 
            transparent: true, 
            resolution: 1
          }
        );

        document.body.appendChild(this.view.view);
    }

    private initMap(mapSettings: any) {
        let { rows: width, cols: height } = mapSettings;
        this.map = new WorldMap(this, { width, height });
    }

    private initStaticObjects(objects: any) {
        this.staticObjects = objects.map(
            (objectSettings: any) => this.objectFactory.createObject(
                objectSettings.type, 
                objectSettings.options
            )
        );
    }

    private initDynamicObjects(objects: any, foodSettings: any = {}) {

        let foodObjects = this.createFoodObjects(foodSettings);

        this.dynamicObjects = foodObjects.concat(objects.map(
            (objectSettings: any) => this.objectFactory.createObject(
                objectSettings.type, 
                objectSettings.options
            )
        ));

        
    }

    private createFoodObjects(settings: any) {
        let { count = 1, extraFoodProbability = 0.1 } = settings,
            foodObjects = [];

        for (let i = 0; i < count; i++) {
            foodObjects.push(
                this.objectFactory.createObject("food", {
                    extra: Math.random() >= 1 - extraFoodProbability
                })
            )
        }

        return foodObjects;
    }

    private render() {
        this.map.render(this.view.stage);
        this.staticObjects.forEach(obj => obj.render(this.view.stage));
    }

    private fireAction(action, cell) {
        if (this.listeners.has(action)) {
            this.listeners.get(action).forEach(l => l(cell));
        }
    }

    public getTileFactory(): TileFactory {
        return this.tileFactory;
    }

    public getObjectFactory(): ObjectFactory {
        return this.objectFactory
    }

    public getMap(): WorldMap {
        return this.map;
    }

    public getDynamicObjects(): BaseObject[] {
        return this.dynamicObjects;
    }

    public getStaticObjects(): BaseObject[] {
        return this.staticObjects;
    }

    public removeDynamicObject(objToRemove: BaseObject) {
        this.dynamicObjects = this.dynamicObjects.filter(obj => objToRemove !== obj);
    }

    public removeStaticObject(objToRemove: BaseObject) {
        this.staticObjects = this.staticObjects.filter(obj => objToRemove !== obj);
    }

    public getView(): Application {
        return this.view;
    }

    public start() {
        this.dynamicObjects.forEach(obj => obj.spawn())
    }

    public on(action, callbackFn): ThisParameterType<Game> {
        if (! (this.listeners.has(action)) ) {
            this.listeners.set(action, []);
        }
        this.listeners.get(action).push(callbackFn);

        return this;
    }
}