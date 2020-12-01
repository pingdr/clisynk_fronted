import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';



@Component({
  selector: 'app-edit-workspace',
  templateUrl: './edit-workspace.component.html',
  styleUrls: ['./edit-workspace.component.css']
})
export class EditWorkspaceComponent implements OnInit {

  constructor(public http: HttpService) { }

  ngOnInit() {
  }

}
