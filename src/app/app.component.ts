import { Component } from '@angular/core';
import { SetupService } from './services/setup.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'smart-light';
  
  constructor(private setupService: SetupService) {}
}
