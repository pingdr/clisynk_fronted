import { EventType } from './../automation-constants';
import { AutomationService } from './../automation.service';
import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-build-automation',
  templateUrl: './build-automation.component.html',
  styleUrls: ['./build-automation.component.css']
})
export class BuildAutomationComponent implements OnInit {

  constructor(public http: HttpService, public automationService: AutomationService) { }

  ngOnInit() {
  }

  async saveDraft() {
    
    (await this.automationService.saveAutomationDraft()).subscribe(res => {
      console.log('saved')
      this.automationService.reloadAutomationsList(true);
    });
    this.automationService.resetState();
    this.http.goBack();
  }
  ngOnDestroy() {
  }
}
