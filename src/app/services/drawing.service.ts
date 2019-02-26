import { Injectable } from '@angular/core';
import Lamp from '../model/lamp';
import { BehaviorSubject } from 'rxjs';
import { PlaceType } from '../model/place-type';
import SmartCityModel from '../model/smart-city-model';

@Injectable({
  providedIn: 'root'
})
/**
 *  Serwis odpowiedzialny za przygotowanie modelu do renderowania.
 */
export class DrawingService {

  /**
   * obiekt typu obserwable dla modelu
   */
  modelObservable: BehaviorSubject<SmartCityModel>;
  /**
   * Instancja modelu
   */
  model: SmartCityModel;

  /**
   * Konstruktor tworzy obiekt observable i emituje informację o zmianie stanu do obserwatorów.
   */
  constructor() {
    this.modelObservable = new BehaviorSubject<SmartCityModel>(new SmartCityModel());
    this.modelObservable.next(this.model);
  }

  /**
   * Metoda służy do zmiany aktualnie przechowywanego modelu symulacji.
   * @param model nowy model symulacji
   */
  setLampList(model: SmartCityModel) {
    this.model = model;
    this.modelObservable.next(this.model);
  }
}
