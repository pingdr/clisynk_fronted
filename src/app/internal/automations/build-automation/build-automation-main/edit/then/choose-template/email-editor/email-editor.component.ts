import { BackendResponse } from './../../../../../../../../models/backend-response';
import { HttpService } from 'src/app/services/http.service';
import { MailTemplateListData } from './../../../../../../../../shared/models/mail-template-list.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AutomationService } from 'src/app/internal/automations/automation.service';
import { EditorContent } from 'src/app/shared/models/editor.model';
import { map } from 'rxjs/operators';
import { MailTemplateData } from 'src/app/shared/models/mail-template.model';

@Component({
  selector: 'app-email-editor',
  templateUrl: './email-editor.component.html',
  styleUrls: ['./email-editor.component.css']
})
export class EmailEditorComponent implements OnInit, OnDestroy {

  ckeConfig: any = EditorContent;
  currentEmailTemplateListEdited: MailTemplateListData
  emailTemplate: MailTemplateData;
  constructor(private automationService: AutomationService, private http: HttpService) { }


  ngOnInit() {
    this.currentEmailTemplateListEdited = this.automationService.currentEmailTemplateEdited;
    if (!this.automationService.isNullOrEmpty(this.currentEmailTemplateListEdited)) {
      this.loadData();
    }
  }


  loadData() {
    this.http.getMailTemplateById(this.currentEmailTemplateListEdited._id)
      .pipe(
        map((res: BackendResponse<MailTemplateData>) => res.data)
      ).subscribe((emailTemplate)=>{
        this.emailTemplate = emailTemplate;
        console.log(this.emailTemplate);
      })
  }

  ngOnDestroy(): void {
    console.log('editor destroyed');
    this.automationService.currentEmailTemplateEdited = null;
  }
}
