import { Injectable } from '@angular/core';
import Lamp from '../model/lamp';
import { BehaviorSubject } from 'rxjs';
import { PlaceType } from '../model/place-type';
import SmartCityModel from '../model/smart-city-model';

@Injectable({
  providedIn: 'root'
})
export class DrawingService {

  modelObservable: BehaviorSubject<SmartCityModel>;
  model: SmartCityModel;

  constructor() { 
    this.modelObservable = new BehaviorSubject<SmartCityModel>(new SmartCityModel());
    this.modelObservable.next(this.model);
  }

  setLampList(model: SmartCityModel) {    
    this.model = model;
    this.modelObservable.next(this.model);
  }
}
