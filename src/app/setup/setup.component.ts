import { Component, OnInit } from '@angular/core';
import { SetupService } from '../services/setup.service';
import { movingObjects } from '../modelData/moving-objects';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.css']
})
/* Komponent odpowiedzialny za przygotowanie i edycję modelu do symulacji */
export class SetupComponent implements OnInit {

  /* Flaga wskazująca na etap ustawiania lamp */
  isLampPlacing: boolean = false;
  /* Flaga wskazująca na etap ustawiania ulic */
  isRoadPlacing: boolean = false;
  /* Rodzaj wybranej lampy na podstawie enumeracji PlaceType */
  selectedLampType: number = 0;
  /* Moc lampy */
  lampWattPower: number = 100;
  /* Rodzaj scenariusza dla symulacji (tło) */
  selectedScenarioType: number = 0;

  constructor(
    private setupService: SetupService) { }

  ngOnInit() {
    this.setupService.setupData();
  }

  /* Metoda odpowiedziana za końcowy zapis modelu i przekazanie go do symulacji */
  saveChanges() {
    this.setupService.completed = true
    this.setupService.selectedModel.objects = movingObjects
  }

  /* Metoda zwracająca następny model z listy predefiniowanych modeli */
  getNextModel() {
    this.setupService.getNextModel();
  }

  /* Metoda zwracająca wcześniejszy model z listy predefiniowanych modeli */
  getPreviousModel() {
    this.setupService.getPreviousModel();
  }

  /* Metoda rozpoczynająca proces wstawiania lamp na mapie */
  startPlacingLamp() {
    this.isLampPlacing = true;
    this.setupService.startPlacingLamp(this.selectedLampType.toString(), this.lampWattPower);
  }

  /* Metoda kończąca proces wstawiania lamp na mapie */
  finishPlacingLamp() {
    this.isLampPlacing = false;
    this.setupService.finishPlacingLamp();
  }

  /* Metoda rozpoczynająca proces wstawiania ulic na mapie */
  startDrawingRoads() {
    this.isRoadPlacing = true;
    this.setupService.startDrawingRoads();
  }

  /* Metoda kończąca proces wstawiania ulic na mapie */
  finishDrawingRoads() {
    this.isRoadPlacing = false;
    this.setupService.finishDrawingRoads();
  }

  /* Metoda zmieniająca rodzaj scenariusza symulacji */
  updateScenario() {
    this.setupService.setScenario(this.selectedScenarioType.toString());
  }

  /* Metoda pozwalająca na zapis modelu do pliku */
  saveModel() {
    this.setupService.saveModel();
  }

  /* Metoda pozwalająca na odczyt modelu z pliku */
  loadModel(e) {    
    const file = e.srcElement.files[0];    
    const t = new Blob([file], { type: 'text/json;charset=utf-8' });
    const reader = new FileReader();
    reader.onload = () => {
        this.setupService.loadModel(reader.result);        
    };
    const text = reader.readAsText(file);    
  }

}
