import { Direction } from './direction';

export default class Junction {
    directions: Direction[] = [];
    posX: number;
    posY: number;
    size: number = 10;

    constructor(posX, posY, directions) {
        this.posX = posX;
        this.posY = posY;
        this.directions = directions;
    }
}