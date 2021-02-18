import { Injectable } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AutomationService {

  private thenTasksSubject = new BehaviorSubject<FormArray>(new FormArray([]));
  public thenTasks = this.thenTasksSubject.asObservable();

  private whenEventSubject = new BehaviorSubject<FormGroup>(null);
  public whenEvent = this.whenEventSubject.asObservable();

  constructor() { }

  
  updateThenTasksList(thenTasks) {
    this.thenTasksSubject.next(thenTasks);
  }
  
  addToThenTasksList(thenTask: FormGroup) {
    this.thenTasksSubject.getValue().push(thenTask);
  }

  removeThenTasksFromList(index: number) {
    this.thenTasksSubject.getValue().removeAt(index);
  }


  updateWhenEvent(whenTask) {
    this.whenEventSubject.next(whenTask);
  }
}
