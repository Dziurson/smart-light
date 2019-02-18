import { Component, OnInit } from '@angular/core';
import Lamp from '../model/lamp';
import { DrawingService } from '../services/drawing.service';
import * as $ from 'jquery';
import SmartCityModel from '../model/smart-city-model';
import MovingObject from '../model/moving-object';
import { Direction } from '../model/direction';
import Road from '../model/road';
import { SetupService } from '../services/setup.service';
import { lamps } from '../modelData/lamps';
import { PlaceType } from '../model/place-type';

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
  mousex: number;
  mousey: number;

  constructor(
    private drawingService: DrawingService,
    private setupService: SetupService ) {
  }

  ngOnInit() {
    this.canvas = <HTMLCanvasElement>document.getElementById('stage');
    this.screenHeight = 800;
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
      this.canvas.addEventListener("mousemove", (e) => {
        if(!this.setupService.completed) {
          var rect = this.canvas.getBoundingClientRect(), scaleX = this.canvas.width / rect.width, scaleY = this.canvas.height / rect.height;
          this.mousex = (e.clientX - rect.left) * scaleX;
          this.mousey = (e.clientY - rect.top) * scaleY;
          this.draw();
        }
      })

      this.canvas.addEventListener("mouseup", () => {
        if(this.setupService.cursor === "lamp")
          this.setupService.addLamp(this.mousex,this.mousey);
      })
    })

  }

  drawBackground() {
    switch (+this.model.place) {
      case PlaceType.NormalTraffic:
        this.context.fillStyle = "LightGrey";
        break;
      case PlaceType.HighTraffic:
        this.context.fillStyle = "Beige";
        break;
      case PlaceType.Parks:
        this.context.fillStyle = "LightGreen";
        break;
      default:
        this.context.fillStyle = "White";
        break;
    }

    this.context.fillRect(0, 0, this.screenWidth, this.screenHeight);
  }

  draw() {
    // this.context.clearRect(0, 0, this.screenWidth, this.screenHeight);
    this.drawBackground();




    if (this.model) {
      this.model.roads.forEach((road: Road) => {
        this.drawLine(this.context, road.startX, road.startY, road.endX, road.endY);
      })
      this.model.objects.forEach((object: MovingObject) => {
        if (object.direction == Direction.Up || object.direction == Direction.Down) {
          this.drawRect(this.context, object.posX - 5, object.posY - 10, 10, 20, object.color);
        }
        if (object.direction == Direction.Left || object.direction == Direction.Right) {
          this.drawRect(this.context, object.posX - 10, object.posY - 5, 20, 10, object.color);
        }
      });
      this.model.lampList.forEach((lamp: Lamp) => {
        this.drawRing(this.context, lamp.posX, lamp.posY, 10, lamp.conditionalPower * lamp.enabled);
      })
    }
    if(!this.setupService.completed) {      
      if(this.setupService.cursor === "lamp")
        this.drawRing(this.context, this.mousex - 5, this.mousey - 5, 10, this.setupService.selectedLamp.conditionalPower);
    }
  }

  drawCircle(context: CanvasRenderingContext2D, posX: number, posY: number, radius: number, color: string = null) {
    context.beginPath();
    context.arc(posX, posY, radius, 0, 2 * Math.PI, false);
    context.closePath();
    if (color) {
      context.fillStyle = color;
      context.fill();
    }
    context.lineWidth = 0;
  }

  drawRect(context: CanvasRenderingContext2D, posX: number, posY: number, width: number, height: number, color: string = null) {
    if (color) {
      context.fillStyle = color;
      context.fillRect(posX, posY, width, height);
    }
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
    context.strokeStyle = "#AAAAAA";
    context.lineTo(endX, endY);
    context.stroke();
  }
}
