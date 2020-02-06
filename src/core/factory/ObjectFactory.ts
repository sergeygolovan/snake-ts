import { UserControlledSnake } from '../objects/UserControlledSnake';
import { RandomBotSnake } from '../objects/RandomBotSnake';
import { HungryBotSnake } from '../objects/HungryBotSnake';
import { Food } from '../objects/Food';
import { Game } from '../Game';
import { BaseObject } from '../objects/BaseObject';
import { Wall } from '../objects/Wall';

type ObjectConstructor = (options: any) => BaseObject;

export class ObjectFactory {

    private constructors: Map<string, ObjectConstructor> = new Map<string, ObjectConstructor>([
        ["user-snake", this.createUserControlledSnake],
        ["random-snake", this.createRandomBotSnake],
        ["hungry-snake", this.createHungryBotSnake],
        ["food", this.createFood],
        ["wall", this.createWall]
    ]);

    constructor(
        readonly game: Game
    ) {}

    public createObject(name: string, options: any): BaseObject {
        if ( !this.constructors.has(name) ) {
            throw new Error(`Неизвестный объект: ${name}`);
        }

        let objectConstructor = this.constructors.get(name);
        
        return objectConstructor.call(this, options)
    }

    protected createUserControlledSnake(options: any): BaseObject {
        return new UserControlledSnake(this.game, options);
    }

    protected createRandomBotSnake(options: any): BaseObject {
        return new RandomBotSnake(this.game, options);
    }

    protected createHungryBotSnake(options: any): BaseObject {
        return new HungryBotSnake(this.game, options);
    }

    protected createFood(options: any): BaseObject {
        return new Food(this.game, options);
    }

    protected createWall(options: any): BaseObject {
        return new Wall(this.game, options);
    }
}