import { Observable } from 'rxjs';
import { FormArray, FormGroup } from '@angular/forms';
import { AutomationService } from './../../../automation.service';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { EventType } from '../../../automation-constants';
import { AutomationURL } from '../../../automation-routes';

@Component({
  selector: 'app-automation-preview',
  templateUrl: './automation-preview.component.html',
  styleUrls: ['./automation-preview.component.css']
})
export class AutomationPreviewComponent implements OnInit {

  eventSelected = EventType.WHEN;
  EventType = EventType;
  $thenTasks: Observable<FormArray>;
  $whenEvent: Observable<FormGroup>;
  
  @Output()
  onEventChange = new EventEmitter<any>();

  constructor(private automationService: AutomationService) { }

  ngOnInit() {
    this.$thenTasks = this.automationService.thenTasks;
    this.$whenEvent = this.automationService.whenEvent;
  }

}
