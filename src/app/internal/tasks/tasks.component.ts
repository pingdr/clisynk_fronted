// import { CalendarOptions } from '@fullcalendar/angular';
import { Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import {FormControl} from '@angular/forms';
import {TableModel} from '../../shared/models/table.common.model';
import {HttpService} from '../../services/http.service';
import {Subscription} from 'rxjs';
import {ApiUrl} from '../../services/apiUrls';


import { Calendar } from '@fullcalendar/core';
import {FullCalendarComponent} from '@fullcalendar/angular';

import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { AddTaskComponent } from 'src/app/shared/modals/add-task/add-task.component';
import * as _ from 'lodash'
// import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
@Component({
    selector: 'app-tasks', 
    templateUrl: './tasks.component.html',
    styleUrls: ['./task.component.scss']
})

export class TasksComponent implements OnInit, OnDestroy {


    @ViewChild('calendar', {static: false}) calendarComponent: FullCalendarComponent;

    calendarPlugins = [dayGridPlugin,timeGridPlugin, interactionPlugin];
    timeLinePlugins = [timeGridPlugin, interactionPlugin];

    // @ViewChild('calenderEl', { static: true}) 
    // calenderEl: ElementRef;


    // calendar
    // calenderOptions: CalendarOptions = {

    // }

    validRange: any = {};
    calendarEvents = [
        {title: '', date: new Date()}
    ];
    myModel: any;
    search = new FormControl();
    subscription: Subscription;

    constructor(public http: HttpService) {
        this.myModel = new TableModel();
        this.myModel.loader = true;
        this.subscription = this.http.eventStatus.subscribe(data => {
            if (data && data.eventType === 'addTask') {
                this.taskList();
            }
        });
        const name = Calendar.name; // add this line in your constructor
        // this.calendar = new Calendar(this.calenderEl.nativeElement, {
        //     plugins: [ timeGridPlugin ],
        //     initialView: 'timeGridWeek'
        // });
    }

    ngOnInit() {
        this.taskList();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
    handleDateClick(arg) {
        this.calendarEvents = [
            {title: '.', date: new Date(arg.dateStr)}
        ];
      console.log(arg);
    }

    tasks: any[] = [];
    taskList() {
        const obj: any = {
            skip: 0,
            limit: 100
        };
        if (this.myModel.status === 2) {
            obj.status = this.myModel.status;
        }
        this.myModel.allData = [];
        this.myModel.loader = true;
        this.http.getData(ApiUrl.TASK_LIST, obj).subscribe(res => {
            this.myModel.allData = res.data.data;
            this.myModel.count = res.data.count;
            this.myModel.loader = false;

            let t:[] = res.data.data.map(x => x.data);
            
            console.log(t);
            res.data.data.map(x => x.data).forEach(x => this.tasks.push(...x))
            // this.tasks =  [...];
            console.log(this.tasks);
            this.tasks.forEach(x => {
                if (x.startDateTime) {
                    x.startDateTime = new Date(x.startDateTime);
                }
                if (x.dueDateTime) {
                    x.dueDateTime = new Date(x.dueDateTime);
                }
            })
        }, () => {
            this.myModel.loader = false;
        });
    }

    openEditTask(data) {
        this.http.showModal(AddTaskComponent, 'md', data);
    }

}
