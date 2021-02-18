import { AutomationService } from './../../automation.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { HttpService } from 'src/app/services/http.service';
import { AutomationEvents, EventType } from '../../automation-constants';
declare var $: any;

enum WHEN_INTERNAL_EVENTS {
  on_delete_card = 'SHOW_SUGGESTIONS',
  on_when_event_added = 'SHOW_WHEN_EVENT_CARD'
}
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


  eventSelected = EventType.WHEN;
  EventType = EventType;

  whenForm: FormGroup = undefined;
  thenForm: any;
  thenTasks: FormArray; 
  thenInternalEvents: string = THEN_INTERNAL_EVENTS.on_then_event_selected;
  whenInternalEvents: string = WHEN_INTERNAL_EVENTS.on_delete_card;
  WHEN_INTERNAL_EVENTS = WHEN_INTERNAL_EVENTS;
  THEN_INTERNAL_EVENTS = THEN_INTERNAL_EVENTS;

  constructor(public http: HttpService,
    private automationService: AutomationService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.handleAnimation();
    this.thenForm = new FormGroup({
      tasks: new FormArray([])
    });
  }


  createCardObj(): FormGroup {
    return this.formBuilder.group({
      eventName: '',
      eventType: '',
      name: '',
      description: '',
      price: ''
    });
  }

  addThenTask(selectedOption?): void {
    if(selectedOption) {
      this.thenInternalEvents = THEN_INTERNAL_EVENTS.on_then_event_selected;
    }
    this.thenTasks = this.thenForm.get('tasks') as FormArray;
    let group = this.createCardObj();
    // TODO: Need to make it more efficient
    group.controls.eventType.setValue(EventType.THEN);
    group.controls.eventName.setValue(selectedOption);
    this.thenTasks.push(group);
    this.automationService.updateTasksList(this.thenTasks);
    console.log(this.thenTasks);
  }

   
  addWhenTask(selectedOption) {
    this.whenForm = this.createCardObj();
    this.whenForm.controls.eventType.setValue(EventType.WHEN) ;
    this.whenForm.controls.eventName.setValue(selectedOption);
    this.whenInternalEvents = WHEN_INTERNAL_EVENTS.on_when_event_added;
  }

  handleDeleteTask(index: number) {
    if(index || index == 0) {
      this.thenTasks.removeAt(index);
    }  else {
      this.whenForm.reset();
      this.whenForm = undefined;
      this.whenInternalEvents = WHEN_INTERNAL_EVENTS.on_delete_card;
    }
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