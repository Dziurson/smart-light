import { Component, OnInit } from '@angular/core';
import { DrawingService } from '../services/drawing.service';
import MovingObject from '../model/moving-object';
import { MovingObjectType } from '../model/moving-object-type';
import SmartCityModel from '../model/smart-city-model';
import SimulationState from '../model/simulation-state';
import Chart from 'chart.js';
import { SetupService } from '../services/setup.service';

@Component({
  selector: 'app-simulation',
  templateUrl: './simulation.component.html',
  styleUrls: ['./simulation.component.css']
})

/**
 * Komponent obsługujący proces symulacji, zawiera model, historię i ustawienia symulacji.
 * Komunikuje się z widokiem odpowiedzialnym za rysowanie planszy poprzez DrawingService.
 */
export class SimulationComponent implements OnInit {
  /**
   * Numer aktualnej iteracji systemu
   */
  iteration = 0;
  /**
   * Liczba wszystkich iteracji
   */
  iterations = 3600;
  /**
   * Odstep czasowy między iteracjami systemu (a raczej interwał uruchamiania kolejnych iteracji)
   */
  timeInterval = 20;
  /**
   * Model symulacji dla aktualnej iteracji systemu
   */
  model: SmartCityModel;
  /**
   * Atrybut przechowujący informację o tym, czy symulacja jest w stanie RUN czy nie
   */
  simulationRun = false;
  /**
   * Atrybut przechowujący informację o tym, czy uruchomienie symulacji wykonane jest po raz pierwszy
   * Wykorzystane dla ustawień możliwych do konfiguracji tylko przed pierwszym uruchomieniem
   */
  firstStart = true;
  /**
   * Timestamp informujący o czasie pierwszego uruchomienia symulacji (w sekundach)
   */
  firstStartTime: number;
  /**
   * Lista przechowująca historię symulacji. Jeden element listy równy jest jednej iteracji systemu
   * TODO: przerobić mechanizm histori, nie jest to najoptymalniejsze rozwiązanie, ale za to najszybsze :D
   */
  simulationHistory: SimulationState[] = [];
  /**
   * Timestamp informujący o czasie uruchomienia aktualnie trwającej symulacji (w sekundach)
   */
  startTime: number;
  /**
   * Timestamp informujący o czasie zakończenia aktualnie trwającej symulacji (w sekundach)
   */
  endTime: number;
  /**
   * Licznik pojazdów w symulacji
   */
  carCounter: number;
  /**
   * Pomocniczy atrybut przechowujący timestamp aktualnie wybranej iteracji symulacji (używany w mechanizmie danych historycznych)
   */
  selectedTimestamp = 0;
  /**
   * Krok symulacji, w rzeczywistości nie zaimplementowano niczego sensownego korzystającego z tego atrybutu
   */
  simulationTimeStep = 1;
  /**
   * Zużycie prądu w aktualnym kroku symulacji w przypadku nie korzystania z systemu (stałe w czasie zużycie energii przez lampy)
   */
  stepWattNormalPower: number;
  /**
   * Zużycie prądu w aktualnym kroku symulacji w przypadku korzystania z systemu (zmienne w czasie zużycie energii przez lampy)
   */
  stepWattPower: number;
  /**
   * Cena prądu (w hurcie :D)
   */
  kwhPrice = 0.39975;

  /**
   * W konstruktorze wykorzystujemy mechanizm dependency injection i wstrzykujemy instancje serwisów odpowiedzialnych
   * za ustawienia mapy(SetupService) oraz rysowanie mapy(DrawingService).
   * Jako aktualny model symulacji przyjmujemy ten przechowywany w SetupService.
   */
  constructor(
    private drawingService: DrawingService,
    private setupService: SetupService) {
    this.model = this.setupService.selectedModel;
  }

  /**
   * Metoda inicjalizuje atrybuty komponentu domyslnymi wartościami:
   * czas rozpoczęcia (aktualny czas), zakończenia(+1h) oraz licznik pojazdów.
   */
  ngOnInit() {
    // this.runSimulation(1000);
    this.startTime = (Date.now() / 1000);
    this.endTime = this.startTime + 3600;
    this.carCounter = this.model.objects.length;
    this.setupChart();
  }

  /**
   * Metoda odpowiedzialna za inicjalizację komponentu wykresu i przypisanie mu odpowiedniego modelu danych.
   */
  private setupChart() {
    const canvas = <HTMLCanvasElement>document.getElementById('chart');
    const context = canvas.getContext('2d');
    context.imageSmoothingEnabled = false;
    const chart = new Chart(context, {
      'type': 'line', 'data': {
        'labels': [],
        'datasets': [{ 'label': 'Zaoszczędzona energia [%]', 'data': [],
         'fill': false, 'borderColor': 'rgb(75, 192, 192)', 'lineTension': 0.1 }]
      }, 'options': {}
    });
    setInterval(() => {
      if (this.model && this.simulationRun) {
        if (chart.data.labels.length > 50) {
          chart.data.labels.shift();
          chart.data.datasets[0].data.shift();
        }
        chart.data.labels.push('');
        chart.data.datasets[0].data.push(100 - this.model.totalEnergyUsage / this.model.totalEnergyNormalUsage * 100);
        chart.update();
      }
    }, 1000);
  }

  /**
   * Metoda rozpoczynająca proces symulacji, uruchamia główną pętlę symulacji.
   * @param start_time czas rozpoczęcia symulacji w formacie HH:MM:SS (np. 22:45:17)
   * @param end_time czas zakończenia symulacji w formacie HH:MM:SS (np. 23:45:17)
   */
  runSimulation(start_time: string, end_time: string) {
    this.calculateSimulationTime(start_time, end_time);

    if (this.firstStart) {
      this.firstStartTime = this.startTime;
      this.firstStart = false;
      this.model.priceBuffor = this.model.savedMoney;
      this.model.savedMoney = 0;
    } else {
      this.model = this.simulationHistory[this.simulationHistory.length - 1].state;
      this.startTime = this.simulationHistory[this.simulationHistory.length - 1].timestamp;
    }

    let i = this.iterations;

    this.simulationRun = true;

    const simulation = setInterval(() => {
      if (i === 0) {
        this.firstStart = true;
      }
      if ((i === 0) || !this.simulationRun) {
        this.simulationRun = false;
        clearInterval(simulation);
      }
      this.handleSystemIteration();
      this.iteration++;
      this.startTime += this.simulationTimeStep;
      i--;
      this.saveSimmulationState(this.startTime);
      this.drawingService.setLampList(this.model);
    }, this.timeInterval);
  }

  /**
   * Metoda obliczająca czas symulacji na podstawie czasów wejściowych.
   * Obliczony czas jest zwracany jako ilość iteracji do wykonania (this.iterations)
   * TODO: trzeba sprawdzić mechanizm działania w przypadku gdy czas zakończenia jest
   * po czasie rozpoczęcia nastepnego dnia (np. 00:30:00).
   * @param start_time czas rozpoczęcia symulacji w formacie HH:MM:SS (np. 22:45:17)
   * @param end_time czas zakończenia symulacji w formacie HH:MM:SS (np. 23:45:17)
   */
  calculateSimulationTime(start_time: string, end_time: string) {
    this.startTime = this.parseStartTime(start_time);
    this.endTime = this.parseStartTime(end_time);
    if (this.endTime < this.startTime) {
      this.iterations = this.endTime + 60 * 60 * 24;
    } else {
      this.iterations = Math.abs(this.endTime - this.startTime);
    }
  }

  /**
   * Metoda parsuje podaną godzinę i konwertuje ją na timestamp zapisany w sekundach.
   * @param start_time czas rozpoczęcia symulacji w formacie HH:MM:SS (np. 22:45:17)
   * @returns Przekonwertowana godzina przedstawiona jako timestamp (w sekundach)
   */
  parseStartTime(start_time: string): number {
    const today = new Date();
    const time_t = start_time.trim().split(':');
    const hour = Number(time_t[0]);
    const minutes = Number(time_t[1]);
    const seconds = Number(time_t[2]);

    return new Date(today.getFullYear(), today.getMonth(), today.getDate(), hour, minutes, seconds).getTime() / 1000;
  }

  /**
   * Metoda zapisuje stan symulacji do historii.
   * @param timestamp timestamp zapisywanej iteracji
   */
  saveSimmulationState(timestamp: number) {
    const record = new SimulationState();
    record.timestamp = timestamp;
    record.state = this.model.clone();
    this.simulationHistory.push(record);
    this.selectedTimestamp = this.simulationHistory.length;
  }

  /**
   * Metoda wstrzymuje wykonywanie symulacji.
   */
  stopSimulation() {
    this.simulationRun = false;
  }

  /**
   * Metoda oblicza zużycie energii zarówno dla wariantu z wykorzystaniem
   * systemu inteligentnego oświetlenia, jak i bez niego. Model obliczeniowy jest dość prymitywny, tutaj można się wykazać ;-).
   */
  calculatePowerUsage() {
    this.model.lampList.forEach((item) => {
      this.stepWattNormalPower = ((item.wattPower) / (1000 * 3600)) * this.simulationTimeStep;
      this.stepWattPower = ((item.conditionalPower * item.wattPower) / (1000 * 3600)) * this.simulationTimeStep;
      this.model.totalEnergyNormalUsage += this.stepWattNormalPower;
      this.model.totalEnergyUsage += this.stepWattPower;
    });
  }

  /**
   * Metoda przelicza zużycie energii i oblicza oszczędności (lub ich brak).
   */
  calculateSavedMoney() {
    this.model.savedMoney = ((this.model.totalEnergyNormalUsage - this.model.totalEnergyUsage) * this.kwhPrice) + this.model.priceBuffor;
  }

  /**
   * Metoda przetwarza jedną iterację systemu. Sprawdza kolizje, wywołuje metody aktualizacji modelu i zasobów.
   */
  handleSystemIteration() {
    this.model.objects.filter(o => o.type == MovingObjectType.Car).forEach((object: MovingObject) => {
      const junction = this.model.junctions.find(j =>
        ((j.posX + j.size > object.posX && j.posX - j.size < object.posX)
        && (j.posY + j.size > object.posY && j.posY - j.size < object.posY)));

      if (junction) {
        junction.setDirection(object);
      }
      object.move();
    });
    this.model.lampList.forEach((item) => {
      item.updatePowerFromSensor(this.model.objects);
      this.calculatePowerUsage();
    });
    this.calculateSavedMoney();
  }

  /**
   * Metoda dodaje pojazd do symulacji(aktualizuje stan modelu).
   */
  addCar() {
    const speed = Math.floor((Math.random() * 12) + 1);
    // tslint:disable-next-line:max-line-length
    const car = new MovingObject(this.carCounter, 1100, 150, speed, MovingObjectType.Car, '#' + ((1 << 24) * Math.random() | 0).toString(16));
    this.model.objects.push(car);
    this.carCounter++;
  }

  /**
   * Metoda usuwa pojazd z symulacji(aktualizuje stan modelu).
   */
  removeCar() {
    this.model.objects.pop();
    this.carCounter--;
  }

  /**
   * Metoda ładuje do komponentu historyczny model symulacji (aktualnie, pozwala tylko na śledzenie stanu symulacji,
   * jednak mechanizm ma duży potencjał rozwojowy.
   */
  loadHistoryState() {
    this.model = this.simulationHistory[this.selectedTimestamp].state;
    this.startTime = this.simulationHistory[this.selectedTimestamp].timestamp;
    this.drawingService.setLampList(this.model);
  }
}

