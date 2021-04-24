import {Component, OnInit} from '@angular/core';
import {HttpService} from '../../../services/http.service';
import {TableModel} from '../../../shared/models/table.common.model';
import {AddUserComponent} from '../../../shared/modals/add-user/add-user.component';
import {Subject} from 'rxjs';
import {ApiUrl} from '../../../services/apiUrls';
import { PaginatedResponse } from 'src/app/models/paginated-response';
import { BackendResponse } from 'src/app/models/backend-response';
import { AclService } from 'src/app/services/acl.service';
@Component({
    selector: 'app-users',
    templateUrl: './users.component.html'
})

export class UsersComponent implements OnInit {

    myModel: TableModel;
    modalData: any;
    isEdit = false;
    isLoading = false;
    searchText: string = "";
    

    constructor(public http: HttpService, public acl: AclService) {
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
        this.http.getData(ApiUrl.USER_LIST, {})
            .subscribe((res: BackendResponse<PaginatedResponse<User[]>>) => {
            console.log(res);
            
            this.isLoading = true;
   
            this.myModel.users = res.data;
            
            this.myModel.users.data.forEach(user => {
               user.displayedRoles = this.acl.getSubUserRoles(user);
            })

        });
    }
    

}
