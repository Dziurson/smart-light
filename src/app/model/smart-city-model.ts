import Lamp from './lamp';
import MovingObject from './moving-object';
import Junction from './junction';
import Road from './road';

export default class SmartCityModel {
    lampList: Lamp[];
    objects: MovingObject[];
    junctions: Junction[];
    roads: Road[];
    totalEnergyUsage = 0;
    totalEnergyNormalUsage = 0;

    constructor() {
        this.junctions = [];
        this.lampList = [];
        this.objects = [];
        this.roads = [];
    }
}
