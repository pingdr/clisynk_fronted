import {Component, OnInit, Input, OnChanges, Output, EventEmitter} from '@angular/core';
import {HttpService} from '../../../services/http.service';

@Component({
    selector: 'app-invoive-tabs',
    templateUrl: './invoice-tabs.component.html'
})
export class InvoiceTabsComponent implements OnChanges {

    @Input() data: any;
    @Output() returnAction: EventEmitter<any> = new EventEmitter();
    myData: any;

    tempDate = new Date();
    today = this.tempDate.toISOString();

    constructor(
        public http: HttpService
    ) {

    }

    ngOnChanges(): void {
        this.myData = this.data;
    }


}
