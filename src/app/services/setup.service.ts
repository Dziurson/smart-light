import { Injectable } from '@angular/core';
import SmartCityModel from '../model/smart-city-model';
import Lamp from '../model/lamp';
import { PlaceType } from '../model/place-type';
import { DrawingService } from './drawing.service';
import { smartCitytModels } from '../modelData/predefined-models';
import { saveAs } from 'file-saver';
import Road from '../model/road';

@Injectable({
  providedIn: 'root'
})
export class SetupService {

  completed: boolean = false
  predefinedModels: SmartCityModel[]
  selectedModel: SmartCityModel
  selectedModelNumber: number
  selectedLamp: Lamp
  
  roadStartX: number = null;
  roadStartY: number = null;

  cursor: String = "default"

  constructor(private drawingService: DrawingService) { }

  addLamp(posX, posY) {
    var lamp = this.selectedLamp.clone();
    lamp.setPosition(posX, posY);
    this.selectedModel.lampList.push(lamp);
    this.drawingService.setLampList(this.selectedModel);
  }

  addRoad(startx, starty, endx, endy) {
    this.selectedModel.roads.push(new Road(startx,starty,endx,endy));
  }

  setupData() {
    this.predefinedModels = smartCitytModels.map(m => m.clone());
    if (this.predefinedModels) {
      this.selectedModelNumber = 0;
      this.selectedModel = this.predefinedModels[0];
      this.drawingService.setLampList(this.selectedModel);
    }
  }

  getNextModel() {
    this.selectedModelNumber++
    this.selectedModel = this.predefinedModels[this.selectedModelNumber]
    this.drawingService.setLampList(this.selectedModel);
  }

  getPreviousModel() {
    this.selectedModelNumber--
    this.selectedModel = this.predefinedModels[this.selectedModelNumber]
    this.drawingService.setLampList(this.selectedModel);
  }

  startPlacingLamp(selectedLampTypeId: number, wattPower: number) {
    this.cursor = "lamp"
    this.selectedLamp = new Lamp(0, 0, 0, this.getPlaceType(selectedLampTypeId));
    this.selectedLamp.wattPower = wattPower;
  }

  finishPlacingLamp() {
    this.cursor = "default"
  }

  startDrawingRoads() {
    this.cursor = "road"    
  }

  finishDrawingRoads() {
    this.cursor = "default"
  }

  setScenario(id) {
    this.selectedModel.place = this.getPlaceById(id);
    this.drawingService.setLampList(this.selectedModel);
  }

  saveModel() {
    const model = JSON.stringify({SmartCityModel: this.selectedModel});
    const t = new Blob([model], { type: 'text/json;charset=utf-8' });
    saveAs(t, 'model.txt');
  }

  loadModel(model) {
    var parsedJson = JSON.parse(model);
    if(!parsedJson.SmartCityModel)
      return;
    this.selectedModel = SmartCityModel.from(parsedJson.SmartCityModel);
    this.drawingService.setLampList(this.selectedModel);
  }

  getPlaceById(id): PlaceType {
    switch (id) {
      case '0': {
        return PlaceType.NormalTraffic;
      }
      case '1': {
        return PlaceType.HighTraffic;
      }
      case '2': {
        return PlaceType.DangerousPlaces;
      }
      case '3': {
        return PlaceType.Parks;
      }
      default: {
        return PlaceType.NormalTraffic;
      }
    }
  }

  getPlaceType(id): PlaceType {
    console.log(id);
    switch (id) {
      case '0': {
        return PlaceType.NormalTraffic;
      }
      case '1': {
        return PlaceType.HighTraffic;
      }
      case '2': {
        return PlaceType.DangerousPlaces;
      }
      default: {
        return PlaceType.NormalTraffic;
      }
    }
  }
}
