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

@Component({
  selector: 'app-simulation',
  templateUrl: './simulation.component.html',
  styleUrls: ['./simulation.component.css']
})
export class SimulationComponent implements OnInit {

  lampStats: any[];  
  private iteration: number = 0;
  iterations: number = 1000;
  timeInterval = 20;
  model: SmartCityModel;

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
  }


  runSimulation() {   
    var i = this.iterations;
    var simulation = setInterval(() => {
      if(i == 0)
        clearInterval(simulation);      
      this.handleSystemIteration(); 
      this.iteration++;
      i--;
      this.drawingService.setLampList(this.model);
    }, this.timeInterval)
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
    })
  }
}
