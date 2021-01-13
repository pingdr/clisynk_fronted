import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { CreateWorkspaceComponent } from 'src/app/shared/modals/create-workspace/create-workspace.component';
import { ApiUrl } from '../../../services/apiUrls';

@Component({
  selector: 'app-manage-workspace',
  templateUrl: './manage-workspace.component.html',
  styleUrls: ['./manage-workspace.component.css']
})
export class ManageWorkspaceComponent implements OnInit {

  allData: any;
  workspaceId: any;

  constructor(public http: HttpService) { }

  ngOnInit() {
    this.getAllWorkspaces();
  }

  getAllWorkspaces(){
    const obj: any = {};
    this.http.getData(ApiUrl.WORKSPACE, obj).subscribe(res => {
        this.allData = res.data;    
        res.data.map(wps => {
          wps.backgroundColor = this.http.getRandomColor();
        });
        this.http.updateWorkspaceList(res.data);
    }, () => {});
  }

  openEditWorkspace(data) {
    this.http.showModal(CreateWorkspaceComponent, 'md', data);
  }

  deleteWorkspace(template, workspaceId) {
    this.workspaceId = workspaceId;
    this.http.showModal(template, 'xs');
  }
  
  changeStatus(status) {
    const obj = {
        status: status,
        workspaceId: this.workspaceId
    };
    this.http.deleteWorkspace(ApiUrl.WORKSPACE+`/${this.workspaceId}`).subscribe(() => {
      if (status === 2) {
          this.http.openSnackBar('Workspace Completed Successfully');
      } else {
          this.http.openSnackBar('Workspace Deleted Successfully');
      }
      this.getAllWorkspaces();
    });
  }

}
