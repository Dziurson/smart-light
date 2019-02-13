import { Injectable } from '@angular/core';
import SmartCityModel from '../model/smart-city-model';

@Injectable({
  providedIn: 'root'
})
export class SetupService {

  completed: boolean = false
  selectedModel: SmartCityModel

  constructor() { }
}
