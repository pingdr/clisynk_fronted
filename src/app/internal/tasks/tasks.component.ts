import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {TableModel} from '../../shared/models/table.common.model';
import {HttpService} from '../../services/http.service';
import {Subscription} from 'rxjs';
import {ApiUrl} from '../../services/apiUrls';
import { CalendarOptions } from '@fullcalendar/angular'; 
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
@Component({
    selector: 'app-tasks',
    templateUrl: './tasks.component.html',
    styleUrls: ['./task.component.scss']
})

export class TasksComponent implements OnInit, OnDestroy {

    calendarPlugins = [dayGridPlugin, interactionPlugin];
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
        }, () => {
            this.myModel.loader = false;
        });
    }

}
