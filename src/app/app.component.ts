import { Component } from '@angular/core';
import { SetupService } from './services/setup.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
/**
 * Główny komponent aplikacji, jest zbudowany z komponentów SetupComponent oraz SimulationComponent, w zależności od etapu symulacji
 */
export class AppComponent {
  /**
   * tytuł aplikacji
   */
  title = 'smart-light';

  /**
   * W konstruktorze wykorzystujemy mechanizm dependency injection i wstrzykujemy instancje serwisu odpowiedzialnego
   * za ustawienia mapy(SetupService).
   */
  constructor(private setupService: SetupService) {}
}
