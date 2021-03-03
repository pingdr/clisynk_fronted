import { MailTemplateData } from './../../../../../../../shared/models/mail-template.model';
import { PaginatedResponse } from './../../../../../../../models/paginated-response';
import { Component, OnInit } from '@angular/core';
import { AutomationService } from 'src/app/internal/automations/automation.service';
import { LoadingService } from 'src/app/internal/automations/loading.service';
import { HttpService } from 'src/app/services/http.service';
import { Sort } from '@angular/material/sort';
import { FormGroup } from '@angular/forms';
import { forkJoin, Subject } from 'rxjs';
import { EventType } from 'src/app/internal/automations/automation-constants';
import { finalize, map, tap } from 'rxjs/operators';
import { BackendResponse } from 'src/app/models/backend-response';
import { ApiUrl } from 'src/app/services/apiUrls';
import { AppointmentService } from 'src/app/internal/appointments/appointment.service';
import { Router } from '@angular/router';
import { Tag } from 'src/app/models/tag';
import { AddTagComponent } from 'src/app/shared/modals/add-tag/add-tag.component';
import { MailTemplateListData } from 'src/app/shared/models/mail-template-list.model';


@Component({
  selector: 'app-choose-template',
  templateUrl: './choose-template.component.html',
  styleUrls: ['./choose-template.component.css']
})
export class ChooseTemplateComponent implements OnInit {

  mailTemplatesList: MailTemplateListData[] = [];
  sortedData: MailTemplateListData[] = [];
  searchText = '';
  constructor(public http: HttpService,
    public automationService: AutomationService,
    public appoint: AppointmentService,
    public router: Router,
    public loadingService: LoadingService) { }

  async ngOnInit() {
    await this.loadData();
    console.log("tags loaded");
    // this.getAppointmentTypes();
  }

  async loadData() {
    this.sortedData.splice(0, this.sortedData.length);
    this.loadingService.loadingOn()
    const data = await forkJoin([this.getEmailTemplates()])
      .pipe(finalize(() => this.loadingService.loadingOff())).toPromise();
    console.log(data)
  }

  getEmailTemplates() {
    return this.http.getMailTemplates()
      .pipe(
        map((res: BackendResponse<MailTemplateListData[]>) => res.data),
        tap((x: MailTemplateListData[]) => {
          this.mailTemplatesList = x;
          this.sortedData = x;
        })
      );

  }

  onSelectMailTemplate(mailTemplate: MailTemplateListData) {
    console.log(mailTemplate);
    this.automationService.currentEmailTemplateEdited = mailTemplate;
    this.automationService.updateEventType(EventType.THEN_EDIT_SEND_EMAIL_SELECT);
    
    // const whenEvent: FormGroup = this.automationService.getWhenEvent();
    // whenEvent.patchValue({
    //   eventData: {
    //     dataId: mailTemplate._id,
    //     params: { name: mailTemplate.name }
    //   }
    // })
    // this.automationService.updateWhenEvent(whenEvent);
    // this.automationService.updateEventType(EventType.WHEN);
  }

  startWithBlankMail() {
    this.automationService.updateEventType(EventType.THEN_EDIT_SEND_EMAIL_SELECT);
  }

  sortData(sort: Sort) {
    const data = this.mailTemplatesList.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name': return this.compare(a.name.toLowerCase(), b.name.toLowerCase(), isAsc);
        case 'link': return this.compare(a.name.toLowerCase(), b.name.toLowerCase(), isAsc);
        // case 'addedOn': return this.compare(format(new Date(a.createdAt), 't'), format(new Date(b.createdAt), 't'), isAsc);
        // case 'status': return this.compare(a.status, b.status, isAsc);
        default: return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}
