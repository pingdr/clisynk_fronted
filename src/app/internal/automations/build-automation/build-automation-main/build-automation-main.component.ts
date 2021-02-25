import { WhenThenEvent } from './../../models/automation';
import { AutomationService } from './../../automation.service';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { HttpService } from 'src/app/services/http.service';
import { AutomationEvents, EventType } from '../../automation-constants';
import { Observable } from 'rxjs';
declare var $: any;

enum THEN_INTERNAL_EVENTS {
  on_then_event_selected = 'SHOW_ADD_THEN_EVENT_BTN',
  on_add_then_event_clicked = 'SHOW_SUGGESIONS'
}


@Component({
  selector: 'app-build-automation-main',
  templateUrl: './build-automation-main.component.html',
  styleUrls: ['./build-automation-main.component.css']
})
export class BuildAutomationMainComponent implements OnInit {


  $eventSelected: Observable<EventType>;
  // eventSelected = EventType.WHEN;
  EventType = EventType;

  whenForm: FormGroup = undefined;
  thenForm: any;
  // thenTasks: FormArray; 
  $thenTasks: Observable<FormArray>;
  $whenEvent: Observable<FormGroup>;
  
  thenInternalEvents: string = THEN_INTERNAL_EVENTS.on_then_event_selected;
  THEN_INTERNAL_EVENTS = THEN_INTERNAL_EVENTS;

  constructor(public http: HttpService,
    public automationService: AutomationService,
    public changeDetection: ChangeDetectorRef,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.handleAnimation();
    this.$thenTasks = this.automationService.thenTasks;
    this.$whenEvent = this.automationService.whenEvent;
    this.$eventSelected = this.automationService.eventSelected;

    this.$whenEvent.subscribe(res => {
      if (res) {
        this.whenForm = res;
      }
    })

    this.thenForm = new FormGroup({
      tasks: new FormArray([])
    });
  }


  addThenTask(selectedOption?: WhenThenEvent): void {
    if(selectedOption) {
      this.thenInternalEvents = THEN_INTERNAL_EVENTS.on_then_event_selected;
    }
    // TODO: Need to make it more efficient
    let group = this.createCardObj();
    group.controls.eventName.setValue(selectedOption.eventName);
    group.controls.eventDescription.setValue(selectedOption.eventDescription);
    this.automationService.addToThenTasksList(group);
  }

  handleDeleteTask(index: number) {
    if(index || index == 0) {
      this.automationService.removeThenTasksFromList(index);
    }  else {
      this.whenForm.reset();
      this.whenForm = undefined;
      this.automationService.updateWhenEvent(null);
    }
  }
  

  createCardObj(): FormGroup {
    return this.formBuilder.group({
      eventName: '',
      eventDescription: '',
      name: '',
      description: '',
      price: ''
    });
  }

  handleAnimation() {
    $(document).ready(function () {
      $(".scroll-class").click(function () {
        $('html,body').animate({                                                          //  fine in moz, still quicker in chrome. 
          scrollTop: $(".all-option-available").offset().top
        },
          'slow');
      });
    });
  }
}