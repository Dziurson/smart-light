import { Direction } from './direction';
import MovingObject from './moving-object';

export default class Junction {
    directions: Direction[] = [];
    posX: number;
    posY: number;
    size: number = 10;

    constructor(posX: number, posY: number, directions: Direction[]) {
        this.posX = posX;
        this.posY = posY;
        this.directions = directions;
    }

    clone() : Junction {
        return new Junction(this.posX, this.posY, this.directions);
    }

    static from(junction: Junction) : Junction {
        var result = new Junction(junction.posX, junction.posY, junction.directions);
        result.size = junction.size;
        return result;
    }

    setDirection(object: MovingObject){
        var availableDirections = this.directions;
        switch(object.direction) {
            case Direction.Up: {
                availableDirections = this.directions.filter(d => d != Direction.Down);
                break;
            }   
            case Direction.Down: {
                availableDirections = this.directions.filter(d => d != Direction.Up);
                break;
            } 
            case Direction.Left: {
                availableDirections = this.directions.filter(d => d != Direction.Right);
                break;
            } 
            case Direction.Right: {
                availableDirections = this.directions.filter(d => d != Direction.Left);
                break;
            } 
        }
        object.direction = availableDirections[Math.floor(Math.random() * availableDirections.length)];
        if(object.direction == Direction.Down) {
          object.posX = this.posX;
          object.posY = this.posY + this.size;
        }
        if(object.direction == Direction.Up) {
          object.posX = this.posX;
          object.posY = this.posY - this.size;
        }
        if(object.direction == Direction.Right) {
          object.posX = this.posX + this.size;
          object.posY = this.posY;
        }
        if(object.direction == Direction.Left) {
          object.posX = this.posX - this.size;
          object.posY = this.posY;
        }
    }
}