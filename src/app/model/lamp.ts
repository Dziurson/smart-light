import { PlaceType } from './place-type';

export default class Lamp {
  id: number;
  power: number;
  posX: number;
  posY: number;
  place: PlaceType;

  constructor(id, posX, posY, place) {
    switch (place) {
      case PlaceType.DangerousPlaces: {
        this.power = 1.25;
        break;
      }
      case PlaceType.HighTraffic: {
        this.power = 1;
        break;
      }
      case PlaceType.NormalTraffic: {
        this.power = 0.75;
        break;
      }
      case PlaceType.Parks: {
        this.power = 0.25;
        break;
      }
      default: {
        this.power = 0.5;
        break;
      }
    }
  }
}
