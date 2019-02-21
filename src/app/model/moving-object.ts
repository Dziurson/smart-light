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

    constructor(id: number, posX: number, posY: number, velocity: number, type: MovingObjectType, color: string = '#FF0000', direction: Direction = Direction.Left) {
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

    static from(object: MovingObject) : MovingObject {
        return new MovingObject(object.id, object.posX, object.posY, object.velocity, object.type, object.color, object.direction);
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
