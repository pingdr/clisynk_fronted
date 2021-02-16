import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-build-automation',
  templateUrl: './build-automation.component.html',
  styleUrls: ['./build-automation.component.css']
})
export class BuildAutomationComponent implements OnInit {

  isWhenAdded = false;
  isThenAdded = true;

  constructor(public http: HttpService) { }

  ngOnInit() {
  }

}
