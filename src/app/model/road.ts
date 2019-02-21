export default class Road {   
    startX: number;
    startY: number;
    endX: number;
    endY: number;

    constructor(startX: number, startY: number, endX: number, endY: number) {
        this.endX = endX;
        this.endY = endY;
        this.startX = startX;
        this.startY = startY;
    }

    clone() : Road {
        return new Road(this.startX, this.startY, this.endX, this.endY);
    }

    static from(road: Road) : Road {
        return new Road(road.startX, road.startY, road.endX, road.endY);
    }
}