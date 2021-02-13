import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-delete-automation',
  templateUrl: './delete-automation.component.html',
  styleUrls: ['./delete-automation.component.css']
})
export class DeleteAutomationComponent implements OnInit {

  constructor(public http:HttpService) { }

  ngOnInit() {
  }
  
}
