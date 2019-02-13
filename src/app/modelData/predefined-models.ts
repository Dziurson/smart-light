import SmartCityModel from '../model/smart-city-model';
import Lamp from '../model/lamp';
import { PlaceType } from '../model/place-type';
import Junction from '../model/junction';
import { Direction } from '../model/direction';
import Road from '../model/road';

const model1: SmartCityModel = new SmartCityModel()
model1.lampList = [
    new Lamp(1,1100,150,PlaceType.NormalTraffic),
    new Lamp(2,900,150,PlaceType.NormalTraffic),
    new Lamp(3,700,150,PlaceType.NormalTraffic),
    new Lamp(4,500,150,PlaceType.NormalTraffic),
    new Lamp(5,300,150,PlaceType.NormalTraffic),
    new Lamp(6,300,400,PlaceType.NormalTraffic),
    new Lamp(7,500,400,PlaceType.NormalTraffic),
    new Lamp(8,700,400,PlaceType.NormalTraffic),
    new Lamp(9,900,400,PlaceType.NormalTraffic),
    new Lamp(10,1100,400,PlaceType.NormalTraffic),
    new Lamp(6,300,650,PlaceType.NormalTraffic),
    new Lamp(7,500,650,PlaceType.NormalTraffic),
    new Lamp(8,700,650,PlaceType.NormalTraffic),
    new Lamp(9,900,650,PlaceType.NormalTraffic),
    new Lamp(10,1100,650,PlaceType.NormalTraffic)
]
model1.junctions=[
    new Junction(300, 150, [Direction.Down, Direction.Right]),
    new Junction(300, 400, [Direction.Up, Direction.Right, Direction.Down]),
    new Junction(1100, 150, [Direction.Left, Direction.Down]),
    new Junction(1100, 400, [Direction.Left, Direction.Up, Direction.Down]),
    new Junction(700, 150, [Direction.Left, Direction.Right, Direction.Down]),
    new Junction(700, 400, [Direction.Left, Direction.Right, Direction.Up]),
    new Junction(300, 650, [Direction.Up, Direction.Right]),
    new Junction(500, 400, [Direction.Down, Direction.Right, Direction.Left]),
    new Junction(500, 650, [Direction.Up, Direction.Right, Direction.Left]),
    new Junction(900, 400, [Direction.Left, Direction.Down, Direction.Right]),
    new Junction(900, 650, [Direction.Left, Direction.Right, Direction.Up]),
    new Junction(1100, 650, [Direction.Left, Direction.Up]),
]
model1.roads = [
    new Road(1100, 150, 300, 150),
    new Road(1100, 400, 300, 400),
    new Road(300, 150, 300, 650),
    new Road(1100, 150, 1100, 650),
    new Road(700, 150, 700, 400),
    new Road(1100, 650, 300, 650),
    new Road(900, 400, 900, 650),
    new Road(500, 400, 500, 650),
]

const model2: SmartCityModel = new SmartCityModel()
model2.junctions=[
    new Junction(300, 150, [Direction.Down, Direction.Right]),
    new Junction(300, 400, [Direction.Up, Direction.Right, Direction.Down]),
    new Junction(1100, 150, [Direction.Left, Direction.Down]),
    new Junction(1100, 400, [Direction.Left, Direction.Up, Direction.Down]),
    new Junction(700, 150, [Direction.Left, Direction.Right, Direction.Down]),
    new Junction(700, 400, [Direction.Left, Direction.Right, Direction.Up]),
    new Junction(300, 650, [Direction.Up, Direction.Right]),
    new Junction(500, 400, [Direction.Down, Direction.Right, Direction.Left]),
    new Junction(500, 650, [Direction.Up, Direction.Right, Direction.Left]),
    new Junction(900, 400, [Direction.Left, Direction.Down, Direction.Right]),
    new Junction(900, 650, [Direction.Left, Direction.Right, Direction.Up]),
    new Junction(1100, 650, [Direction.Left, Direction.Up]),
]
model2.roads = [
    new Road(1100, 150, 300, 150),
    new Road(1100, 400, 300, 400),
    new Road(300, 150, 300, 650),
    new Road(1100, 150, 1100, 650),
    new Road(700, 150, 700, 400),
    new Road(1100, 650, 300, 650),
    new Road(900, 400, 900, 650),
    new Road(500, 400, 500, 650),
]

const model3: SmartCityModel = new SmartCityModel()
model3.junctions=[
    new Junction(300, 150, [Direction.Down, Direction.Right]),
    new Junction(300, 400, [Direction.Up, Direction.Right, Direction.Down]),
    new Junction(1100, 150, [Direction.Left, Direction.Down]),
    new Junction(1100, 400, [Direction.Left, Direction.Up, Direction.Down]),    
    new Junction(300, 650, [Direction.Up, Direction.Right]),    
    new Junction(1100, 650, [Direction.Left, Direction.Up]),
]
model3.roads = [
    new Road(1100, 150, 300, 150),
    new Road(1100, 400, 300, 400),
    new Road(300, 150, 300, 650),
    new Road(1100, 150, 1100, 650),
    new Road(1100, 650, 300, 650),    
]

export const smartCitytModels: SmartCityModel[] = [model1, model2, model3];