import { Component, OnInit, ViewChild } from '@angular/core';
import { Calendar, EventInput } from '@fullcalendar/core';
import { FullCalendarComponent } from '@fullcalendar/angular';

import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import * as _ from 'lodash'
import Tooltip from 'tooltip.js'; 

@Component({
  selector: 'app-calender-view',
  templateUrl: './calender-view.component.html',
  styleUrls: ['./calender-view.component.css']
})
export class CalenderViewComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  @ViewChild('calendar', { static: false }) calendarComponent: FullCalendarComponent;

  calendarPlugins = [dayGridPlugin, timeGridPlugin, interactionPlugin];
  calendarWeekends = true;

  @ViewChild('calenderEl', { static: true })
  calenderEl: FullCalendarComponent;

  validRange: any = {};
  calendarEvents: EventInput[] = [
      { title: 'My event', start: new Date(), date: new Date() },
      { title: 'My event2', start: new Date(), date: new Date() },
      { title: 'My event3', start: new Date(), date: new Date() }
  ];

  dateRender($event: any) {
      console.log("dateRender....");
      console.log(this.calenderEl)
      console.log($event);
      $event.el.addEventListener('dblclick', () => {
          // alert('double click!');
          this.calendarEvents.push( { title: 'My event ' + (Math.random() * 10).toFixed(0), start: new Date(), date: new Date() })
          console.log(this.calendarEvents)
      });
  }

  onEventClick(clickedEvent: any) {
      console.log(clickedEvent);
  }

  onEventRender(info: any) {
      console.log('onEventRender', info.el);
      const tooltip = new Tooltip(info.el, {
          title: info.event.title,
          placement: 'top-end',
          trigger: 'hover',
          container: 'body'
      });
  }

  onEventDragStart(event) {
      console.log("start=>",event);
      
  }
  
  onEventDragStop(event) {
      console.log("stop=>",event);

  }
  handleDateClick(arg) {
    // this.calendarEvents = [
    //     { title: '.', start: new Date(arg.dateStr), date: new Date(arg.dateStr) }
    // ];
    console.log(arg);
  }
}
