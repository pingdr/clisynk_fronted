import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { SubmitfeedbackComponent } from 'src/app/shared/modals/submitfeedback/submitfeedback.component';
import { RenameAutomationComponent } from 'src/app/shared/modals/rename-automation/rename-automation.component';
import { DeleteAutomationComponent } from 'src/app/shared/modals/delete-automation/delete-automation.component';
import { AutomationParams } from './models/params';
import { Automation } from './models/automation';
import { BackendResponse } from './models/backend-response';

@Component({
  selector: 'app-automation',
  templateUrl: './automation.component.html',
  styleUrls: ['./automation.component.css']
})
export class AutomationComponent implements OnInit {

  private get listAutomationsUrl() { return "automation/get-automations" }
  automationParams = new AutomationParams();

  rightdefault = false;

  constructor(public http:HttpService) { 
    this.automationParams.workspaceId = '6002783fded689592434f04a';
    this.http.getData(this.listAutomationsUrl, this.automationParams).subscribe((res: BackendResponse<Automation[]>) => {
      console.log(res.data);
    });
  }

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
