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
import Chart from 'chart.js';
import { SetupService } from '../services/setup.service';

@Component({
  selector: 'app-simulation',
  templateUrl: './simulation.component.html',
  styleUrls: ['./simulation.component.css']
})
export class SimulationComponent implements OnInit {

  lampStats: any[];
  private iteration = 0;
  iterations: number = 3600;
  timeInterval = 20;
  model: SmartCityModel;
  simulationRun = false;
  firstStart = true;
  firstStartTime: number;
  simulationHistory: SimulationState[] = [];
  startTime: number;
  endTime: number;
  carCounter: number;
  selectedTimestamp: number = 0;
  simulationTimeStep = 1;  
  stepWattNormalPower: number;
  stepWattPower: number;
  kwhPrice = 0.39975;
  

  constructor(
    private drawingService: DrawingService,
    private setupService: SetupService) {
    this.model = this.setupService.selectedModel
  }

  ngOnInit() {
    // this.runSimulation(1000);
    this.startTime = (Date.now() / 1000);
    this.endTime = this.startTime + 3600;
    this.carCounter = this.model.objects.length;   
    this.setupChart();
  }

  private setupChart() {
    var canvas = <HTMLCanvasElement>document.getElementById('chart');    
    var context = canvas.getContext('2d');
    context.imageSmoothingEnabled = false;
    var chart = new Chart(context, {
      "type": "line", "data": {
      "labels": [],
        "datasets": [{ "label": "Zaoszczędzona energia [%]", "data": [], "fill": false, "borderColor": "rgb(75, 192, 192)", "lineTension": 0.1 }]
      }, "options": {}
    });
    setInterval(() => {
      if (this.model && this.simulationRun) {
        if (chart.data.labels.length > 100) {
          chart.data.labels.shift();
          chart.data.datasets[0].data.shift();
        }
        chart.data.labels.push("");
        chart.data.datasets[0].data.push(100 - this.model.totalEnergyUsage / this.model.totalEnergyNormalUsage * 100);
        chart.update();
      }
    }, 1000);
  }

  runSimulation(start_time: string, end_time: string) {
    this.calculateSimulationTime(start_time, end_time);

    if (this.firstStart) {
      this.firstStartTime = this.startTime;
      this.firstStart = false;
      this.model.priceBuffor = this.model.savedMoney;
      this.model.savedMoney = 0;
    } else {
      this.model = this.simulationHistory[this.simulationHistory.length - 1].state;
      this.startTime = this.simulationHistory[this.simulationHistory.length - 1].timestamp;
    }

    var i = this.iterations;

    this.simulationRun = true;

    const simulation = setInterval(() => {
      if (i == 0)
        this.firstStart = true;
      if ((i == 0) || !this.simulationRun) {
        this.simulationRun = false;
        clearInterval(simulation);
      }
      this.handleSystemIteration();
      this.iteration++;
      this.startTime += this.simulationTimeStep;
      i--;
      this.saveSimmulationState(this.startTime);
      this.drawingService.setLampList(this.model);
    }, this.timeInterval)
  }

  calculateSimulationTime(start_time: string, end_time: string) {
    this.startTime = this.parseStartTime(start_time);
    this.endTime = this.parseStartTime(end_time);
    if(this.endTime < this.startTime)
      this.iterations = this.endTime + 60*60*24;
    else
      this.iterations = Math.abs(this.endTime - this.startTime);
  }

  parseStartTime(start_time: string): number {
    const today = new Date();
    const time_t = start_time.trim().split(':');
    const hour = Number(time_t[0]);
    const minutes = Number(time_t[1]);
    const seconds = Number(time_t[2]);

    return new Date(today.getFullYear(), today.getMonth(), today.getDate(), hour, minutes, seconds).getTime() / 1000;
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
      this.stepWattNormalPower = ((item.wattPower) / (1000 * 3600)) * this.simulationTimeStep;
      this.stepWattPower = ((item.conditionalPower * item.wattPower) / (1000 * 3600)) * this.simulationTimeStep;
      this.model.totalEnergyNormalUsage += this.stepWattNormalPower;
      this.model.totalEnergyUsage += this.stepWattPower;
    });
  }

  calculateSavedMoney() {
    this.model.savedMoney = ((this.model.totalEnergyNormalUsage - this.model.totalEnergyUsage) * this.kwhPrice) + this.model.priceBuffor;
  }

  handleSystemIteration() {
    this.model.objects.filter(o => o.type == MovingObjectType.Car).forEach((object: MovingObject) => {
      var junction = this.model.junctions.find(j =>
        ((j.posX + j.size > object.posX && j.posX - j.size < object.posX) && (j.posY + j.size > object.posY && j.posY - j.size < object.posY)));

      if (junction) {
        junction.setDirection(object);
      }
      object.move();
    })
    this.model.lampList.forEach((item) => {
      item.updatePowerFromSensor(this.model.objects);
      this.calculatePowerUsage();
    })
    this.calculateSavedMoney();
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

