import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { EventType } from '../../../automation-constants';
import { AutomationURL } from '../../../automation-routes';

@Component({
  selector: 'app-automation-preview',
  templateUrl: './automation-preview.component.html',
  styleUrls: ['./automation-preview.component.css']
})
export class AutomationPreviewComponent implements OnInit {

  constructor() { }
  AutomationURL = AutomationURL
  isWhenAdded = false;
  isThenAdded = true;

  eventSelected = EventType.WHEN;
  EventType = EventType;
  
  @Output()
  onEventChange = new EventEmitter<any>();

  ngOnInit() {
  }

}
