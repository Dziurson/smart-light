import { Component, OnInit } from '@angular/core';
import SmartLightModel from '../model/smart-light-model';
import Lamp from '../model/lamp';

@Component({
  selector: 'app-drawing',
  templateUrl: './drawing.component.html',
  styleUrls: ['./drawing.component.css']
})
export class DrawingComponent implements OnInit {

  smartLightModel: SmartLightModel;
  canvas: HTMLCanvasElement;
  screenWidth: number;
  screenHeight: number;
  context: CanvasRenderingContext2D;

  constructor() { 
    this.smartLightModel = new SmartLightModel();
  }  

  ngOnInit() {
    this.canvas = <HTMLCanvasElement>document.getElementById('stage');
    this.screenHeight = window.innerHeight * 0.8;
    this.screenWidth = window.innerWidth * 0.8;
    this.context = this.canvas.getContext('2d');
    this.context.imageSmoothingEnabled = false;
    
    this.smartLightModel.setTestLamps();   
  }

  draw() {
    this.context.clearRect(0,0,this.screenWidth,this.screenHeight);
    var prevLamp: any = null;
    this.smartLightModel.lampList.forEach((lamp: any) => {
      if (prevLamp) {
        this.drawLine(this.context, prevLamp.posX, prevLamp.posY, lamp.posX, lamp.posY);
      }
      prevLamp = lamp;
    })
    this.smartLightModel.lampList.forEach((lamp: any) => {
      this.drawRing(this.context, lamp.posX, lamp.posY, 20, lamp.power * 2);
    })    
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
    this.drawCircle(context, posX, posY, radius * scale, outerColor)
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
