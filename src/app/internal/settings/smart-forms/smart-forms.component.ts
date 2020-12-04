import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { Subject } from 'rxjs';
import { SmartFormCreateComponent } from 'src/app/shared/modals/smart-form-create/smart-form-create.component';
import { BsModalService } from 'ngx-bootstrap';

@Component({
  selector: 'app-smart-forms',
  templateUrl: './smart-forms.component.html',
  styleUrls: ['./smart-forms.component.css']
})
export class SmartFormsComponent implements OnInit {
  formsList: [{}];
  constructor(public http: HttpService, public modalService: BsModalService) { }

  ngOnInit() {
    this.getFormList();
  }

  getFormList() {
    this.http.getSmartForm().subscribe(res => {
      console.log(res.data);
      this.formsList = res.data;
    });
  }

  openAddUser(data?) {
    const modalRef = this.http.showModal(SmartFormCreateComponent, 'custom-class-for-create-smart-form', data,);
    modalRef.content.onClose = new Subject<boolean>();
    
    // console.log(this.http.modalRef);
    
    // const initialState: any = {};
    // this.modalService.show(SmartFormCreateComponent, {
    //   initialState, keyboard: true, class: `zz'}`
    //   // initialState, keyboard: true, class: `gray modal-${size ? size : 'md'}`, backdrop: 'static'
    // })
    // this.modalService.onHidden.subscribe((res) => {
    //   console.log('-----');
    // })
  }

  onDelete(data, index) {
    if (confirm("Are you sure you want to delete?")) {
      console.log(data._id, index);
      this.http.deleteSmartForm(data._id).subscribe(res => {
        console.log(res);
        this.getFormList();
      });
    } else {
      
    }
  }

}
