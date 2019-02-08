import { Component, OnInit } from '@angular/core';
import { DrawingService } from '../services/drawing.service';
import Lamp from '../model/lamp';
import { PlaceType } from '../model/place-type';
import MovingObject from '../model/moving-object';
import { MovingObjectType } from '../model/moving-object-type';
import SmartCityModel from '../model/smart-city-model';
import Junction from '../model/junction';
import { Direction } from '../model/direction';
import { lamps } from '../modelData/lamps'
import { movingObjects } from '../modelData/moving-objects'
import Road from '../model/road';
import SimulationState from '../model/simulation-state';
import { Time } from '@angular/common';

@Component({
  selector: 'app-simulation',
  templateUrl: './simulation.component.html',
  styleUrls: ['./simulation.component.css']
})
export class SimulationComponent implements OnInit {

  lampStats: any[];
  private iteration = 0;
  iterations: number = 1000;
  timeInterval = 20;
  model: SmartCityModel;
  simulationRun = false;
  firstStart = true;
  firstStartTime: number;
  simulationHistory: SimulationState[] = [];
  startTime: number;
  carCounter: number;
  selectedTimestamp: number = 0;

  constructor(private drawingService: DrawingService) {
    this.model = new SmartCityModel();

    this.model.lampList = lamps;
    this.model.objects = movingObjects;

    this.model.junctions.push(new Junction(300,150,[Direction.Down, Direction.Right]));
    this.model.junctions.push(new Junction(300,400,[Direction.Up, Direction.Right, Direction.Down]));
    this.model.junctions.push(new Junction(1100,150,[Direction.Left, Direction.Down]));
    this.model.junctions.push(new Junction(1100,400,[Direction.Left, Direction.Up, Direction.Down]));
    this.model.junctions.push(new Junction(700,150,[Direction.Left, Direction.Right, Direction.Down]));
    this.model.junctions.push(new Junction(700,400,[Direction.Left, Direction.Right, Direction.Up]));
    this.model.junctions.push(new Junction(300,650,[Direction.Up, Direction.Right]));
    this.model.junctions.push(new Junction(500,400,[Direction.Down, Direction.Right, Direction.Left]));
    this.model.junctions.push(new Junction(500,650,[Direction.Up, Direction.Right, Direction.Left]));
    this.model.junctions.push(new Junction(900,400,[Direction.Left, Direction.Down, Direction.Right]));
    this.model.junctions.push(new Junction(900,650,[Direction.Left, Direction.Right, Direction.Up]));
    this.model.junctions.push(new Junction(1100,650,[Direction.Left, Direction.Up]));

    this.model.roads.push(new Road(1100,150,300,150));
    this.model.roads.push(new Road(1100,400,300,400));
    this.model.roads.push(new Road(300,150,300,650));
    this.model.roads.push(new Road(1100,150,1100,650));
    this.model.roads.push(new Road(700,150,700,400));
    this.model.roads.push(new Road(1100,650,300,650));
    this.model.roads.push(new Road(900,400,900,650));
    this.model.roads.push(new Road(500,400,500,650));
  }

  ngOnInit() {
    // this.runSimulation(1000);
    this.startTime = (Date.now() / 1000);
    this.carCounter = this.model.objects.length;
  }


  runSimulation(start_time: string) {
    this.parseStartTime(start_time);

    if (this.firstStart) {
      this.firstStartTime = this.startTime;
      this.firstStart = false;
    } else {
      this.model = this.simulationHistory[this.simulationHistory.length - 1].state;
      this.startTime = this.simulationHistory[this.simulationHistory.length - 1].timestamp;
    }

    var i = this.iterations;

    this.simulationRun = true;

    const simulation = setInterval(() => {
      if((i == 0) || !this.simulationRun) {
        clearInterval(simulation);
      }
      this.handleSystemIteration();
      this.iteration++;
      this.startTime += 1;
      i--;
      this.saveSimmulationState(this.startTime);
      this.drawingService.setLampList(this.model);
    }, this.timeInterval)
  }

  parseStartTime(start_time: string) {
    const today = new Date();
    const time_t = start_time.trim().split(':');
    const hour = Number(time_t[0]);
    const minutes = Number(time_t[1]);
    const seconds = Number(time_t[2]);

    this.startTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hour, minutes, seconds).getTime() / 1000;
  }

  saveSimmulationState(timestamp: number) {
    var record = new SimulationState();
    record.timestamp = timestamp;    
    record.state = this.model.clone();
    this.simulationHistory.push(record);
    this.selectedTimestamp = this.simulationHistory.length;
  }

  stopSimulation() {
    this.simulationRun = false;
  }

  calculatePowerUsage() {
    const timePassedInS = this.startTime - this.firstStartTime;
    this.model.lampList.forEach((item) => {
      this.model.totalEnergyNormalUsage += (item.wattPower) / (1000 * 3600);
      this.model.totalEnergyUsage += (item.power * item.wattPower) / (1000 * 3600);
    });
  }

  handleSystemIteration() {
    this.model.objects.filter(o => o.type == MovingObjectType.Car).forEach((object: MovingObject) => {
      var junction = this.model.junctions.find(j =>
        ((j.posX + j.size > object.posX && j.posX - j.size < object.posX) && (j.posY + j.size > object.posY && j.posY - j.size < object.posY)));

      if(junction) {
        junction.setDirection(object);
      }
      object.move();
    })
    this.model.lampList.forEach((item) => {
      item.updatePowerFromSensor(this.model.objects);
      this.calculatePowerUsage();
    })
  }

  addCar() {
    const speed = Math.floor((Math.random() * 12) + 1);
    const car = new MovingObject(this.carCounter, 1100, 150, speed, MovingObjectType.Car);
    this.model.objects.push(car);
    this.carCounter++;
  }

  removeCar() {
    this.model.objects.pop();
    this.carCounter--;
  }

  loadHistoryState() {    
    this.model = this.simulationHistory[this.selectedTimestamp].state;
    this.startTime = this.simulationHistory[this.selectedTimestamp].timestamp;
    this.drawingService.setLampList(this.model);
  }  
}

