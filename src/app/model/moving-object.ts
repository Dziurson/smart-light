import { MovingObjectType } from './moving-object-type';
import { Direction } from './direction';

export default class MovingObject {
    id: number;
    type: MovingObjectType;
    posX: number;
    posY: number;
    velocity: number;
    direction: Direction;
    color: string;

    constructor(id, posX, posY, velocity, type, color = '#FF0000', direction = Direction.Left) {
        this.id = id;
        this.posX = posX;
        this.posY = posY;
        this.velocity = velocity;
        this.type = type;
        this.color = color;
        this.direction = direction;
    }

    clone() : MovingObject {
        return new MovingObject(this.id, this.posX, this.posY, this.velocity, this.type, this.color, this.direction);
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
