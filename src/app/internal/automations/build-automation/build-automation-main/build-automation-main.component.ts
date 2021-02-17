import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { HttpService } from 'src/app/services/http.service';
import { EventType } from '../../automation-constants';
declare var $: any;

enum WHEN_SHOW_OPTION {
  ON_DELETE_SHOW = 'ON_DELETE',
  ON_ADDED_SHOW = 'ON_ADDED'
}
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
  whenForm: FormGroup = this.createCardObj();
  thenForm: any;
  thenTasks: FormArray; 
  thenSwitchSuggestionOption: string = 'ADD';
  whenSwitchSuggestionOption: string = WHEN_SHOW_OPTION.ON_DELETE_SHOW;
  WHEN_SHOW_OPTION = WHEN_SHOW_OPTION;


  constructor(public http: HttpService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.handleAnimation();
    this.thenForm = new FormGroup({
      tasks: new FormArray([])
    });
  }


  createCardObj(): FormGroup {
    return this.formBuilder.group({
      eventName: '',
      eventType: '',
      name: '',
      description: '',
      price: ''
    });
  }

  addThenTask(selectedOption?): void {
    if(selectedOption) {
      this.thenSwitchSuggestionOption = "ADD";
    }
    this.thenTasks = this.thenForm.get('tasks') as FormArray;
    let group = this.createCardObj();
    // TODO: Need to make it more efficient
    group.controls.eventType.setValue(EventType.THEN) ;
    group.controls.eventName.setValue(selectedOption);
    this.thenTasks.push(group);
    console.log(this.thenTasks);
  }

   
  addWhenTask(selectedOption) {
    this.whenForm.controls.eventType.setValue(EventType.WHEN) ;
    this.whenForm.controls.eventName.setValue(selectedOption);
    this.whenSwitchSuggestionOption = WHEN_SHOW_OPTION.ON_ADDED_SHOW;
  }

  handleDeleteTask(index: number) {   
    this.thenTasks.removeAt(index);
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