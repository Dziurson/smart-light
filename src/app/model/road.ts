export default class Road {   
    startX: number;
    startY: number;
    endX: number;
    endY: number;

    constructor(startX, startY, endX, endY) {
        this.endX = endX;
        this.endY = endY;
        this.startX = startX;
        this.startY = startY;
    }
}