import { PlaceType } from './place-type';
import TrafficSensor from './traffic-sensor';
import MovingObject from './moving-object';

/**
 * Klasa reprezentująca pojedynczą lampę
 */
export default class Lamp {

  /**
   * Konstruktor klasy.
   * @param id identyfikator nowej lampy
   * @param posX pozycja X nowej lampy
   * @param posY pozycja Y nowej lampy
   * @param place położenie nowej lampy
   */
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
  /**
   * identyfikator lampy
   */
  id: number;
  /**
   * moc lampy w Watach
   */
  power: number;
  /**
   * moc warunkowa lampy w Watach
   */
  conditionalPower: number;
  /**
   * pozycja X lampy
   */
  posX: number;
  /**
   * pozycja Y lampy
   */
  posY: number;
  /**
   * położenie lampy
   */
  place: PlaceType;
  /**
   * atrybut przechowujący informację o tym czy lampa jest włączona
   */
  enabled = 1;
  /**
   * czujnik natężenia ruchu
   */
  trafficSensor: TrafficSensor;
  /**
   * moc lampy w Watach
   */
  wattPower = 100;

  /**
   * Metoda statyczna zwracająca kopię obiektu lampy przekazanej jako argument(kopię, nie referencję!).
   * @param lamp obiekt klasy lamp
   * @returns nowy obiekt będący kopią obiektu lampy
   */
  static from(lamp: Lamp): Lamp {
    const result = new Lamp(lamp.id, lamp.posX, lamp.posY, lamp.place);
    result.conditionalPower = lamp.conditionalPower;
    result.power = lamp.power;
    result.enabled = lamp.enabled;
    result.wattPower = lamp.wattPower;
    result.trafficSensor = TrafficSensor.from(lamp.trafficSensor);
    return result;
}

  /**
   * Metoda zwracająca kopię obiektu lampy (kopię, nie referencję!).
   * @returns nowy obiekt będący kopią obiektu lampy
   */
  clone(): Lamp {
    const lamp = new Lamp(this.id, this.posX, this.posY, this.place);
    lamp.conditionalPower = this.conditionalPower;
    lamp.power = this.power;
    lamp.enabled = this.enabled;
    lamp.wattPower = this.wattPower;
    lamp.trafficSensor = this.trafficSensor.clone();
    return lamp;
  }

  /**
   * Metoda zmienia stan uruchomienia lampy (on/off)
   * @param enable nowy status
   */
  setEnabled(enable: number) {
    this.enabled = enable;
  }

  /**
   * Metoda zwraca aktualny status lampy
   * @returns status lampy
   */
  getEnabled(): number {
    return this.enabled;
  }

  /**
   * Metoda ustawia pozycję lampy
   * @param posX pozycja na płaszczyźnie X
   * @param posY pozycja na płaszczyźnie Y
   */
  setPosition(posX: number, posY: number) {
    this.posX = posX;
    this.posY = posY;
    this.trafficSensor.posX = posX;
    this.trafficSensor.posY = posY;
  }

  /**
   * Metoda ustawia moc lampy w zależności od natężenia ruchu w jej okolicy.
   * @param objects lista wszystkich obiektów dynamicznych
   */
  updatePowerFromSensor(objects: MovingObject[]) {
    this.trafficSensor.findObjectsInRange(objects);
    if (this.trafficSensor.objectCount >= 5) {
      this.conditionalPower = this.power * 1.75;
      return;
    }
    if (this.trafficSensor.objectCount >= 3) {
      this.conditionalPower = this.power * 1.5;
      return;
    }
    if (this.trafficSensor.objectCount >= 2) {
      this.conditionalPower = this.power * 1.25;
      return;
    }
    this.conditionalPower = this.power;
  }

}
