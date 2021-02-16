import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { HttpService } from 'src/app/services/http.service';
import { EventType } from '../constants';
declare var $: any;

@Component({
  selector: 'app-build-automation-main',
  templateUrl: './build-automation-main.component.html',
  styleUrls: ['./build-automation-main.component.css']
})
export class BuildAutomationMainComponent implements OnInit {


  buttonName = 'Show more option';
  hide: any;
  EventType = EventType;
  eventSelected = EventType.WHEN;
  thenForm: any;
  tasks: FormArray;


  constructor(public http: HttpService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.handleAnimation();
    this.thenForm = new FormGroup({
      tasks: new FormArray([])
    });
  }


  createThenTask(): FormGroup {
    return this.formBuilder.group({
      eventName: '',
      eventType: '',
      name: '',
      description: '',
      price: ''
    });
  }

  addThenTask(): void {
    this.tasks = this.thenForm.get('tasks') as FormArray;
    this.tasks.push(this.createThenTask());
    console.log(this.tasks);
  }

  handleAnimation() {
    $(document).ready(function () {
      $(".scroll-class").click(function () {
        $('html,body').animate({                                                          //  fine in moz, still quicker in chrome. 
          scrollTop: $(".all-option-available").offset().top
        },
          'slow');
      });
    });
  }
}