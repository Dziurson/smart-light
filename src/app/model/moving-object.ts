import { MovingObjectType } from './moving-object-type';
import { Direction } from './direction';

export default class MovingObject {
    id: number;
    type: MovingObjectType;
    posX: number;
    posY: number;
    velocity: number;
    direction: Direction = Direction.Left;
    color: string = '#FF0000';

    constructor(id, posX, posY, velocity, type) {
        this.id = id;
        this.posX = posX;
        this.posY = posY;
        this.velocity = velocity;
        this.type = type;
    }

    move() {
        switch(this.direction) {
            case Direction.Up: {
                this.posY = this.posY - this.velocity;
                break;
            }   
            case Direction.Down: {
                this.posY = this.posY + this.velocity;
                break;
            } 
            case Direction.Left: {
                this.posX = this.posX - this.velocity;
                break;
            } 
            case Direction.Right: {
                this.posX = this.posX + this.velocity;
                break;
            } 
        }
    }
}
