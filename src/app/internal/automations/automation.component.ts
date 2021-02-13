import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { SubmitfeedbackComponent } from 'src/app/shared/modals/submitfeedback/submitfeedback.component';
import { RenameAutomationComponent } from 'src/app/shared/modals/rename-automation/rename-automation.component';
import { DeleteAutomationComponent } from 'src/app/shared/modals/delete-automation/delete-automation.component';

@Component({
  selector: 'app-automation',
  templateUrl: './automation.component.html',
  styleUrls: ['./automation.component.css']
})
export class AutomationComponent implements OnInit {

  rightdefault = false;

  constructor(public http:HttpService) { }

  ngOnInit() {
  }
  openSubmitfeedback() {
    this.http.showModal(SubmitfeedbackComponent);
  }

  openRenameautomation() {
    this.http.showModal(RenameAutomationComponent, 'sm custom-class-rename-automation');
  }

  openDeleteautomation() {
    this.http.showModal(DeleteAutomationComponent, 'xs');
  }

  Previewautomation(){
    this.rightdefault = true;
  }

  Closepreview(){
    this.rightdefault = false;
  }
  

}
