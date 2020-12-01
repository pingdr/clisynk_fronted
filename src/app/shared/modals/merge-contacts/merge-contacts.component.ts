import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-merge-contacts',
  templateUrl: './merge-contacts.component.html',
  styleUrls: ['./merge-contacts.component.css']
})
export class MergeContactsComponent implements OnInit {

  constructor(public http:HttpService) { }

  ngOnInit() {
  }

}
