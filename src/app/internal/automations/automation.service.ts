import { EventType } from './automation-constants';
import { Injectable } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AutomationService {


  private eventSelectedSubject = new BehaviorSubject<EventType>(EventType.WHEN);
  public eventSelected = this.eventSelectedSubject.asObservable();

  private thenTasksSubject = new BehaviorSubject<FormArray>(new FormArray([]));
  public thenTasks = this.thenTasksSubject.asObservable();

  private whenEventSubject = new BehaviorSubject<FormGroup>(null);
  public whenEvent = this.whenEventSubject.asObservable();

  constructor() { }

  
  // Event Type
  updateEventType(event: EventType) {
    this.eventSelectedSubject.next(event);
  }

  // THEN Tasks List
  updateThenTasksList(thenTasks) {
    this.thenTasksSubject.next(thenTasks);
  }
  
  addToThenTasksList(thenTask: FormGroup) {
    if (this.isNullOrEmpty(this.thenTasksSubject.getValue())) {
        this.thenTasksSubject.next(new FormArray([]));
    }
    this.thenTasksSubject.getValue().push(thenTask);
  }

  removeThenTasksFromList(index: number) {
    this.thenTasksSubject.getValue().removeAt(index);
  }

  // WHEN Event
  updateWhenEvent(whenEvent: FormGroup) {
    this.whenEventSubject.next(whenEvent);
  }
  
  getWhenEvent() {
    return this.whenEventSubject.getValue();
  }

  isNullOrEmpty(value) {
    if(value == undefined || value == '' || value == null){
      return true;
    }else {
      return false;
    }
  }
}
