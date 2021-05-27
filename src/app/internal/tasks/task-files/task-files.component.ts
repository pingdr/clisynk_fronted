import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { Task } from 'src/app/models/task';

@Component({
  selector: 'task-files',
  templateUrl: './task-files.component.html',
  styleUrls: ['./task-files.component.css']
})
export class TaskFilesComponent implements OnInit {

  @Input() tasks: Task[] = [];
  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
    console.log(changes);
    if ('tasks' in changes) {
        if (this.tasks) {
           console.log("task-files==>", this.tasks)
        }
    }

}

}
