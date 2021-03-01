import { Subject } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-navigate-to-appointment',
  templateUrl: './navigate-to-appointment.component.html',
  styleUrls: ['./navigate-to-appointment.component.css']
})
export class NavigateToAppointmentComponent implements OnInit {

  onClose: Subject<boolean>;
  constructor(public http:HttpService) { }

  ngOnInit() {
  }

  confirm() {
    this.http.hideModal();
    this.onClose.next(true);
  }

}
