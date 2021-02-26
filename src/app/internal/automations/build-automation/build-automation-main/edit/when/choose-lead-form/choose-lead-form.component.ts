import { LoadingService } from './../../../../../loading.service';
import { BackendResponse } from './../../../../../models/backend-response';
import { SmartForm } from './../../../../../../../models/smart-form';
import { Component, OnInit } from '@angular/core';
import { Subject, Observable, concat, forkJoin } from 'rxjs';
import { HttpService } from 'src/app/services/http.service';
import { SmartFormCreateComponent } from 'src/app/shared/modals/smart-form-create/smart-form-create.component';
import { Sort } from '@angular/material/sort';
import { format } from 'date-fns'
import { finalize, map, tap } from 'rxjs/operators';


@Component({
  selector: 'app-choose-lead-form',
  templateUrl: './choose-lead-form.component.html',
  styleUrls: ['./choose-lead-form.component.css']
})
export class ChooseLeadFormComponent implements OnInit {

  loader = false;
  smartForms: SmartForm[];
  leadForm: SmartForm;
  sortedData: SmartForm[];
  searchText = '';

  loader$: Observable<boolean>;
  smartForms$: Observable<SmartForm[]>;
  sortedData$: Observable<SmartForm[]>;

  constructor(public http: HttpService, public loadingService: LoadingService) { }

  async ngOnInit() {
    await this.loadData();
    console.log("data loaded");

  }

  async loadData() {
    this.loader$ = this.loadingService.loader$;
    this.loadingService.loadingOn()
    await forkJoin([this.getLeadForm(), this.getSmartFormList()])
      .pipe(finalize(() => this.loadingService.loadingOff())).toPromise();
    console.log(this.leadForm);
    console.log(this.smartForms)
  }

  getSmartFormList() {
    return this.http.getSmartForm()
      .pipe(
        map((res: BackendResponse<SmartForm[]>) => res.data),
        tap(x => {
          this.smartForms = x;
          this.sortedData = this.smartForms.slice();
        })
      )
  }
  getLeadForm() {
    return this.http.getLeadForm()
      .pipe(
        map((res: BackendResponse<SmartForm[]>) => res.data),
        tap(x => this.leadForm = x[0])
      )
  }

  openCreateSmartForm(data?: any) {
    const modalRef = this.http.showModal(SmartFormCreateComponent, 'custom-class-for-create-smart-form', data);
    modalRef.content.onClose = new Subject<boolean>();
    modalRef.content.onClose.subscribe(() => {
      // this.getSmartFormList();
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
