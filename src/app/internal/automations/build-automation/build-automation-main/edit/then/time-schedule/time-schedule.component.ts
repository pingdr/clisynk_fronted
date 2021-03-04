import { AutomationService } from 'src/app/internal/automations/automation.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-time-schedule',
  templateUrl: './time-schedule.component.html',
  styleUrls: ['./time-schedule.component.css']
})
export class TimeScheduleComponent implements OnInit {

  time=''
  constructor(public automationService: AutomationService) { }

  ngOnInit() {
    console.log(this.automationService.getThenTaskByIndex().value)
  }

  open() {
    this.time = '';
  }
}
