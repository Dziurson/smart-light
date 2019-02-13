import { Injectable } from '@angular/core';
import SmartCityModel from '../model/smart-city-model';
import Lamp from '../model/lamp';
import { PlaceType } from '../model/place-type';
import { DrawingService } from './drawing.service';

@Injectable({
  providedIn: 'root'
})
export class SetupService {

  completed: boolean = false
  predefinedModels: SmartCityModel[]
  selectedModel: SmartCityModel
  selectedModelNumber: number

  cursor: String = "default"

  constructor(private drawingService: DrawingService) { }

  setLamp() {
    this.cursor = "lamp";
  }

  addLamp(posX, posY) {
    this.selectedModel.lampList.push(new Lamp(1,posX,posY,PlaceType.NormalTraffic));
    this.drawingService.setLampList(this.selectedModel);
  }
}
