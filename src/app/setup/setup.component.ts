import { Component, OnInit } from '@angular/core';
import { SetupService } from '../services/setup.service';
import SmartCityModel from '../model/smart-city-model';
import { smartCitytModels } from '../modelData/predefined-models';
import { DrawingService } from '../services/drawing.service';
import { movingObjects } from '../modelData/moving-objects'
import Lamp from '../model/lamp';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.css']
})
export class SetupComponent implements OnInit { 

  constructor(
    private setupService: SetupService,
    private drawingService: DrawingService) { }

  ngOnInit() {
    this.setupService.predefinedModels = smartCitytModels.map(m => m.clone());
    if(this.setupService.predefinedModels) {
      this.setupService.selectedModelNumber = 0;
      this.setupService.selectedModel = this.setupService.predefinedModels[0];
      this.drawingService.setLampList(this.setupService.selectedModel);
    }
  }

  saveChanges() {
    this.setupService.completed = true
    this.setupService.selectedModel.objects = movingObjects
  }

  getNextModel() {
    this.setupService.selectedModelNumber++
    this.setupService.selectedModel = this.setupService.predefinedModels[this.setupService.selectedModelNumber]
    this.drawingService.setLampList(this.setupService.selectedModel);
  }

  getPreviousModel() {
    this.setupService.selectedModelNumber--
    this.setupService.selectedModel = this.setupService.predefinedModels[this.setupService.selectedModelNumber]
    this.drawingService.setLampList(this.setupService.selectedModel);
  }

  setLamp() {
    this.setupService.setLamp();
  }

}
