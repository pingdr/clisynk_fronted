import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ApiUrl} from '../../../services/apiUrls';
import {HttpService} from '../../../services/http.service';
import {TableModel} from '../../../shared/models/table.common.model';
import {AddTagComponent} from '../../../shared/modals/add-tag/add-tag.component';
import {AddRemoveTagComponent} from '../../../shared/modals/add-remove-tag/add-remove-tag.component';
import {DeleteComponent} from '../../../shared/modals/delete/delete.component';
import {Subject, Subscription} from 'rxjs';
import {tagFilters} from '../../../services/constants';

@Component({
    selector: 'app-manage-tag',
    templateUrl: './manage-tag.component.html'
})

export class ManageTagComponent implements OnInit, OnDestroy {

    myModel: TableModel;
    search = new FormControl('');
    searchContact = new FormControl('');
    loader = true;
    selected: any = '';
    allSelect = new FormControl('');
    subscription: Subscription;
    selectedContactCount = 0;
    sendData: any = {
        count: this.selectedContactCount
    };
    showSelected = false;
    modalData: any = {};
    selectedIndex = 0;
    dropdownType = 'main';
    tagFilters = tagFilters;
    sortBy: any = '';
    categoryId: any;

    constructor(public http: HttpService) {
        this.subscription = this.http.eventStatus.subscribe(data => {
            if (data && data.eventType === 'deleteTag') {
                this.tagList(this.selectedIndex);
                this.unselectAll();
            } else if (data && data.eventType === 'addTag') {
                this.tagList(this.selectedIndex);
                this.unselectAll();
            }
        });
        this.allSelect.valueChanges.subscribe(res => {
        });
    }

    ngOnInit() {
        this.myModel = new TableModel();
        this.tagList();
        this.categoryList();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    categoryList() {
        const obj: any = {
            skip: 0,
            limit: 100
        };
        this.http.getData(ApiUrl.TAG_CATEGORIES, obj).subscribe(res => {
            res.data.forEach((val) => {
                val.dropdownType = 'filterBy';
                this.tagFilters.push(val);
            });
        });
    }

    tagList(index?) {
        const obj: any = {
            skip: 0,
            limit: 1000
        };
        if (this.search.value) {
            obj.search = this.search.value;
        }
        if (this.sortBy) {
            obj.sortBy = this.sortBy;
        }
        if (this.categoryId) {
            obj.categoryId = this.categoryId;
        }
        this.http.getData(ApiUrl.TAGS, obj).subscribe(res => {
                    this.myModel.tags = res.data.data;
                    this.loader = false;
                    if (index !== undefined) {
                        this.selected = res.data.data[index];
                        console.log('this.selected ', this.selected )
                        this.contactList();
                    }
                },
                () => {
                    this.loader = false;
                });
    }

    addTag() {
        this.http.showModal(AddTagComponent, 'md', {});
    }

    contactList() {
        const obj: any = {
            skip: this.myModel.currentPage * 100,
            limit: this.myModel.limit,
            tagId: this.selected._id,
            search: this.searchContact.value
        };
        this.http.getData(ApiUrl.CONTACTS, obj).subscribe(res => {
                    this.myModel.contacts = res.data.data;
                    this.myModel.allData = res.data;
                    this.myModel.totalItems = res.data.totalCount;
                    this.loader = false;
                },
                () => {
                    this.loader = false;
                });
    }

    selectAllContact() {
        if (this.allSelect.value) {
            this.showSelected = !this.showSelected;
            this.myModel.contacts.forEach((val) => {
                val.isSelected = true;
            });
            this.getSelectedCount();
        } else {
           this.unselectAll();
            this.selectedContactCount = 0;
        }
        this.sendData.count = this.selectedContactCount;
    }

    unselectAll() {
        this.myModel.contacts.forEach((val) => {
            val.isSelected = false;
        });
        this.selectedContactCount = 0;
        this.allSelect.patchValue('');
    }


    deleteContact() {
        const obj: any = {
            type: 2,
            key: 'contactIds',
            title: 'Delete Contacts',
            message: 'Are you sure you want to delete these contacts?',
            id: JSON.stringify(this.http.getIsSelected(this.myModel.contacts, 'isSelected'))
        };
        const modalRef = this.http.showModal(DeleteComponent, 'xs', obj);
        modalRef.content.onClose = new Subject<boolean>();
        modalRef.content.onClose.subscribe(() => {
            this.selectedContactCount = 0;
            // this.selected = '';
            this.http.openSnackBar('Contact have been deleted');
            this.contactList();
            this.allSelect.patchValue('');
        });
    }

    exportContacts() {
        this.http.postData(ApiUrl.EXPORT_CONTACTS,
                {contactId: JSON.stringify(this.http.getIsSelected(this.myModel.contacts, 'isSelected'))}, true).subscribe(res => {
            this.allSelect.patchValue('');
            this.http.downloadLink(res.data.path);
            this.myModel.contacts.forEach((val) => {
                val.isSelected = false;
            });
            this.selected = '';
            this.selectedContactCount = 0;
            this.http.openSnackBar('Contacts Exported Successfully');
        }, () => {
        });
    }

    openAddRemoveTag() {
        const obj = {
            contactId: (this.http.getIsSelected(this.myModel.contacts, 'isSelected'))
        };
        this.http.showModal(AddRemoveTagComponent, 'more-sm', obj);
    }

    getSelectedCount() {
        let tempCount = 0;
        this.myModel.contacts.forEach((val) => {
            if (val.isSelected) {
                tempCount++;
            } else {
                this.allSelect.patchValue('');
            }
        });
        this.selectedContactCount = tempCount;
    }

    selectContact(data, index) {
        this.selectedIndex = index;
        this.sendData.count = this.selectedContactCount;
    }

    editTag() {
        this.modalData.isEdit = true;
        this.modalData.tagInfo = this.selected;
        this.modalData.contactCount = this.myModel.contacts.length;
        this.http.showModal(AddTagComponent, 'more-sm', this.modalData);
    }

    changeFilter(data) {
        if (data.isHeading) {
            this.dropdownType = 'main';
        } else {
            this.sortBy = '';
            this.categoryId = data._id;
            this.tagList();
        }
    }

    dropDownOpen() {
        document.getElementById('button-basic2').click(); // Click on the checkbox
    }

    changeType(data) {
        if (data.isHeading) {
            this.dropdownType = 'main';
        } else {
            if (this.dropdownType === 'sortBy') {
                this.sortBy = data.val;
            } else {
                this.sortBy = '';
            }
            this.categoryId = '';
            this.tagList();
        }
    }

}
