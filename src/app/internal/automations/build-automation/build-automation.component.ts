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

  saveDraft() {
    this.automationService.updateThenTasksList(null);
    this.automationService.updateWhenEvent(null);
    this.http.goBack();
  }
  ngOnDestroy() {
  }
}
