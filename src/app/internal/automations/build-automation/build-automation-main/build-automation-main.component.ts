import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { HttpService } from 'src/app/services/http.service';
import { EventType } from '../../automation-constants';
declare var $: any;

enum WHEN_SHOW_OPTION {
  show_suggestions = 'SHOW_SUGGESTIONS',
  show_card = 'SHOW_CARD'
}
enum THEN_SHOW_OPTION {
  show_add_card = 'ADD_CARD_OPTION',
  show_suggestions = 'SHOW_SUGGESIONS'
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
  whenForm: FormGroup = undefined;
  thenForm: any;
  thenTasks: FormArray; 
  thenSwitchSuggestionOption: string = THEN_SHOW_OPTION.show_add_card;
  whenSwitchSuggestionOption: string = WHEN_SHOW_OPTION.show_suggestions;
  WHEN_SHOW_OPTION = WHEN_SHOW_OPTION;
  THEN_SHOW_OPTION = THEN_SHOW_OPTION;


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
      this.thenSwitchSuggestionOption = THEN_SHOW_OPTION.show_add_card;
    }
    this.thenTasks = this.thenForm.get('tasks') as FormArray;
    let group = this.createCardObj();
    // TODO: Need to make it more efficient
    group.controls.eventType.setValue(EventType.THEN);
    group.controls.eventName.setValue(selectedOption);
    this.thenTasks.push(group);
    console.log(this.thenTasks);
  }

   
  addWhenTask(selectedOption) {
    this.whenForm = this.createCardObj();
    this.whenForm.controls.eventType.setValue(EventType.WHEN) ;
    this.whenForm.controls.eventName.setValue(selectedOption);
    this.whenSwitchSuggestionOption = WHEN_SHOW_OPTION.show_card;
  }

  handleDeleteTask(index: number) {
    if(index || index == 0) {
      this.thenTasks.removeAt(index);
    }  else {
      this.whenForm.reset();
      this.whenForm = undefined;
      this.whenSwitchSuggestionOption = WHEN_SHOW_OPTION.show_suggestions;
    }
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