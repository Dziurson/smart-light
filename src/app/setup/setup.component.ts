import { Component, OnInit } from '@angular/core';
import { SetupService } from '../services/setup.service';
import SmartCityModel from '../model/smart-city-model';
import { smartCitytModels } from '../modelData/predefined-models';
import { DrawingService } from '../services/drawing.service';
import { movingObjects } from '../modelData/moving-objects'

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.css']
})
export class SetupComponent implements OnInit {

  predefinedModels: SmartCityModel[]
  selectedModel: SmartCityModel
  selectedModelNumber: number 

  constructor(
    private setupService: SetupService,
    private drawingService: DrawingService) { }

  ngOnInit() {
    this.predefinedModels = smartCitytModels;
    if(this.predefinedModels) {
      this.selectedModelNumber = 0;
      this.selectedModel = this.predefinedModels[0].clone();
      this.drawingService.setLampList(this.selectedModel);
    }
  }

  saveChanges() {
    this.setupService.completed = true
    this.selectedModel.objects = movingObjects
    this.setupService.selectedModel = this.selectedModel.clone();
  }

  getNextModel() {
    this.selectedModelNumber++
    this.selectedModel = this.predefinedModels[this.selectedModelNumber].clone()
    this.drawingService.setLampList(this.selectedModel);
  }

  getPreviousModel() {
    this.selectedModelNumber--
    this.selectedModel = this.predefinedModels[this.selectedModelNumber].clone()
    this.drawingService.setLampList(this.selectedModel);
  }

}
