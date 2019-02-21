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
/**
 *  Serwis odpowiedzialny za przygotowanie i edycję modelu do symulacji 
 */
export class SetupService {

  /**
   *  Zmienna przedstawiająca czy edycja modelu została zakończona 
   */
  completed: boolean = false
  /**
   *  Tablica przedstawiająca listę predefiniowanych modeli 
   */
  predefinedModels: SmartCityModel[]
  /**
   *  Zmienna przechowująca aktualnie wybrany model 
   */
  selectedModel: SmartCityModel
  /**
   *  Zmienna przechowująca indeks aktualnie wybranego modelu 
   */
  selectedModelNumber: number
  /**
   *  Zmienna przechowująca szablon lampy, w celu ustawienia na mapie 
   */
  selectedLamp: Lamp

  /**
   *  Współrzędna X początku rysowania drogi 
   */
  roadStartX: number = null;
  /**
   *  Współrzędna Y początku rysowania drogi 
   */
  roadStartY: number = null;

  /** 
   * Rodzaj kursora: domyślny default, możliwe opcje road oraz lamp 
   */
  cursor: String = "default"

  constructor(private drawingService: DrawingService) { }

  /** 
   * Metoda odpowiedzialna za dodanie lampy do mapy 
   * @param {number} posX - Współrzędna X lampy.
   * @param {number} posY - Współrzędna Y lampy.
   */
  addLamp(posX: number, posY: number) {
    var lamp = this.selectedLamp.clone();
    lamp.setPosition(posX, posY);
    this.selectedModel.lampList.push(lamp);
    this.drawingService.setLampList(this.selectedModel);
  }

  /** 
   * Metoda odpowiedzialna za dodanie ulicy do mapy 
   * @param {number} startx - Współrzędna X początka drogi.
   * @param {number} starty - Współrzędna Y początka drogi.
   * @param {number} endx - Współrzędna X końca drogi.
   * @param {number} endy - Współrzędna Y końca drogi..
   */
  addRoad(startx: number, starty: number, endx: number, endy: number) {
    this.selectedModel.roads.push(new Road(startx, starty, endx, endy));
  }

  /** Metoda odpowiedzialna za załadowanie pierwszego predefiniowanego modelu */
  setupData() {
    this.predefinedModels = smartCitytModels.map(m => m.clone());
    if (this.predefinedModels) {
      this.selectedModelNumber = 0;
      this.selectedModel = this.predefinedModels[0];
      this.drawingService.setLampList(this.selectedModel);
    }
  }

  /** Metoda zwracająca następny model z listy predefiniowanych modeli */
  getNextModel() {
    this.selectedModelNumber++
    this.selectedModel = this.predefinedModels[this.selectedModelNumber]
    this.drawingService.setLampList(this.selectedModel);
  }

  /** Metoda zwracająca wcześniejszy model z listy predefiniowanych modeli */
  getPreviousModel() {
    this.selectedModelNumber--
    this.selectedModel = this.predefinedModels[this.selectedModelNumber]
    this.drawingService.setLampList(this.selectedModel);
  }

  /** Metoda rozpoczynająca proces wstawiania lamp na mapie 
   * @param {string} selectedLampTypeId - ID typu lampy ustalonego na podstawie PlaceType.
   * @param {number} wattPower - Moc lampy.
  */
  startPlacingLamp(selectedLampTypeId: string, wattPower: number) {
    this.cursor = "lamp"
    this.selectedLamp = new Lamp(0, 0, 0, this.getPlaceType(selectedLampTypeId));
    this.selectedLamp.wattPower = wattPower;
  }

  /** Metoda kończąca proces wstawiania lamp na mapie */
  finishPlacingLamp() {
    this.cursor = "default"
  }

  /** Metoda rozpoczynająca proces wstawiania ulic na mapie */
  startDrawingRoads() {
    this.cursor = "road"
  }

  /** Metoda kończąca proces wstawiania ulic na mapie */
  finishDrawingRoads() {
    this.cursor = "default"
  }

  /** Metoda zmieniająca rodzaj scenariusza symulacji 
   * @param {number} id - ID scenariusza.
  */
  setScenario(id: string) {
    this.selectedModel.place = this.getPlaceById(id);
    this.drawingService.setLampList(this.selectedModel);
  }

  /** Metoda pozwalająca na zapis modelu do pliku */
  saveModel() {
    const model = JSON.stringify({ SmartCityModel: this.selectedModel });
    const t = new Blob([model], { type: 'text/json;charset=utf-8' });
    saveAs(t, 'model.txt');
  }

  /** Metoda pozwalająca na odczyt modelu z pliku 
   * @param model - Obiekt JSON przechowujący model symulacji.
   */
  loadModel(model) {
    var parsedJson = JSON.parse(model);
    if (!parsedJson.SmartCityModel)
      return;
    this.selectedModel = SmartCityModel.from(parsedJson.SmartCityModel);
    this.drawingService.setLampList(this.selectedModel);
  }

  /** Metoda zwracająca typ miejsca na podstawie przekazanego ID 
   * @param {string} id - ID rodzaju miejsca.
   */
  getPlaceById(id: string): PlaceType {
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

  getPlaceType(id : string): PlaceType {
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
