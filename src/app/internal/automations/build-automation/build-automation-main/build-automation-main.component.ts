import { WhenThenEvent } from './../../models/automation';
import { AutomationService } from './../../automation.service';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { HttpService } from 'src/app/services/http.service';
import { EventType } from '../../automation-constants';
import { Observable } from 'rxjs';
import { THEN_INTERNAL_EVENTS } from '../../models/enum';
declare var $: any;

@Component({
  selector: 'app-build-automation-main',
  templateUrl: './build-automation-main.component.html',
  styleUrls: ['./build-automation-main.component.css']
})
export class BuildAutomationMainComponent implements OnInit {


  $eventSelected: Observable<EventType>;
  EventType = EventType;


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