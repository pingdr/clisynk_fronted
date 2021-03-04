import { filter } from 'rxjs/operators';
import { DelayedOptions } from './../../../../../models/automation';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AutomationService } from 'src/app/internal/automations/automation.service';
import { Component, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox/typings/checkbox';
import * as _ from 'lodash';

@Component({
  selector: 'app-time-schedule',
  templateUrl: './time-schedule.component.html',
  styleUrls: ['./time-schedule.component.css']
})
export class TimeScheduleComponent implements OnInit {

  form: FormGroup;
  specifictTime: boolean = false;
  
  WAIT_TYPES = {
    WAIT : 'wait',
    WAIT_UNTIL : 'waitUntil'
  }

  get f() { return this.form.controls; }
  constructor(public automationService: AutomationService, private fb: FormBuilder) { }

  ngOnInit() {
    this.form = <FormGroup>_.cloneDeep(this.automationService.getThenTaskByIndex())
    console.log(this.form.value);
    this.conditionalFormChanges();
  }

  onSpecificTimeChange(e: MatCheckboxChange) {
    this.specifictTime = e.checked;
  }

  conditionalFormChanges() {
    const isDelayed = this.form.get('isDelayed');
    const delayedOptions = this.form.get('delayedOptions');
    const delayType = this.form.get('delayedOptions.delayType');
    const dayInterval = this.form.get('delayedOptions.dayInterval');
    const timeInterval = this.form.get('delayedOptions.timeInterval');

    // delayType.setValue(this.WAIT_TYPES.WAIT);
    delayType.valueChanges.subscribe(res => {
      dayInterval.reset({
        intervalType: '',
        value: '',
      });
    });

    isDelayed.valueChanges.subscribe(isDelayed => {
      this.specifictTime = false;
      if(isDelayed == false) {
        delayedOptions.reset({
          delayType: '',
          dayInterval: {
            intervalType: '',
            value: '',
          },
          timeInterval: {
            intervalType: '',
            value: '',
          }
        })
      }
    })


    this.form.valueChanges.pipe(filter(()=> this.form.valid)).subscribe(res => {
      console.log(res)
      this.automationService.updateThenTask(this.form);
    })
  }
}
