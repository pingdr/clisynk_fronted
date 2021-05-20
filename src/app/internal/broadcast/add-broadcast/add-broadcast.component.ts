import {Component, OnInit} from '@angular/core';
import {HttpService} from '../../../services/http.service';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-add-broadcast',
    templateUrl: './add-broadcast.component.html',
    styleUrls: ['./add-broadcast.component.scss']
})
export class AddBroadcastComponent implements OnInit {

    constructor(public http: HttpService, public activeRoute: ActivatedRoute) {  }

    ngOnInit(): void { }

}
