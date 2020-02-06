import { Snake } from "./Snake";
import { Game } from "../Game";
import { KeyboardController } from "../utils/KeyboardController";

export class UserControlledSnake extends Snake {

    protected keyboardController: KeyboardController;

    constructor(game: Game, options: any) {
        super(game, options);

        this.keyboardController = new KeyboardController({...{
            'up': 'ArrowUp',
            'down': 'ArrowDown',
            'left': 'ArrowLeft',
            'right': 'ArrowRight'
        }, ...options.controller});
    }

    private attachActionHandlers() {

        this.keyboardController.on('up', () => {
            if (this.direction.dy !== 1) {
                this.setDirection({dx: 0, dy: -1})
                this.move();
            }
        });

        this.keyboardController.on('down', () => {
            if (this.direction.dy !== -1) {
                this.setDirection({dx: 0, dy: 1})
                this.move();
            }
        });

        this.keyboardController.on('left', () => {
            if (this.direction.dx !== 1) {
                this.setDirection({dx: -1, dy: 0})
                this.move();
            }
        });

        this.keyboardController.on('right', () => {
            if (this.direction.dx !== -1) {
                this.setDirection({dx: 1, dy: 0})
                this.move();
            }
        });
    }

    private detachActionHandlers() {
        this.keyboardController.removeAllListeners();
    }

    public spawn() {
        super.spawn();

        this.attachActionHandlers();
    }

    public destroy() {
        super.destroy.call(this);

        this.detachActionHandlers();
    }
}