import { Direction } from './direction';
import MovingObject from './moving-object';

/**
 * Klasa reprezentująca skrzyżowanie
 */
export default class Junction {

  /**
   * Konstruktor klasy.
   * @param posX pozycja X nowego skrzyżowania
   * @param posY pozycja y nowego skrzyżowania
   * @param directions tablica zawierająca dostepne kierunki skrętu z nowego skrzyżowania
   */
  constructor(posX: number, posY: number, directions: Direction[]) {
      this.posX = posX;
      this.posY = posY;
      this.directions = directions;
  }
  /**
   * Możliwe kierunki ruchu ze skrzyżowania
   */
  directions: Direction[] = [];
  /**
   * Pozycja X skrzyżowania
   */
  posX: number;
  /**
   * Pozycja Y skrzyżowania
   */
  posY: number;
  /**
   * Atrybut pomocniczy, określający rozmiar skrzyżowania (obsługa kolizji z obiektami dynamicznymi)
   */
  size = 10;

  /**
   * Statyczna metoda kopiująca obiekt skrzyżowania(?). Intencje autora nie do końca są znane :)
   * @param junction obiekt typu Junction
   */
  static from(junction: Junction): Junction {
      const result = new Junction(junction.posX, junction.posY, junction.directions);
      result.size = junction.size;
      return result;
  }

  /**
   * Metoda kopiująca obiekt skrzyżowania(?). Intencje autora nie do końca są znane :)
   * @returns nowy obiekt skrzyżowania o takich samych parametrach
   */
  clone(): Junction {
      return new Junction(this.posX, this.posY, this.directions);
  }

  /**
   * Metoda wybierająca kierunki możliwe ruchu dla obiektu dynamicznego.
   * @param object obiekt dynamiczny w symulacji typu MovingObject
   */
  setDirection(object: MovingObject) {
      let availableDirections = this.directions;
      switch (object.direction) {
          case Direction.Up: {
              availableDirections = this.directions.filter(d => d != Direction.Down);
              break;
          }
          case Direction.Down: {
              availableDirections = this.directions.filter(d => d != Direction.Up);
              break;
          }
          case Direction.Left: {
              availableDirections = this.directions.filter(d => d != Direction.Right);
              break;
          }
          case Direction.Right: {
              availableDirections = this.directions.filter(d => d != Direction.Left);
              break;
          }
      }
      object.direction = availableDirections[Math.floor(Math.random() * availableDirections.length)];
      if(object.direction == Direction.Down) {
        object.posX = this.posX;
        object.posY = this.posY + this.size;
      }
      if(object.direction == Direction.Up) {
        object.posX = this.posX;
        object.posY = this.posY - this.size;
      }
      if(object.direction == Direction.Right) {
        object.posX = this.posX + this.size;
        object.posY = this.posY;
      }
      if(object.direction == Direction.Left) {
        object.posX = this.posX - this.size;
        object.posY = this.posY;
      }
  }
}
