import { Injectable } from '@angular/core';
import { FormArray } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AutomationService {

  private thenTasksSubject = new BehaviorSubject<FormArray>(null);
  public thenTasks = this.thenTasksSubject.asObservable();
  constructor() { }

  
  updateTasksList(thenTasks) {
    this.thenTasksSubject.next(thenTasks);
  }
}
