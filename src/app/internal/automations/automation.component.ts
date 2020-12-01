import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { SubmitfeedbackComponent } from 'src/app/shared/modals/submitfeedback/submitfeedback.component';

@Component({
  selector: 'app-automation',
  templateUrl: './automation.component.html',
  styleUrls: ['./automation.component.css']
})
export class AutomationComponent implements OnInit {

  constructor(public http:HttpService) { }

  ngOnInit() {
  }
  openSubmitfeedback() {
    this.http.showModal(SubmitfeedbackComponent);
  }

}
