import { finalize } from 'rxjs/operators';
import { TaskStatus } from './../../models/enums';
import { Task } from 'src/app/models/task';
// import { CalendarOptions } from '@fullcalendar/angular';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {TableModel} from '../../shared/models/table.common.model';
import {HttpService} from '../../services/http.service';
import {Subject, Subscription} from 'rxjs';
import {ApiUrl} from '../../services/apiUrls';
import { AddTaskComponent } from 'src/app/shared/modals/add-task/add-task.component';
import * as _ from 'lodash'
import { NewEditTaskComponent } from '../../shared/modals/new-edit-task/new-edit-task.component';
import { DeleteComponent } from 'src/app/shared/modals/delete/delete.component';
@Component({
    selector: 'app-tasks', 
    templateUrl: './tasks.component.html',
    styleUrls: ['./task.component.scss']
})

export class TasksComponent implements OnInit, OnDestroy {

    myModel: any;
    search = new FormControl();
    subscription: Subscription;
    TaskStatus = TaskStatus;

    constructor(public http: HttpService) {
        this.myModel = new TableModel();
        this.myModel.loader = true;
        this.myModel.status = TaskStatus.ALL;
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

    tasks: Task[];
    taskList() {
        const obj: any = {
            skip: 0,
            limit: 100
        };
        if (this.myModel.status === TaskStatus.COMPLETED || this.myModel.status === TaskStatus.INCOMPLETE) {
            obj.status = this.myModel.status;
        }
        this.myModel.allData = [];
        this.myModel.loader = true;

        this.http.getData(ApiUrl.TASK_LIST, obj)
            .pipe(finalize(()=>{this.myModel.loader = false;}))
            .subscribe(res => {
                this.myModel.allData = res.data.data;
                this.myModel.count = res.data.count;
                this.tasks = res.data.data;

                /* Logic for making flat OLD 
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
                */

            });
    }

    changeStatus(status,task) {
        const obj = {
            status: status,
            taskId: task._id
        };
        this.http.getData(ApiUrl.UPDATE_TASK, obj).subscribe(() => {
            if (status === TaskStatus.COMPLETED) {
                this.http.openSnackBar('Task Completed Successfully');
            } else {
                this.http.openSnackBar('Task Deleted Successfully');
            }
            this.http.eventSubject.next({eventType: 'addTask'});
        });
    }

    deleteTask(task) {
        const obj: any = {
            type: 10,
            key: 'id',
            title: `Really delete?`,
            message: 'Do you really want to delete this task?',
        };

        const modalRef = this.http.showModal(DeleteComponent, 'xs', obj);
        modalRef.content.onClose = new Subject<boolean>();
        modalRef.content.onClose.subscribe(() => {
            // this.http.openSnackBar('Task has been deleted');
            this.changeStatus(4,task);
        });
    }

    openEditTask(data?) {
        this.http.showModal(AddTaskComponent, 'md', data);
    }
    
    openNewAddTask(data) {
        this.http.showModal(NewEditTaskComponent, 'md', data);

    }

}
