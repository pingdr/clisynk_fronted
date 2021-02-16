import { Component, OnInit } from '@angular/core';
import { AutomationURL } from '../../automation-routes';

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
  ngOnInit() {
  }

}
