import {Component} from '@angular/core';
import {HttpService} from '../../../services/http.service';

@Component({
    selector: 'app-email-detail',
    templateUrl: './email-detail.component.html'
})
export class EmailDetailComponent {

    modalData: any;
    fullview = true;

    constructor(public http: HttpService) {
    }

    finalSubmit() {
        this.http.hideModal();
    }

}
