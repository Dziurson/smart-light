import Lamp from './lamp';
import MovingObject from './moving-object';
import Junction from './junction';
import Road from './road';
import { MovingObjectType } from './moving-object-type';

export default class SmartCityModel {
    lampList: Lamp[];
    objects: MovingObject[];
    junctions: Junction[];
    roads: Road[];
    totalEnergyUsage = 0;
    totalEnergyNormalUsage = 0;
    savedMoney: number = 0.0;
    priceBuffor: number = 0.0;

    constructor() {
        this.junctions = [];
        this.lampList = [];
        this.objects = [];
        this.roads = [];
    }

    clone() : SmartCityModel {
        let model = new SmartCityModel();
        model.junctions = this.junctions.map(junction => junction.clone());
        model.lampList = this.lampList.map(lamp => lamp.clone());
        model.objects = this.objects.map(object => object.clone());
        model.roads = this.roads.map(road => road.clone());
        model.totalEnergyNormalUsage = this.totalEnergyNormalUsage;
        model.totalEnergyUsage = this.totalEnergyUsage;
        model.savedMoney = this.savedMoney;
        model.priceBuffor = this.priceBuffor;
        return model;
    }

    getCarCount() {
        return this.objects.filter(o => o.type == MovingObjectType.Car).length;
    }
}
