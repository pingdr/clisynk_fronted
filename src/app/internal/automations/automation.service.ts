import { MailTemplateListData } from './../../shared/models/mail-template-list.model';
import { LoadingService } from 'src/app/internal/automations/loading.service';
import { Automation, ThenEvent } from 'src/app/internal/automations/models/automation';
import { HttpService } from 'src/app/services/http.service';
import { EventType } from './automation-constants';
import { Injectable } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup } from '@angular/forms';
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

  private currentThenTaskSubject = new BehaviorSubject<FormGroup>(null);
  public currentThenTask = this.currentThenTaskSubject.asObservable();

  private whenEventSubject = new BehaviorSubject<FormGroup>(null);
  public whenEvent = this.whenEventSubject.asObservable();


  private reloadAutomationsListSubject = new Subject<boolean>();
  public reloadAutomationsList$ = this.reloadAutomationsListSubject.asObservable();

  constructor(public http: HttpService, public loadingService: LoadingService,private fb: FormBuilder) { }

  //#region EventType

  updateEventType(event: EventType) {
    this.eventSelectedSubject.next(event);
  }
  
  getCurrentEventType() {
    return this.eventSelectedSubject.getValue();
  }
  //#endregion 

  //#region WHEN-EVENT
  updateWhenEvent(whenEvent: FormGroup) {
    this.whenEventSubject.next(whenEvent);
  }
  
  getWhenEvent() {
    return this.whenEventSubject.getValue();
  }
  //#endregion

  //#region THEN-TASKS
  getThenTasksList() {
    return this.thenTasksSubject.getValue();
  }

  updateThenTasksList(thenTasks) {
    this.thenTasksSubject.next(thenTasks);
  }
  
  updateThenTask(thenTask: FormGroup| AbstractControl, index: number = this.currentThenTaskIndex) {
    this.thenTasksSubject.getValue().at(index).patchValue(thenTask);
  }
  
  addToThenTasksList(thenTask: FormGroup) {
    if (this.isNullOrEmpty(this.thenTasksSubject.getValue())) {
        this.thenTasksSubject.next(new FormArray([]));
    }
    this.thenTasksSubject.getValue().push(thenTask);
  }

  getThenTaskByIndex(index: number = this.currentThenTaskIndex): AbstractControl|FormGroup {
    if (!this.isNullOrEmpty(this.thenTasksSubject.getValue())) {
      return this.thenTasksSubject.getValue().at(index);
    } else {
      return null;
    }
  }

  removeThenTaskFromList(index: number) {
    this.thenTasksSubject.getValue().removeAt(index);
  }
  //#endregion

  //#region CURRENT-THEN-TASK

  private _currentThenTaskIndex: number = 0;
  set currentThenTaskIndex(index) {
    this._currentThenTaskIndex = index;
  }
  get currentThenTaskIndex() {
    return this._currentThenTaskIndex;
  }


  // getCurrentEditedThenTask(): FormGroup{
  //   // return this.currentThenTaskSubject.getValue();
  //   return this.currentThenTaskSubject.getValue();
  // }

  // getCurrentEditedThenTaskIndex(): number {
  //   return (this.currentThenTaskSubject.getValue().value as ThenEvent).eventData.params.thenTaskIndex;
  // }

  // setCurrentEditedThenTask(thenTask: FormGroup): void {
  //   this.currentThenTaskSubject.next(thenTask);
  // }

  // isThenTaskInEditMode(): boolean {
  //   return !!this.currentThenTaskSubject.getValue();
  // }

  //#endregion

  //#region Resest 

  resetCurrentThenTask() {
    this.currentThenTaskSubject.next(null);
  }

  resetState() {
    this.updateThenTasksList(null);
    this.updateWhenEvent(null);
    this.updateEventType(EventType.WHEN);
  }
  //#endregion

  //#region reloadData
  reloadAutomationsList(reload: boolean) {
    this.reloadAutomationsListSubject.next(reload);
  }
  //#endregion


  //#region Blank FormGroup
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
  //#endregion

  //#region API-Calls
  async saveAutomationDraft() {

    const obj = this.getAutomationObj();

    this.loadingService.loadingOn();
    return this.http.postAutomation(ApiUrl.ADD_AUTOMATION, obj)
    .pipe(finalize(() => { this.loadingService.loadingOff(); }))
  }
  //#endregion

  //#region Utils
  isNullOrEmpty(value) {
    if(value == undefined || value == '' || value == null){
      return true;
    }else {
      return false;
    }
  }
  //#endregion
}
