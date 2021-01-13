import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router} from '@angular/router';
import { ApiUrl } from '../../../services/apiUrls';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-create-workspace',
  templateUrl: './create-workspace.component.html',
  styleUrls: ['./create-workspace.component.css']
})
export class CreateWorkspaceComponent implements OnInit {

  form: FormGroup;
  modalData: any;
  loader = false;
  isEdit = false;

  constructor(public http: HttpService, private router: Router) {
  }

  ngOnInit() {
    console.log('Modal Data::', this.modalData);
    this.formInit();
    if (this.modalData) {
      this.isEdit = true;
      this.fillValues();
    }
  }

  formInit() {
    this.form = this.http.fb.group({
        name: ['', Validators.required],
        description: ['']
    });
  }

  finalSubmit() {
    this.loader = true;
    const obj: any = JSON.parse(JSON.stringify(this.form.value));
    if (this.http.isFormValid(this.form)) {
        this.http.postWorkspaceForm(this.isEdit ? ApiUrl.WORKSPACE + `/${this.modalData._id}` : ApiUrl.WORKSPACE, obj).subscribe(() => {
            this.loader = false;
            this.isEdit ? this.http.openSnackBar('Workspace Updated Successfully') : this.http.openSnackBar('Workspace Added Successfully');
            this.reloadComponent();
          }, () => {
            this.loader = false;
        });
    }
  }

  reloadComponent() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([currentUrl]);
        this.http.hideModal();
    });
  }

  fillValues(){
    this.form.patchValue({
      name: this.modalData.name,
      description: this.modalData.description
    });
  }

}
