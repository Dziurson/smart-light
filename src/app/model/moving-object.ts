import { MovingObjectType } from './moving-object-type';
import { Direction } from './direction';

/**
 * Klasa reprezentująca obiekt dynamiczny w symulacji
 */
export default class MovingObject {
    /**
     * identyfikator obiektu
     */
    id: number;
    /**
     * typ obiektu
     */
    type: MovingObjectType;
    /**
     * pozycja X obiektu
     */
    posX: number;
    /**
     * pozycja Y obiektu
     */
    posY: number;
    /**
     * prędkość obiektu
     */
    velocity: number;
    /**
     * kierunek przemieszczania się obiektu
     */
    direction: Direction;
    /**
     * kolor obiektu
     */
    color: string;

    /**
     * Konstruktor klasy.
     * @param id identyfikator nowego obiektu
     * @param posX pozycja X nowego obiektu
     * @param posY pozycja Y nowego obiektu
     * @param velocity prędkość nowego obiektu
     * @param type typ nowego obiektu
     * @param color kolor nowego obiektu
     * @param direction kierunek przemieszczania się nowego obiektu
     */
    constructor(id: number, posX: number, posY: number, velocity: number,
      type: MovingObjectType, color: string = '#FF0000', direction: Direction = Direction.Left) {
        this.id = id;
        this.posX = posX;
        this.posY = posY;
        this.velocity = velocity;
        this.type = type;
        this.color = color;
        this.direction = direction;
    }

    /**
     * Statyczna metoda tworząca kopię(nie referencję!) obiektu.
     * @param object obiekt przeznaczony do kopiowania
     * @returns nowy obiekt dynamiczny
     */
    static from(object: MovingObject): MovingObject {
        return new MovingObject(object.id, object.posX, object.posY, object.velocity, object.type, object.color, object.direction);
    }

    /**
     * Metoda tworząca kopię (nie referencję!) instancji klasy.
     * @returns nowy obiekt dynamiczny
     */
    clone(): MovingObject {
        return new MovingObject(this.id, this.posX, this.posY, this.velocity, this.type, this.color, this.direction);
    }

    /**
     * Metoda obliczająca nową pozycję obiektu.
     */
    move() {
        switch (this.direction) {
            case Direction.Up: {
                this.posY = this.posY - this.velocity;
                break;
            }
            case Direction.Down: {
                this.posY = this.posY + this.velocity;
                break;
            }
            case Direction.Left: {
                this.posX = this.posX - this.velocity;
                break;
            }
            case Direction.Right: {
                this.posX = this.posX + this.velocity;
                break;
            }
        }
    }
}
