import Lamp from '../model/lamp';
import { PlaceType } from '../model/place-type';

export const lamps: Lamp[] = [
    new Lamp(1,1100,200,PlaceType.DangerousPlaces),
    new Lamp(2,900,200,PlaceType.NormalTraffic),
    new Lamp(3,700,200,PlaceType.NormalTraffic),
    new Lamp(4,500,200,PlaceType.NormalTraffic),
    new Lamp(5,300,200,PlaceType.NormalTraffic),
    new Lamp(6,300,500,PlaceType.NormalTraffic),
    new Lamp(7,500,500,PlaceType.NormalTraffic),
    new Lamp(8,700,500,PlaceType.NormalTraffic),
    new Lamp(9,900,500,PlaceType.NormalTraffic),
    new Lamp(10,1100,500,PlaceType.NormalTraffic),
    new Lamp(6,300,650,PlaceType.NormalTraffic),
    new Lamp(7,500,650,PlaceType.NormalTraffic),
    new Lamp(8,700,650,PlaceType.NormalTraffic),
    new Lamp(9,900,650,PlaceType.NormalTraffic),
    new Lamp(10,1100,650,PlaceType.NormalTraffic)
];