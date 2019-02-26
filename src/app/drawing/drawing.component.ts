import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { Direction } from '../model/direction';
import Lamp from '../model/lamp';
import MovingObject from '../model/moving-object';
import { PlaceType } from '../model/place-type';
import Road from '../model/road';
import SmartCityModel from '../model/smart-city-model';
import { DrawingService } from '../services/drawing.service';
import { SetupService } from '../services/setup.service';

@Component({
  selector: 'app-drawing',
  templateUrl: './drawing.component.html',
  styleUrls: ['./drawing.component.css']
})
export class DrawingComponent implements OnInit {

  /**
   * Interfejs zapewniający dostęp do własności i metod pozwalających na manipulację wyglądem i prezentacją elementu canvas
   */
  private canvas: HTMLCanvasElement;
  /**
   * Szerokość elementu
   */
  private screenWidth: number;
  /**
   * Wysokość elementu
   */
  private screenHeight: number;
  /**
   * Interfejs dostarczający kontekst renderowania 2D. Służy do rysowania elementów symulacji
   */
  private context: CanvasRenderingContext2D;
  /**
   * Model przechowujący dane symulacji dla rysowanego stanu.
   */
  private model: SmartCityModel;
  /**
   * Pozycja myszy x
   */
  private mousex: number;
  /**
   * Pozycja myszy y
   */
  private mousey: number;

  /**
   * W konstruktorze wykorzystujemy mechanizm dependency injection i wstrzykujemy instancje serwisów odpowiedzialnych
   * za ustawienia mapy(SetupService) oraz rysowanie mapy(DrawingService).
   * Jako aktualny model symulacji przyjmujemy ten przechowywany w SetupService.
   */
  constructor(
    private drawingService: DrawingService,
    private setupService: SetupService) {
  }

  /**
   * Metoda inicjalizuje atrybuty komponentu domyślnymi wartościami i uruchamia rysowanie po załadowaniu zawartości.
   */
  ngOnInit() {
    this.canvas = <HTMLCanvasElement>document.getElementById('stage');
    this.screenHeight = 800;
    this.screenWidth = 1280;
    this.context = this.canvas.getContext('2d');
    this.context.imageSmoothingEnabled = false;

    $(() => {
      this.drawingService.modelObservable.subscribe(result => {
        if (!result)
          return;

        this.model = result;
        this.draw();
      });

      this.setupMouseEvents();
    })

  }

  /**
   * Metoda obsługuje zdarzenia myszy na elemencie canvas.
   */
  private setupMouseEvents() {

    this.canvas.addEventListener("mousemove", (e: MouseEvent) => {
      if (this.setupService.completed)
        return;
      this.drawCursor(e);
    });

    this.canvas.addEventListener("mouseup", () => {
      if (this.setupService.cursor === "lamp")
        this.setupService.addLamp(this.mousex, this.mousey);
    });

    this.canvas.addEventListener("mousedown", () => {
      if (!(this.setupService.cursor === "road"))
        return;

      if (!(this.setupService.roadStartX && this.setupService.roadStartY)) {
        this.setupService.roadStartX = this.mousex;
        this.setupService.roadStartY = this.mousey;
        return;
      }
      if (Math.abs(this.setupService.roadStartX - this.mousex) > Math.abs(this.setupService.roadStartY - this.mousey))
        this.setupService.addRoad(this.setupService.roadStartX, this.setupService.roadStartY, this.mousex, this.setupService.roadStartY);
      else
        this.setupService.addRoad(this.setupService.roadStartX, this.setupService.roadStartY, this.setupService.roadStartX, this.mousey);
      this.setupService.roadStartX = null;
      this.setupService.roadStartY = null;
    });
  }

  /**
   * Metoda rysuje na elemencie canvas obiekt myszy.
   * @param e Obiekt typu MouseEvent.
   */
  private drawCursor(e: MouseEvent) {
    var rect = this.canvas.getBoundingClientRect(), scaleX = this.canvas.width / rect.width, scaleY = this.canvas.height / rect.height;
    this.mousex = (e.clientX - rect.left) * scaleX;
    this.mousey = (e.clientY - rect.top) * scaleY;
    this.draw();
  }

  /**
   * Metoda rysuje odpowiednie tło dla symulacji.
   * Głownym celem jest zamazanie poprzedniej klatki z elementów pozostałych z porzpedniej iteracji systemu.
   */
  private drawBackground() {
    switch (+this.model.place) {
      case PlaceType.NormalTraffic:
        this.context.fillStyle = "LightGrey";
        break;
      case PlaceType.HighTraffic:
        this.context.fillStyle = "Beige";
        break;
      case PlaceType.Parks:
        this.context.fillStyle = "LightGreen";
        break;
      default:
        this.context.fillStyle = "White";
        break;
    }

    this.context.fillRect(0, 0, this.screenWidth, this.screenHeight);
  }

  /**
   * Metoda rysująca odpowiednią "klatkę" w zależności od aktualnego modelu symulacji.
   * Główna metoda rysująca, wywołuje metody odpowiedzialne za rysowanie poszczególnych elementów symulacji.
   */
  private draw() {
    // this.context.clearRect(0, 0, this.screenWidth, this.screenHeight);
    this.drawBackground();

    if (this.model) {
      this.drawRoads();
      this.drawMovingObjects();
      this.drawLamps();
    }

    if (this.setupService.completed)
      return;

    this.drawMouseObjects();
  }

  /**
   * Metoda rysuje odpowiednie elementy planszy. Wykorzystywana jest w trakcie procesu konfiguracji mapy dla symulacji.
   */
  private drawMouseObjects() {
    if (this.setupService.cursor === "lamp")
      this.drawRing(this.context, this.mousex - 5, this.mousey - 5, 10, this.setupService.selectedLamp.conditionalPower);

    if (this.setupService.cursor === "road") {
      this.drawCircle(this.context, this.mousex - 2, this.mousey - 2, 4, '#000000');
      if (this.setupService.roadStartX && this.setupService.roadStartY) {
        if (Math.abs(this.setupService.roadStartX - this.mousex) > Math.abs(this.setupService.roadStartY - this.mousey))
          this.drawLine(this.context, this.setupService.roadStartX, this.setupService.roadStartY, this.mousex, this.setupService.roadStartY);
        else
          this.drawLine(this.context, this.setupService.roadStartX, this.setupService.roadStartY, this.setupService.roadStartX, this.mousey);
      }
    }
  }

  /**
   * Metoda rysuje dynamiczne elementy symulacji (w domyśle pojazdy, pieszych, rowerzystów, zwierzęta).
   * Aktualna wersja rysuje tylko poojazdy.
   */
  private drawMovingObjects() {
    this.model.objects.forEach((object: MovingObject) => {
      if (object.direction == Direction.Up || object.direction == Direction.Down) {
        this.drawRect(this.context, object.posX - 5, object.posY - 10, 10, 20, object.color);
      }
      if (object.direction == Direction.Left || object.direction == Direction.Right) {
        this.drawRect(this.context, object.posX - 10, object.posY - 5, 20, 10, object.color);
      }
    });
  }

  /**
   * Metoda rysuje ścieżki po których poruszają się dynamiczne obiekty.
   */
  private drawRoads() {
    this.model.roads.forEach((road: Road) => this.drawLine(this.context, road.startX, road.startY, road.endX, road.endY));
  }

  /**
   * Metoda rysuje lampy na mapie symulacji.
   */
  private drawLamps() {
    this.model.lampList.forEach((lamp: Lamp) => this.drawRing(this.context, lamp.posX, lamp.posY, 10, lamp.conditionalPower * lamp.enabled));
  }

  /**
   * Metoda pomocnicza, używana przy rysowaniu lamp.
   * @param context kontekst renderowania
   * @param posX pozycja X
   * @param posY pozycja Y
   * @param radius promień obiektu
   * @param color kolor obiektu
   */
  private drawCircle(context: CanvasRenderingContext2D, posX: number, posY: number, radius: number, color: string = null) {
    context.beginPath();
    context.arc(posX, posY, radius, 0, 2 * Math.PI, false);
    context.closePath();
    if (color) {
      context.fillStyle = color;
      context.fill();
    }
    context.lineWidth = 0;
  }

  /**
   * Metoda pomocnicza, używana przy rysowaniu obiektów dynamicznych.
   * @param context kontekst renderowania
   * @param posX pozycja X
   * @param posY pozycja Y
   * @param width szerokość obiektu
   * @param height wysokość obiektu
   * @param color kolor obiektu
   */
  private drawRect(context: CanvasRenderingContext2D, posX: number, posY: number, width: number, height: number, color: string = null) {
    if (color) {
      context.fillStyle = color;
      context.fillRect(posX, posY, width, height);
    }
  }

  /**
   * Metoda pomocnicza, używana przy rysowaniu lamp.
   * @param context kontekst renderowania
   * @param posX pozycja X
   * @param posY pozycja Y
   * @param radius promień obiektu
   * @param scale współczynnik skali
   * @param innerColor kolor wewnętrznego koła
   * @param outerColor kolor zewnętrznego koła
   */
  private drawRing(context: CanvasRenderingContext2D, posX: number, posY: number, radius: number, scale: number, innerColor: string = 'rgba(0,0,0,0.5)', outerColor: string = 'rgba(255,255,0,0.5)') {
    this.drawCircle(context, posX, posY, radius * 8 * scale, outerColor)
    this.drawCircle(context, posX, posY, radius, innerColor)
  }

  /**
   * Metoda pomocnicza, używana przy rysowaniu ścieżek do poruszania się obiektów.
   * @param context kontekst renderowania
   * @param startX pozycja X początku
   * @param startY pozycja Y początku
   * @param endX pozycja X końca
   * @param endY pozycja Y końca
   */
  private drawLine(context: CanvasRenderingContext2D, startX: number, startY: number, endX: number, endY: number) {
    context.beginPath();
    context.moveTo(startX, startY);
    context.lineWidth = 10;
    context.lineCap = "round";
    context.strokeStyle = "#AAAAAA";
    context.lineTo(endX, endY);
    context.stroke();
  }
}
