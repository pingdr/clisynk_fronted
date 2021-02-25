import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { EventType } from '../../../automation-constants';
import { AutomationService } from '../../../automation.service';

@Component({
  selector: 'app-automation-header',
  templateUrl: './automation-header.component.html',
  styleUrls: ['./automation-header.component.css']
})
export class AutomationHeaderComponent implements OnInit {

  $eventSelected: Observable<EventType>;
  EventType = EventType;

  constructor( public automationService: AutomationService) { }

  ngOnInit() {
    this.$eventSelected = this.automationService.eventSelected;
  }

}
