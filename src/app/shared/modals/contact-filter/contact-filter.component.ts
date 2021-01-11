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
    public data1 = [];
    public data2 = []; 
  public settings = {};
    public onClose: Subject<boolean>;

    constructor(public http: HttpService) {
        this.myModel = new TableModel();
        this.filters.count = undefined;
    }

    ngOnInit(): void {


        this.data1 = [
            { item_id: 1, item_text: 'Lorem ipsum' },
            { item_id: 2, item_text: 'Lorem ipsum2' },
            { item_id: 3, item_text: 'Lorem ipsum3' },
            { item_id: 4, item_text: 'Lorem ipsum4' },
            { item_id: 5, item_text: 'Lorem ipsum5' }
          ];

          this.data2 = [
            { item_id: 1, item_text: 'Tags1' },
            { item_id: 2, item_text: 'Tags2' },
            { item_id: 3, item_text: 'Tags3' },
            { item_id: 4, item_text: 'Tags4' },
            { item_id: 5, item_text: 'Tags5' }
          ];
          // setting and support i18n
          this.settings = {
            singleSelection: false,
            idField: 'item_id',
            textField: 'item_text',
            enableCheckAll: true,
            selectAllText: 'Select all',
            unSelectAllText: 'Search Contact',
            allowSearchFilter: true,
            limitSelection: -1,
            clearSearchFilter: true,
            maxHeight: 197,
            itemsShowLimit: 4,
            searchPlaceholderText: 'Search',
            closeDropDownOnSelection: false,
            showSelectedItemsAtTop: false,
            defaultOpen: false
          };

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
        if (this.filters.name && this.filters.selectList.length && this.filters.selectList[0].value) {
            const obj: any = {
                name: this.filters.name,
                filters: JSON.stringify(this.filters.selectList)
            };
            this.http.hideModal();
            this.http.postData(ApiUrl.ADD_FILTER, obj).subscribe(() => {
                        this.http.openSnackBar('List Added Successfully');
                        this.onClose.next(false);
            });
        }
        else{
            this.http.openSnackBar('Please add require details of contact.');
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
