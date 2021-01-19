import {Component, OnInit} from '@angular/core';
import {TableModel} from '../../models/table.common.model';
import {HttpService} from '../../../services/http.service';
import {FILTERS} from './contact-filter.constant';
import {ApiUrl} from '../../../services/apiUrls';
import {Subject} from 'rxjs';
import { FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-contact-filter',
    templateUrl: './contact-filter.component.html'
})
export class ContactFilterComponent implements OnInit {

    form: FormGroup;
    allData: any;
    modalData: any;
    isEdit = false;
    contacts = [];
    tags: any = [];
    loader = false;
    settingsContactsTags = {
        singleSelection: false,
        idField: '_id',
        textField: 'name',
        enableCheckAll: true,
        selectAllText: 'Select all',
        unSelectAllText: 'Search Contact',
        allowSearchFilter: true,
        limitSelection: -1,
        clearSearchFilter: true,
        itemsShowLimit: 4,
        searchPlaceholderText: 'Search',
        closeDropDownOnSelection: false,
        showSelectedItemsAtTop: false,
        defaultOpen: false
    };
    settingsContacts = {
        singleSelection: false,
        idField: '_id',
        textField: 'email',
        enableCheckAll: true,
        selectAllText: 'Select all',
        unSelectAllText: 'Search Contact',
        allowSearchFilter: true,
        limitSelection: -1,
        clearSearchFilter: true,
        itemsShowLimit: 4,
        searchPlaceholderText: 'Search',
        closeDropDownOnSelection: false,
        showSelectedItemsAtTop: false,
        defaultOpen: false
    };
    onClose: Subject<boolean>;

    constructor(public http: HttpService) {}

    ngOnInit(): void {
        
        if (this.modalData) {
             this.isEdit = true;
             this.updateFormInit();
        } else {
            this.formInit();
        }
        
        this.contactList();
        this.contactTagList();
    }

    formInit() {
        this.form = this.http.fb.group({
            name: ['', Validators.required],
            contactIds: [''],
            tagIds: ['']
        });
    }

    updateFormInit() {
        this.form = this.http.fb.group({
            contactIds: ['']
        });
    }

    resetBtn() {
        this.form.reset();
    }

    contactList() {
        const obj: any = {
            skip: 0,
            limit: 1000,
            search: ''
        };
        this.http.getData(ApiUrl.CONTACTS, obj).subscribe(res => {
            this.contacts = res.data.data;
        });
    }

    contactTagList(){
        this.http.getData(ApiUrl.TAGS).subscribe(res => {
            this.tags = res.data.data;
        },() => {});
    }

    finalSubmit() {
        this.loader = true;
        const updateObj: any = {};
        const obj: any = JSON.parse(JSON.stringify(this.form.value));
        obj.contactIds = obj.contactIds ? obj.contactIds.map(item => {return item._id}) : [];
        obj.tagIds = obj.tagIds ? obj.tagIds.map(item => {return item._id}) : [];
        if(this.http.isFormValid(this.form)){
            if(this.modalData && this.modalData.id){
                updateObj.contactListId = this.modalData.id;
                updateObj.contactIds = obj.contactIds;
            }
            this.http.postCreateGroup(this.isEdit ? ApiUrl.UPDATE_CONTACT_GROUP : ApiUrl.CREATE_CONTACT_GROUP, this.isEdit ? updateObj : obj).subscribe(() => {
            this.loader = false;
            this.isEdit ? this.http.openSnackBar('Contact group updated Successfully') : this.http.openSnackBar('Contact group added Successfully');
            this.http.hideModal();
          }, () => {
            this.loader = false;
            this.http.hideModal();
            });
        }
    }

    public onItemSelect(item: any) {}

    public onDeSelect(item: any) {}

    public onSelectAll(items: any) {}

    public onDeSelectAll(items: any) {}

    public onItemSelectTag(item: any) {}

    public onDeSelectTag(item: any) {}

    public onSelectAllTag(items: any) {}

    public onDeSelectAllTag(items: any) {}

}
