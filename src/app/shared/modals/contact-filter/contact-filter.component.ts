import {Component, OnInit} from '@angular/core';
import {TableModel} from '../../models/table.common.model';
import {HttpService} from '../../../services/http.service';
import {FILTERS} from './contact-filter.constant';
import {ApiUrl} from '../../../services/apiUrls';
import {Subject} from 'rxjs';

@Component({
    selector: 'app-contact-filter',
    templateUrl: './contact-filter.component.html'
})
export class ContactFilterComponent implements OnInit {

    allData: any;
    myModel: any;
    addBtn = false;
    modalData: any;
    filters = FILTERS;
    public onClose: Subject<boolean>;

    constructor(public http: HttpService) {
        this.myModel = new TableModel();
        this.filters.count = undefined;
    }

    ngOnInit(): void {
        if (this.modalData.addBtn) {
            this.addBtn = this.modalData.addBtn;
        }
        this.resetBtn();
    }

    selectFilter() {
        const newObj: any = this.filters.selectFilters;
        const obj: any = {
            key: newObj.key,
            selected: newObj.selected,
            viewValue: newObj.viewValue
        };
        if (newObj.selected === 1) {
            obj.type = 1;
        } else {
            obj.type = 9;
        }
        this.filters.selectList.push(obj);
        this.filters.selectFilters = '';
    }

    viewContacts() {
        this.onClose.next(this.allData);
        this.http.hideModal();
    }

    addFilter() {
        if (this.filters.name && this.filters.selectList.length) {
            const obj: any = {
                name: this.filters.name,
                filters: JSON.stringify(this.filters.selectList)
            };
            this.http.hideModal();
            this.http.postData(ApiUrl.ADD_FILTER, obj).subscribe(() => {
                        this.http.openSnackBar('List Added Successfully');
                        this.onClose.next(false);
                    },
                    () => {
                    });
        }
    }

    resetBtn() {
        this.filters.count = undefined;
        this.filters.selectList = [];
        this.filters.selectFilters = '';
    }

    contactList() {
        const obj: any = {
            skip: 0,
            limit: 100,
            sortBy: this.filters.sortBy
        };
        const temp: any = [];
        this.filters.selectList.forEach(value => {
            if (value.value) {
                temp.push({
                    key: value.key,
                    type: value.type,
                    value: value.value
                });
            }
        });
        if (temp.length) {
            obj.filters = JSON.stringify(temp);
        }
        this.http.getData(ApiUrl.CONTACTS, obj).subscribe(res => {
            this.allData = res.data.data;
            this.filters.count = res.data.totalCount;
        });
    }

    finalSubmit() {
        this.http.hideModal();
    }

    removeBtn(index) {
        this.filters.selectList.splice(index, 1);
        if (this.filters.selectList.length) {
            this.contactList();
        } else {
            this.filters.count = 0;
        }
    }

}
