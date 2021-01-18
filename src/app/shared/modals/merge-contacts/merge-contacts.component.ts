import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiUrl } from 'src/app/services/apiUrls';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-merge-contacts',
  templateUrl: './merge-contacts.component.html',
  styleUrls: ['./merge-contacts.component.css']
})
export class MergeContactsComponent implements OnInit {

  form: FormGroup;
  modalData: any;
  loader = false;
  isEdit = false;
  toMore = false;
  showWorkspaces : any = [];
  showMoreWorkspaces : any = [];

  postData : any = { "toWorkspaceIds" : [], "contactListIds": [], "tagIds": [], "fromWorkspaceId": ""};

  constructor(public http:HttpService, public router: Router) { }
  

  ngOnInit() {
    if(this.modalData){
      console.log('Modal Data::', this.modalData);
      this.toMore = this.modalData.selectedWorkspacesName.length > 3 ? true : false;
      this.showMoreWorkspaces = this.modalData.selectedWorkspacesName.filter((wps,idx) => idx > 2);
      this.showWorkspaces = this.modalData.selectedWorkspacesName.filter((wps,idx) => idx < 3);
      this.fillValues(this.modalData);
    }
  }

  fillValues(data){
    this.postData.fromWorkspaceId = data.fromWorkspaceId ? data.fromWorkspaceId : "";
    this.postData.toWorkspaceIds = data.fromWorkspaceId ? data.toWorkspaceIds.map(item => {return item._id}) : [];
    this.postData.contactListIds = data.contactListIds ? data.contactListIds.map(item => {return item._id}) : [];
    this.postData.tagIds = data.tagIds ? data.tagIds.map(item => {return item._id}) : [];
  }

  mergeWorkspace(){
    this.loader = true;
    console.log("Come Here");
    this.http.postWorkspaceMerge(ApiUrl.WORKSPACE_MERGE , this.postData).subscribe(() => {
        this.loader = false;
        this.http.hideModal();
        this.http.openSnackBar('Workspace Merged Successfully');
        this.router.navigate(['/settings/manage-workspace']);
      }, () => {
        this.loader = false;
        this.http.openSnackBar('Something went wrong while merging');
    });
  }
}
