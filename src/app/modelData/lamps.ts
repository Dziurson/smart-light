import Lamp from '../model/lamp';
import { PlaceType } from '../model/place-type';

export const lamps: Lamp[] = [
    new Lamp(1,1100,150,PlaceType.NormalTraffic),
    new Lamp(2,900,150,PlaceType.NormalTraffic),
    new Lamp(3,700,150,PlaceType.NormalTraffic),
    new Lamp(4,500,150,PlaceType.NormalTraffic),
    new Lamp(5,300,150,PlaceType.NormalTraffic),
    new Lamp(6,300,400,PlaceType.NormalTraffic),
    new Lamp(7,500,400,PlaceType.NormalTraffic),
    new Lamp(8,700,400,PlaceType.NormalTraffic),
    new Lamp(9,900,400,PlaceType.NormalTraffic),
    new Lamp(10,1100,400,PlaceType.NormalTraffic),
    new Lamp(6,300,650,PlaceType.NormalTraffic),
    new Lamp(7,500,650,PlaceType.NormalTraffic),
    new Lamp(8,700,650,PlaceType.NormalTraffic),
    new Lamp(9,900,650,PlaceType.NormalTraffic),
    new Lamp(10,1100,650,PlaceType.NormalTraffic)
];