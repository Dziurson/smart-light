import Lamp from './lamp';
import MovingObject from './moving-object';

export default class TrafficSensor {
    range: number = 170;
    objectCount: number;
    posX: number;
    posY: number;

    constructor(posX, posY) {
        this.posX = posX;
        this.posY = posY;
    }

    clone() {
        var sensor = new TrafficSensor(this.posX, this.posY);
        sensor.objectCount = this.objectCount;
        return sensor;
    }

    static from(sensor: TrafficSensor) : TrafficSensor {
        var result = new TrafficSensor(sensor.posX, sensor.posY);
        result.objectCount = sensor.objectCount;
        return result;
    }

    findObjectsInRange(objects: MovingObject[]) {
        this.objectCount = 0;
        var objectsInRange = objects.filter(o => 
            (this.posX + this.range > o.posX && this.posX - this.range < o.posX) && 
            (this.posY + this.range > o.posY && this.posY - this.range < o.posY))

        if(objectsInRange)
            this.objectCount = objectsInRange.length;        
    }
}