import { EventType } from './../automation-constants';
import { AutomationService } from './../automation.service';
import { AutomationURL } from './../automation-routes';
import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-build-automation',
  templateUrl: './build-automation.component.html',
  styleUrls: ['./build-automation.component.css']
})
export class BuildAutomationComponent implements OnInit {

  isWhenAdded = true;
  isThenAdded = false;
  AutomationURL = AutomationURL

  constructor(public http: HttpService, public automationService: AutomationService) { }

  ngOnInit() {
  }

  async saveDraft() {
    (await this.automationService.saveAutomationDraft()).subscribe(res => {
      console.log('saved')
      this.automationService.reloadAutomations(true);
      this.automationService.updateThenTasksList(null);
      this.automationService.updateWhenEvent(null);
      this.automationService.updateEventType(EventType.WHEN);
    });
    this.http.goBack();
  }
  ngOnDestroy() {
  }
}
