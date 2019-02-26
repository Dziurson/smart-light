import Lamp from './lamp';
import MovingObject from './moving-object';

/**
 * Klasa reprezentująca czujnik natężenia ruchu.
 */
export default class TrafficSensor {

  /**
   * zasięg wykrywania obiektów przez czujnik
   */
  range = 170;
  /**
   * ilość obiektów wykrytych przez czujnik w obserwowanym obszarze
   */
  objectCount: number;
  /**
   * pozycja X czujnika
   */
  posX: number;
  /**
   * pozycja Y czujnika
   */
  posY: number;

  /**
   * Konstruktor klasy. Ustawia pozycję czujnika na płaszczyźnie.
   * @param posX pozycja na osi X nowego czujnika
   * @param posY pozycja na osi Y nowego czujnika
   */
  constructor(posX: number, posY: number) {
      this.posX = posX;
      this.posY = posY;
  }

   /**
   * Statyczna metoda tworząca kopię(nie referencję!) obiektu czujnika.
   * @param sensor obiekt przeznaczony do kopiowania
   * @returns nowy obiekt czujnika
   */
  static from(sensor: TrafficSensor): TrafficSensor {
    const result = new TrafficSensor(sensor.posX, sensor.posY);
    result.objectCount = sensor.objectCount;
    return result;
  }

  /**
   * Metoda tworząca kopię (nie referencję!) instancji klasy czujnika.
   * @returns nowy obiekt czujnika
   */
  clone() {
    const sensor = new TrafficSensor(this.posX, this.posY);
    sensor.objectCount = this.objectCount;
    return sensor;
  }

  /**
   * Metoda znajduje wszystkie obiekty dynamiczne w obszarze swojego działania (posX/Y +- range).
   * @param objects lista wszystkich obiektów dynamicznych wchodzących w skład systemu w danej iteracji
   */
  findObjectsInRange(objects: MovingObject[]) {
    this.objectCount = 0;
    const objectsInRange = objects.filter(o =>
        (this.posX + this.range > o.posX && this.posX - this.range < o.posX) &&
        (this.posY + this.range > o.posY && this.posY - this.range < o.posY));

    if (objectsInRange) {
        this.objectCount = objectsInRange.length;
    }
  }
}
