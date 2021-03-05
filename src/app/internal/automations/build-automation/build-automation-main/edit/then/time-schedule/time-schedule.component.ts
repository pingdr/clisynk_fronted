import { filter } from 'rxjs/operators';
import { DelayedOptions } from './../../../../../models/automation';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AutomationService } from 'src/app/internal/automations/automation.service';
import { Component, OnInit, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox/typings/checkbox';
import * as _ from 'lodash';
import * as moment from 'moment';
import {  TimepickerComponent } from "ngx-bootstrap/timepicker";

@Component({
  selector: 'app-time-schedule',
  templateUrl: './time-schedule.component.html',
  styleUrls: ['./time-schedule.component.css']
})
export class TimeScheduleComponent implements OnInit {

  form: FormGroup;
  
  WAIT_TYPES = {
    WAIT : 'wait',
    WAIT_UNTIL : 'waitUntil'
  }

  TIME_TYPES = {
    atTime: 'atTime',
    betweenTime: 'betweenTime'
  }

  atTime = new Date();
  startTime = new Date();
  endTime = new Date();
  
  get f() { return this.form.controls; }
  get isSpecificTime() { return !this.automationService.isNullOrEmpty(this.form.get('delayedOptions.timeInterval.intervalType').value);}
  get isDelayed()  { return this.form.get('isDelayed');}
  
  get delayedOptions()  { return this.form.get('delayedOptions');}
  get delayType() { return this.form.get('delayedOptions.delayType');}

  get dayInterval() { return this.form.get('delayedOptions.dayInterval');}
  get dayIntervalType() { return this.form.get('delayedOptions.dayInterval.intervalType');}
  get dayIntervalValue() { return this.form.get('delayedOptions.dayInterval.value');}

  get timeInterval() { return this.form.get('delayedOptions.timeInterval');}
  get timeIntervalType() { return this.form.get('delayedOptions.timeInterval.intervalType');}
  get timeIntervalValue() { return this.form.get('delayedOptions.timeInterval.value');}

  constructor(public automationService: AutomationService,
    private renderer: Renderer2
    ) { }

  ngOnInit() {
    this.form = <FormGroup>_.cloneDeep(this.automationService.getThenTaskByIndex())
    console.log(this.form.value);
    this.conditionalFormChanges();
  }

  conditionalFormChanges() {
    this.delayType.valueChanges.subscribe(res => {
     
        this.dayInterval.reset({
          intervalType: '',
          value: '',
        });
        this.timeInterval.reset({
          intervalType: '',
          value: [],
        })
    });
    

    this.isDelayed.valueChanges.subscribe(isDelayed => {
      if(isDelayed == false) {
        this.delayedOptions.reset({
          delayType: '',
          dayInterval: {
            intervalType: '',
            value: '',
          },
          timeInterval: {
            intervalType: '',
            value: [],
          }
        })
      } else {
        this.delayType.reset(this.WAIT_TYPES.WAIT);
      }
    })


    this.form.valueChanges.pipe(filter(()=> this.form.valid)).subscribe(res => {
      console.log(res)
      this.automationService.updateThenTask(this.form);
    })

    this.dayIntervalValue.valueChanges
    .pipe( filter( (val) => this.delayType.value == this.WAIT_TYPES.WAIT_UNTIL && !this.automationService.isNullOrEmpty(val)))
    .subscribe(val => {
        this.timeInterval.reset({
          intervalType: this.TIME_TYPES.atTime,
          value: [],
        })
    })
    
    
  }

  
  atTimeChange(time: TimepickerComponent) {
    let betWeenTime = [];
    betWeenTime[0] = `${time.hours}:${time.minutes} ${time.meridian}`;
    betWeenTime[1] = ``;
    this.timeIntervalValue.setValue(betWeenTime);
    console.log(this.timeIntervalValue.value);
  }

  betWeenTime = [];
  betweenTimeChange(time: TimepickerComponent, type) {
    if (type == 'start') {
      this.betWeenTime[0] =`${time.hours}:${time.minutes} ${time.meridian}`;
    }else if (type == 'end') {
      this.betWeenTime[1] =`${time.hours}:${time.minutes} ${time.meridian}`;
    }
    this.timeIntervalValue.setValue(this.betWeenTime);
    console.log(this.timeIntervalValue.value);

  }


}
