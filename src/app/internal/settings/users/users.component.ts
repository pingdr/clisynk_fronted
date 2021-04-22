import {Component, OnInit} from '@angular/core';
import {HttpService} from '../../../services/http.service';
import {TableModel} from '../../../shared/models/table.common.model';
import {AddUserComponent} from '../../../shared/modals/add-user/add-user.component';
import {Subject} from 'rxjs';
import {ApiUrl} from '../../../services/apiUrls';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html'
})

export class UsersComponent implements OnInit {

    myModel: any;
    modalData: any;
    isEdit = false;
    isEmpty = false;

    constructor(public http: HttpService) {
        this.myModel = new TableModel();
    }

    ngOnInit(): void {
        this.getList();
    }

    openAddUser(data?) {
        const modalRef = this.http.showModal(AddUserComponent, 'md', data);
        modalRef.content.onClose = new Subject<boolean>();
        modalRef.content.onClose.subscribe(res => {
            this.getList(); 
        });
    }

    getList() {
        this.http.getData(ApiUrl.USER_LIST, {}).subscribe(res => {
            // if(!res.data.length) {
                this.isEmpty = true;
            // }else{
            //     this.isEmpty = false;
            // }
            this.myModel.users = res.data;

            // local test

            // this.myModel.users = [];



        });
    }
    

}
