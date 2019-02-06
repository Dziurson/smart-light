import { PlaceType } from './place-type';

export default class Lamp {
  id: number;
  power: number;  
  posX: number;
  posY: number;
  place: PlaceType;
  enabled: number = 1;

  constructor(id, posX, posY, place) {
    this.id = id;
    this.posX = posX;
    this.posY = posY;
    this.place = place;
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

  setEnabled(enable: number) {
    this.enabled = enable;
  }

  getEnabled() {
    return this.enabled;
  }

  getPower(): number {
    return this.power;
  }

  setPower(power: number) {
    this.power = power;
  }
}
