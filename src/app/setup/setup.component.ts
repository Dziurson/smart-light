import { Component, OnInit } from '@angular/core';
import { SetupService } from '../services/setup.service';
import SmartCityModel from '../model/smart-city-model';
import { smartCitytModels } from '../modelData/predefined-models';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.css']
})
export class SetupComponent implements OnInit {

  predefinedModels: SmartCityModel[]
  selectedModel: number

  constructor(private setupService: SetupService) { }

  ngOnInit() {
    this.predefinedModels = smartCitytModels;
    if(this.predefinedModels)
      this.selectedModel = 0;
  }

  saveChanges() {
    this.setupService.completed = true
  }

}
