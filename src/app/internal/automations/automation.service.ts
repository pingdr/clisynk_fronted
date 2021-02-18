import { Injectable } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AutomationService {

  private thenTasksSubject = new BehaviorSubject<FormArray>(null);
  public thenTasks = this.thenTasksSubject.asObservable();

  private whenEventSubject = new BehaviorSubject<FormGroup>(null);
  public whenEvent = this.whenEventSubject.asObservable();

  constructor() { }

  
  updateThenTasksList(thenTasks) {
    this.thenTasksSubject.next(thenTasks);
  }

  updateWhenEvent(whenTask) {
    this.whenEventSubject.next(whenTask);
  }
}
