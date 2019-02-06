import { Component, OnInit } from '@angular/core';
import { DrawingService } from '../services/drawing.service';
import Lamp from '../model/lamp';
import { PlaceType } from '../model/place-type';
import MovingObject from '../model/moving-object';
import { MovingObjectType } from '../model/moving-object-type';
import SmartCityModel from '../model/smart-city-model';
import Junction from '../model/junction';
import { Direction } from '../model/direction';

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

    this.model.lampList.push(new Lamp(1,1100,200,PlaceType.DangerousPlaces));
    this.model.lampList.push(new Lamp(2,900,200,PlaceType.NormalTraffic));
    this.model.lampList.push(new Lamp(3,700,200,PlaceType.NormalTraffic));
    this.model.lampList.push(new Lamp(4,500,200,PlaceType.NormalTraffic));
    this.model.lampList.push(new Lamp(5,300,200,PlaceType.NormalTraffic));
    this.model.lampList.push(new Lamp(6,300,500,PlaceType.NormalTraffic));
    this.model.lampList.push(new Lamp(7,500,500,PlaceType.NormalTraffic));
    this.model.lampList.push(new Lamp(8,700,500,PlaceType.NormalTraffic));
    this.model.lampList.push(new Lamp(9,900,500,PlaceType.NormalTraffic));
    this.model.lampList.push(new Lamp(10,1100,500,PlaceType.NormalTraffic));

    this.model.objects.push(new MovingObject(1,1150,200,1,MovingObjectType.Car));
    this.model.objects.push(new MovingObject(2,1000,200,11,MovingObjectType.Car));
    this.model.objects.push(new MovingObject(3,1100,200,9,MovingObjectType.Car));
    this.model.objects.push(new MovingObject(4,800,200,5,MovingObjectType.Car));
    this.model.objects.push(new MovingObject(5,900,200,8,MovingObjectType.Car));
    this.model.objects.push(new MovingObject(1,1150,200,2,MovingObjectType.Car));
    this.model.objects.push(new MovingObject(2,1000,200,7,MovingObjectType.Car));
    this.model.objects.push(new MovingObject(3,1100,200,6,MovingObjectType.Car));
    this.model.objects.push(new MovingObject(4,800,200,4,MovingObjectType.Car));
    this.model.objects.push(new MovingObject(5,900,200,2,MovingObjectType.Car));
    this.model.objects.push(new MovingObject(1,1150,200,9,MovingObjectType.Car));
    this.model.objects.push(new MovingObject(2,1000,200,5,MovingObjectType.Car));
    this.model.objects.push(new MovingObject(3,1100,200,1,MovingObjectType.Car));
    this.model.objects.push(new MovingObject(4,800,200,3,MovingObjectType.Car));
    this.model.objects.push(new MovingObject(5,900,200,4,MovingObjectType.Car));
    this.model.objects.push(new MovingObject(1,1150,200,5,MovingObjectType.Car));
    this.model.objects.push(new MovingObject(2,1000,200,10,MovingObjectType.Car));
    this.model.objects.push(new MovingObject(3,1100,200,7,MovingObjectType.Car));
    this.model.objects.push(new MovingObject(4,800,200,3,MovingObjectType.Car));
    this.model.objects.push(new MovingObject(5,900,200,4,MovingObjectType.Car));

    this.model.junctions.push(new Junction(300,200,[Direction.Down]));
    this.model.junctions.push(new Junction(300,500,[Direction.Up, Direction.Right]));
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
        object.direction = junction.directions[Math.floor(Math.random() * junction.directions.length)];
        if(object.direction == Direction.Down) {
          object.posX = junction.posX;
          object.posY = junction.posY + junction.size;
        }
        if(object.direction == Direction.Up) {
          object.posX = junction.posX;
          object.posY = junction.posY - junction.size;
        }
        if(object.direction == Direction.Right) {
          object.posX = junction.posX + junction.size;
          object.posY = junction.posY;
        }
        if(object.direction == Direction.Left) {
          object.posX = junction.posX - junction.size;
          object.posY = junction.posY;
        }
      }
      object.move();
    })
  }
}
