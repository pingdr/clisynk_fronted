import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { CreateWorkspaceComponent } from 'src/app/shared/modals/create-workspace/create-workspace.component';

@Component({
  selector: 'app-manage-workspace',
  templateUrl: './manage-workspace.component.html',
  styleUrls: ['./manage-workspace.component.css']
})
export class ManageWorkspaceComponent implements OnInit {

  constructor(public http: HttpService) { }

  ngOnInit() {
  }
 

}
