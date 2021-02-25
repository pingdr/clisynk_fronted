import { BackendResponse } from './../../../../../models/backend-response';
import { SmartForm } from './../../../../../../../models/smart-form';
import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpService } from 'src/app/services/http.service';
import { SmartFormCreateComponent } from 'src/app/shared/modals/smart-form-create/smart-form-create.component';
import { Sort } from '@angular/material/sort';
import { format } from 'date-fns'


@Component({
  selector: 'app-choose-lead-form',
  templateUrl: './choose-lead-form.component.html',
  styleUrls: ['./choose-lead-form.component.css']
})
export class ChooseLeadFormComponent implements OnInit {

  loader = false;
  smartForms: SmartForm[];
  sortedData: SmartForm[];
  searchText = '';

  constructor(public http: HttpService) { }

  ngOnInit() {
    this.getSmartFormList();  
  }

  getSmartFormList() {
    // this.myModel = new TableModel();
    this.loader = true;
    this.http.getSmartForm().subscribe((res: BackendResponse<SmartForm[]>) => {
      this.smartForms = res.data;
      console.log(this.smartForms);
      this.sortedData = this.smartForms.slice();
      this.loader = false;
    }, () => {
        this.loader = false;
    });
  }

  openCreateSmartForm(data?: any) {
    const modalRef = this.http.showModal(SmartFormCreateComponent, 'custom-class-for-create-smart-form', data);
    modalRef.content.onClose = new Subject<boolean>();
    modalRef.content.onClose.subscribe(() =>{
      this.getSmartFormList();  
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
        case 'addedOn': return this.compare(format(+a.createdAt, 't'), format(+b.createdAt, 't'), isAsc);
        case 'status': return this.compare(a.status, b.status, isAsc);
        default: return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}
