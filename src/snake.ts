import { Game } from './core/Game';

Game.loadFromFile("./config/levels/test.json").then((game: Game) => {
    game.start();
});