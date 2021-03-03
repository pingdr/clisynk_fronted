import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-time-schedule',
  templateUrl: './time-schedule.component.html',
  styleUrls: ['./time-schedule.component.css']
})
export class TimeScheduleComponent implements OnInit {

  time=''
  constructor() { }

  ngOnInit() {
  }

  open() {
    this.time = '';
  }
}
