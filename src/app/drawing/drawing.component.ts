import { Component, OnInit } from '@angular/core';
import Lamp from '../model/lamp';
import { DrawingService } from '../services/drawing.service';
import * as $ from 'jquery';
import SmartCityModel from '../model/smart-city-model';
import MovingObject from '../model/moving-object';
import { Direction } from '../model/direction';

@Component({
  selector: 'app-drawing',
  templateUrl: './drawing.component.html',
  styleUrls: ['./drawing.component.css']
})
export class DrawingComponent implements OnInit {
  
  canvas: HTMLCanvasElement;
  screenWidth: number;
  screenHeight: number;
  context: CanvasRenderingContext2D;
  model: SmartCityModel;

  constructor( private drawingService: DrawingService ) {
  }  

  ngOnInit() {
    this.canvas = <HTMLCanvasElement>document.getElementById('stage');
    this.screenHeight = 720;
    this.screenWidth = 1280;
    this.context = this.canvas.getContext('2d');
    this.context.imageSmoothingEnabled = false;
    
    $(() => { 
      this.drawingService.modelObservable.subscribe(result => {
        if(result) {
          this.model = result;      
          this.draw();
        }
      });
    })
    
  }

  draw() {
    this.context.clearRect(0,0,this.screenWidth,this.screenHeight);
    var prevLamp: Lamp = null;
    this.model.lampList.forEach((lamp: Lamp) => {
      if (prevLamp) {
        this.drawLine(this.context, prevLamp.posX, prevLamp.posY, lamp.posX, lamp.posY);
      }
      prevLamp = lamp;
    }) 
    this.model.lampList.forEach((lamp: Lamp) => {
      this.drawRing(this.context, lamp.posX, lamp.posY, 10, lamp.power*lamp.enabled);
    })  
    this.model.objects.forEach((object: MovingObject) => {
      if(object.direction == Direction.Up || object.direction == Direction.Down) {
        this.drawRect(this.context, object.posX-5,object.posY-10,10,20,object.color);
      }
      if(object.direction == Direction.Left || object.direction == Direction.Right) {
        this.drawRect(this.context, object.posX-10,object.posY-5,20,10,object.color);
      }      
    });  
  }

  drawCircle(context: CanvasRenderingContext2D, posX: number, posY: number, radius: number, color: string = null) {
    context.beginPath();
    context.arc(posX, posY, radius, 0, 2 * Math.PI, false);
    context.closePath();
    if (color) {
      context.fillStyle = color;
      context.fill();
    }
    context.lineWidth = 1;
    context.strokeStyle = '#000000';
    context.stroke();
  }

  drawRect(context: CanvasRenderingContext2D, posX: number, posY: number, width: number, height: number, color: string = null) {
    if (color) {
      context.fillStyle = color;
      context.fillRect(posX, posY, width, height);
    }
    context.strokeRect(posX, posY, width, height);
  }

  drawRing(context: CanvasRenderingContext2D, posX: number, posY: number, radius: number, scale: number, innerColor: string = 'rgba(0,0,0,0.5)', outerColor: string = 'rgba(255,255,0,0.5)') {
    this.drawCircle(context, posX, posY, radius * 8 * scale, outerColor)
    this.drawCircle(context, posX, posY, radius, innerColor)
  }

  drawLine(context: CanvasRenderingContext2D, startX: number, startY: number, endX: number, endY: number) {
    context.beginPath();
    context.moveTo(startX, startY);
    context.lineWidth = 10;
    context.lineCap = "round";
    context.lineTo(endX, endY);
    context.stroke();
  }

}
