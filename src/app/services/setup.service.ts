import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SetupService {

  completed: boolean = false
  
  constructor() { }
}
