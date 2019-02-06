import Lamp from './lamp';
import MovingObject from './moving-object';
import { MovingObjectType } from './moving-object-type';
import { PlaceType } from './place-type';

export default class SmartLightModel {
    lampList: Lamp[] = [];
    movingObjects: MovingObject[] = [];

    constructor() { }

    setTestLamps() {
        this.lampList.push({ id: 1, power: 1, posX: 50, posY: 50, place: PlaceType.NormalTraffic });
        this.lampList.push({ id: 2, power: 1, posX: 50, posY: 250, place: PlaceType.DangerousPlaces });
        this.lampList.push({ id: 3, power: 1, posX: 250, posY: 250, place: PlaceType.Parks });
    }

    setTestMovingObjects() {
        this.movingObjects.push({ id: 1, posX: 0, posY: 0, type: MovingObjectType.Car, velocity: 10 });
        this.movingObjects.push({ id: 2, posX: 0, posY: 0, type: MovingObjectType.Pedestrian, velocity: 2 });
        this.movingObjects.push({ id: 3, posX: 0, posY: 0, type: MovingObjectType.Cyclict, velocity: 4 });
    }
}
