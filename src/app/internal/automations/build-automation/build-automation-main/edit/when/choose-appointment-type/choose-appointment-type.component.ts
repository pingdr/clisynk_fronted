import { SmartForm } from 'src/app/models/smart-form';
import { Component, OnInit } from '@angular/core';
import { AutomationService } from 'src/app/internal/automations/automation.service';
import { LoadingService } from 'src/app/internal/automations/loading.service';
import { HttpService } from 'src/app/services/http.service';
import { Sort } from '@angular/material/sort';
import { format } from 'date-fns'
import { FormGroup } from '@angular/forms';
import { forkJoin, Subject } from 'rxjs';
import { EventType } from 'src/app/internal/automations/automation-constants';
import { FormType } from 'src/app/internal/automations/models/enum';
import { SmartFormCreateComponent } from 'src/app/shared/modals/smart-form-create/smart-form-create.component';
import { map, tap } from 'lodash';
import { finalize } from 'rxjs/operators';
import { BackendResponse } from 'src/app/internal/automations/models/backend-response';

@Component({
  selector: 'app-choose-appointment-type',
  templateUrl: './choose-appointment-type.component.html',
  styleUrls: ['./choose-appointment-type.component.css']
})
export class ChooseAppointmentTypeComponent implements OnInit {

  smartForms: SmartForm[];
  leadForm: SmartForm;
  sortedData: SmartForm[];
  searchText = '';
  constructor(public http: HttpService, 
    public automationService: AutomationService,
    public loadingService: LoadingService) { }

  async ngOnInit() {
    console.log("data loaded");

  }

  async loadData() {
    this.loadingService.loadingOn()
    const data = await forkJoin([this.getLeadForm(), this.getSmartFormList()])
      .pipe(finalize(() => this.loadingService.loadingOff())).toPromise();
    console.log(data)
  }

  getSmartFormList() {
    // return this.http.getSmartForm()
    //   .pipe(
    //     map((res: BackendResponse<SmartForm[]>) => res.data),
    //     map(smartForms => smartForms.filter(smartForm => smartForm.status == 'PUBLISHED')),
    //     tap(x => {
    //       this.smartForms = x;
    //       this.sortedData = this.smartForms.slice();
    //     })
    //   )
  }
  getLeadForm() {
    // return this.http.getLeadForm()
    //   .pipe(
    //     map((res: BackendResponse<SmartForm[]>) => res.data),
    //     tap(x => this.leadForm = x[0])
    //   )
  }
  
  onSelectForm(form: SmartForm) {
    const whenEvent: FormGroup = this.automationService.getWhenEvent()
    whenEvent.patchValue({
      eventData :{
        dataId : form._id,
        params : { name: form.name, formTag: FormType.SMART_FORM}
      }
    })
    this.automationService.updateWhenEvent(whenEvent);
    this.automationService.updateEventType(EventType.WHEN);
  }

  openCreateSmartForm(data?: any) {
    const modalRef = this.http.showModal(SmartFormCreateComponent, 'custom-class-for-create-smart-form', data);
    modalRef.content.onClose = new Subject<boolean>();
    modalRef.content.onClose.subscribe(() => {
      this.loadData();
    })
  }

  sortData(sort: Sort) {
    const data = this.smartForms.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name': return this.compare(a.name.toLowerCase(), b.name.toLowerCase(), isAsc);
        case 'addedOn': return this.compare(format(new Date(a.createdAt), 't'), format(new Date(b.createdAt), 't'), isAsc);
        case 'status': return this.compare(a.status, b.status, isAsc);
        default: return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}
