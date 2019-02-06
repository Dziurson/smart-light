import Lamp from './lamp';
import MovingObject from './moving-object';
import Junction from './junction';

export default class SmartCityModel {
    lampList: Lamp[];
    objects: MovingObject[];
    junctions: Junction[]; 

    constructor() {
        this.junctions = [];
        this.lampList = [];
        this.objects = [];
    }
}