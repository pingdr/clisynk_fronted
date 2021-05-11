// import { CalendarOptions } from '@fullcalendar/angular';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {TableModel} from '../../shared/models/table.common.model';
import {HttpService} from '../../services/http.service';
import {Subscription} from 'rxjs';
import {ApiUrl} from '../../services/apiUrls';
import { AddTaskComponent } from 'src/app/shared/modals/add-task/add-task.component';
import * as _ from 'lodash'
@Component({
    selector: 'app-tasks', 
    templateUrl: './tasks.component.html',
    styleUrls: ['./task.component.scss']
})

export class TasksComponent implements OnInit, OnDestroy {

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

    tasks: any[];
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
            let temp = []
            res.data.data.map(x => x.data).forEach(x => temp.push(...x))
            // this.tasks =  [...];
            console.log(this.tasks);
            temp.forEach(x => {
                if (x.startDateTime) {
                    x.startDateTime = new Date(x.startDateTime);
                }
                if (x.dueDateTime) {
                    x.dueDateTime = new Date(x.dueDateTime);
                }
            })
            this.tasks = temp;


        }, () => {
            this.myModel.loader = false;
        });
    }

    openEditTask(data) {
        this.http.showModal(AddTaskComponent, 'md', data);
    }

}
