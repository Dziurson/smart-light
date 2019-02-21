import { PlaceType } from './place-type';
import TrafficSensor from './traffic-sensor';
import MovingObject from './moving-object';

export default class Lamp {
  id: number;
  power: number;
  conditionalPower: number;
  posX: number;
  posY: number;
  place: PlaceType;
  enabled: number = 1;
  trafficSensor: TrafficSensor;
  wattPower = 100;

  constructor(id: number, posX: number, posY: number, place: PlaceType) {
    this.id = id;
    this.posX = posX;
    this.posY = posY;
    this.place = place;
    this.trafficSensor = new TrafficSensor(posX, posY);

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

    this.conditionalPower = this.power;
  }

  clone() : Lamp {
    var lamp = new Lamp(this.id, this.posX, this.posY, this.place)
    lamp.conditionalPower = this.conditionalPower;
    lamp.power = this.power;
    lamp.enabled = this.enabled;
    lamp.wattPower = this.wattPower;
    lamp.trafficSensor = this.trafficSensor.clone();
    return lamp;
  }

  static from(lamp: Lamp) : Lamp {
    var result = new Lamp(lamp.id, lamp.posX, lamp.posY, lamp.place)
    result.conditionalPower = lamp.conditionalPower;
    result.power = lamp.power;
    result.enabled = lamp.enabled;
    result.wattPower = lamp.wattPower;
    result.trafficSensor = TrafficSensor.from(lamp.trafficSensor);
    return result;
}

  setEnabled(enable: number) {
    this.enabled = enable;
  }

  getEnabled() {
    return this.enabled;
  }

  setPosition(posX: number, posY: number) {
    this.posX = posX
    this.posY = posY
    this.trafficSensor.posX = posX
    this.trafficSensor.posY = posY
  }

  updatePowerFromSensor(objects: MovingObject[]) {
    this.trafficSensor.findObjectsInRange(objects);
    if(this.trafficSensor.objectCount >= 5) {
      this.conditionalPower = this.power * 1.75;
      return;
    }
    if(this.trafficSensor.objectCount >= 3) {
      this.conditionalPower = this.power * 1.5;
      return;
    }
    if(this.trafficSensor.objectCount >= 2) {
      this.conditionalPower = this.power * 1.25;
      return;
    }
    this.conditionalPower = this.power;
  }

}
