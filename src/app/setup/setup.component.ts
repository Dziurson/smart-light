import { Component, OnInit } from '@angular/core';
import { SetupService } from '../services/setup.service';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.css']
})
export class SetupComponent implements OnInit {

  constructor(private setupService: SetupService) { }

  ngOnInit() {
  }

  saveChanges() {
    this.setupService.completed = true
  }

}
