import Lamp from './lamp';
import MovingObject from './moving-object';
import { MovingObjectType } from './moving-object-type';
import { PlaceType } from './place-type';

export default class SmartLightModel {
    lampList: Lamp[] = [];
    movingObjects: MovingObject[] = [];

    constructor() { }

    setTestLamps() {
        this.lampList.push({ id: 1, power: 1, posX: 1100, posY: 200, place: PlaceType.NormalTraffic })
        this.lampList.push({ id: 2, power: 1.25, posX: 900, posY: 200, place: PlaceType.NormalTraffic })
        this.lampList.push({ id: 3, power: 0.75, posX: 700, posY: 200, place: PlaceType.NormalTraffic })
        this.lampList.push({ id: 4, power: 0.25, posX: 500, posY: 200, place: PlaceType.NormalTraffic })
        this.lampList.push({ id: 5, power: 0.5, posX: 300, posY: 200, place: PlaceType.NormalTraffic })
        this.lampList.push({ id: 6, power: 1, posX: 300, posY: 500, place: PlaceType.NormalTraffic })
        this.lampList.push({ id: 7, power: 1, posX: 500, posY: 500, place: PlaceType.NormalTraffic })
        this.lampList.push({ id: 8, power: 1, posX: 700, posY: 500, place: PlaceType.NormalTraffic })
        this.lampList.push({ id: 9, power: 1, posX: 900, posY: 500, place: PlaceType.NormalTraffic })
        this.lampList.push({ id: 10, power: 1, posX: 1100, posY: 500, place: PlaceType.NormalTraffic })
    }

    setTestMovingObjects() {
        this.movingObjects.push({ id: 1, posX: 0, posY: 0, type: MovingObjectType.Car, velocity: 10 });
        this.movingObjects.push({ id: 2, posX: 0, posY: 0, type: MovingObjectType.Pedestrian, velocity: 2 });
        this.movingObjects.push({ id: 3, posX: 0, posY: 0, type: MovingObjectType.Cyclict, velocity: 4 });
    }
}
