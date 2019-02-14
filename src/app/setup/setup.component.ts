import { Component, OnInit } from '@angular/core';
import { SetupService } from '../services/setup.service';
import { movingObjects } from '../modelData/moving-objects';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.css']
})
export class SetupComponent implements OnInit { 

  isLampPlacing: boolean = false;
  selectedLampType: number = 0;
  lampWattPower: number = 100;

  constructor(
    private setupService: SetupService) { }

  ngOnInit() {
    this.setupService.setupData();
  }

  saveChanges() {
    this.setupService.completed = true
    this.setupService.selectedModel.objects = movingObjects
  }

  getNextModel() {
    this.setupService.getNextModel();
  }

  getPreviousModel() {
    this.setupService.getPreviousModel();
  }  

  startPlacingLamp() {    
    this.isLampPlacing = true;
    this.setupService.startPlacingLamp(this.selectedLampType, this.lampWattPower);
  }

  finishPlacingLamp() {
    this.isLampPlacing = false;
    this.setupService.finishPlacingLamp();
  }

}
