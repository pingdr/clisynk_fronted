import { LoadingService } from 'src/app/internal/automations/loading.service';
import { Automation } from 'src/app/internal/automations/models/automation';
import { HttpService } from 'src/app/services/http.service';
import { EventType } from './automation-constants';
import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { User } from 'src/app/models/user';
import { ApiUrl } from 'src/app/services/apiUrls';

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


  private reloadAutomationsListSubject = new Subject<boolean>();
  public reloadAutomationsList$ = this.reloadAutomationsListSubject.asObservable();

  constructor(public http: HttpService, public loadingService: LoadingService,private fb: FormBuilder) { }

  
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

  // Resest 
  resetState() {
    this.updateThenTasksList(null);
    this.updateWhenEvent(null);
    this.updateEventType(EventType.WHEN);
  }

  isNullOrEmpty(value) {
    if(value == undefined || value == '' || value == null){
      return true;
    }else {
      return false;
    }
  }

  reloadAutomationsList(reload: boolean) {
    this.reloadAutomationsListSubject.next(reload);
  }

  async saveAutomationDraft() {

    const obj = this.getAutomationObj();

    this.loadingService.loadingOn();
    return this.http.postAutomation(ApiUrl.ADD_AUTOMATION, obj)
    .pipe(finalize(() => { this.loadingService.loadingOff(); }))
  }

  getAutomationObj() {
    const user: User = JSON.parse(localStorage.getItem("loginData"));
    const whenEvent = this.whenEventSubject.getValue();
    const thenTasks = this.thenTasksSubject.getValue();

    const obj: Automation = {
      automationName: 'My Automation',
      whenEvent: whenEvent ? whenEvent.value : this.createWhenEventObj().value,
      thenEvents: thenTasks ? thenTasks.value : [],
      workspaceId: user.activeWorkspaceId,
      addedBy: user._id
    };
    return obj;
  }
  
  createWhenEventObj(): FormGroup {
    return this.fb.group({
      eventName: [''],
      eventDescription: [''],
      eventData: this.fb.group({
        dataId: [''],
        params: [{}]
      })
    });
  }

  createThenEventObj(): FormGroup {
    return this.fb.group({
      eventName: '',
      eventDescription: '',
      eventData: this.fb.group({
        dataId: [''],
        params: [{}],
      }),
      isDelayed: [''],
      delayedOptions: this.fb.group({
        delayType: [''],
        dayInterval: this.fb.group({
          intervalType: [''],
          value: [''],
        }),
        timeInterval: this.fb.group({
          intervalType: [''],
          value: [''],
        }),

      }),
    });
  }
}
