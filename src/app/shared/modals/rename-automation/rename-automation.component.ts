import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-rename-automation',
  templateUrl: './rename-automation.component.html',
  styleUrls: ['./rename-automation.component.css']
})
export class RenameAutomationComponent implements OnInit {

  constructor(public http:HttpService) { }

  ngOnInit() {
  }

}
