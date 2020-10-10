import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpService} from '../../services/http.service';
import {ApiUrl} from '../../services/apiUrls';
import {TableModel} from '../../shared/models/table.common.model';
import {Router} from '@angular/router';
import {AppointmentService} from '../appointments/appointment.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, OnDestroy {

    allData: any = {};
    myModel: any;
    loader = true;

    public constructor(public http: HttpService, public router: Router, public appoint: AppointmentService) {
        this.myModel = new TableModel();
        this.myModel.subscription = this.http.eventStatus.subscribe(data => {
            console.log('data..............',data)
            if (data && data.eventType === 'addTask') {
                this.getData();
            }
        });
    }

    ngOnInit() {
        this.getData();
    }

    ngOnDestroy(): void {
        this.myModel.subscription.unsubscribe();
    }

    getData() {
        if (!this.allData) {
            this.myModel.loader = true;
        }
        this.http.getData(ApiUrl.DASHBOARD).subscribe(res => {
            this.allData = res.data;
            this.myModel.loader = false;
        }, () => {
            this.myModel.loader = false;
        });
    }

    openMoney(tab?, search?) {
        if (!tab) {
            tab = 1;
        }
        const dataToSend = {tab: tab};
        if (search) {
            dataToSend['search'] = search;
        }
        this.router.navigate(['/money'], {queryParams: dataToSend});
    }

    checkLink(url, flag?) {
        if (this.http.checkAcl(url)) {
            switch (url) {
                case 'contacts':
                    this.http.openModal('addContact');
                    this.http.navigate('contacts');
                    break;
                case 'money':
                    this.http.openModal(flag);
                    break;
                case 'tasks':
                    this.http.openModal('addTask');
                    break;
                case 'broadcast':
                    this.http.navigate('/broadcast/add-broadcast');
                    break;
            }
        } else {
            this.showAccessError();
        }
    }

    showAccessError() {
        this.http.openSnackBar('You are not authorized to access this feature');
        return;
    }

}
