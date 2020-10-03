import {Component, OnInit} from '@angular/core';
import {HttpService} from '../../../services/http.service';
import {FormControl} from '@angular/forms';
import {TableModel} from '../../models/table.common.model';
import {ApiUrl} from '../../../services/apiUrls';
import {Subject} from 'rxjs';

@Component({
    selector: 'app-contact-lists',
    templateUrl: './contact-lists.component.html'
})
export class ContactListsComponent implements OnInit {

    modalData: any;
    search = new FormControl('');
    myModel: any;
    lists: any;
    public onClose: Subject<boolean>;
    hiddenTabs: any = [];

    constructor(
        public http: HttpService
    ) {
        this.myModel = new TableModel();
    }

    ngOnInit(): void {
        this.listsFun();
    }

    gotoTab(data) {
        this.http.hideModal();
        this.onClose.next(true);
        if (data._id) {
            localStorage.setItem('savedFilter', JSON.stringify(data));
            this.http.addQueryParams({filterId: data._id});
        } else {
            if (data.name === 'Leads') {
                this.http.addQueryParams({type: 1});
            } else {
                this.http.addQueryParams({type: 2});
            }
        }
    }

    hideTab(data) {
        if (this.hiddenTabs && this.hiddenTabs.length) {
            this.lists.forEach((val) => {
                this.hiddenTabs.forEach((val1, index) => {
                    if (!data.isHide) {
                        this.hiddenTabs.push(data);
                    } else {
                        this.hiddenTabs.splice(index, 1);
                    }
                });
            });
        } else {
            this.hiddenTabs.push(data);
        }
        localStorage.setItem('hiddenTabs', JSON.stringify(this.hiddenTabs));
        data.isHide = !data.isHide;
    }

    listsFun() {
        const obj: any = {
            skip: 0,
            limit: 100
        };
        if (localStorage.getItem('hiddenTabs')) {
            this.hiddenTabs = JSON.parse(localStorage.getItem('hiddenTabs'));
        }
        this.http.getData(ApiUrl.CONTACT_LISTS, obj).subscribe(res => {
            this.lists = res.data;
            if (this.hiddenTabs && this.hiddenTabs.length) {
                this.lists.forEach((val) => {
                    this.hiddenTabs.forEach((val1) => {
                        if (val.name === val1.name) {
                            val.isHide = true;
                        }
                    });
                });
            }
        }, () => {
        });
    }

    finalSubmit() {
        this.http.hideModal();
    }

}
