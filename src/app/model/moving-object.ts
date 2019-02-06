import { MovingObjectType } from './moving-object-type';

export default class MovingObject {
    id: number;
    type: MovingObjectType;
    posX: number;
    posY: number;
    velocity: number;
}
