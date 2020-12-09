import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { Subject } from 'rxjs';
import { SmartFormCreateComponent } from 'src/app/shared/modals/smart-form-create/smart-form-create.component';
import { SmartFormDeleteComponent } from "src/app/shared/modals/smart-form-delete/smart-form-delete.component";
import { BsModalService } from 'ngx-bootstrap';

@Component({
  selector: 'app-smart-forms',
  templateUrl: './smart-forms.component.html',
  styleUrls: ['./smart-forms.component.css']
})
export class SmartFormsComponent implements OnInit {
  formsList: [{}];
  loader: any;
  constructor(public http: HttpService, public modalService: BsModalService) { }

  ngOnInit() {
    this.getSmartFormList();
  }

  getSmartFormList() {
    // this.myModel = new TableModel();
    this.loader = true;
    this.http.getSmartForm().subscribe(res => {
        console.log(res.data);
        this.loader = false;
        this.formsList = res.data;
    }, () => {
        this.loader = false;
    });
  }

  onUpdate(data){
    if(data.status != "PUBLISHED"){
    console.log(data);
    const modalRef = this.http.showModal(SmartFormCreateComponent, 'custom-class-for-create-smart-form', data,);
    modalRef.content.onClose = new Subject<boolean>();
    modalRef.content.onClose.subscribe(() =>{
      this.getSmartFormList();  
    })
    }
  }

  openAddUser(data?) {
    const modalRef = this.http.showModal(SmartFormCreateComponent, 'custom-class-for-create-smart-form', data,);
    modalRef.content.onClose = new Subject<boolean>();
    modalRef.content.onClose.subscribe(() =>{
      this.getSmartFormList();  
    })
    
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

  onDelete(data) {
    const modalRef = this.http.showModal(SmartFormDeleteComponent, 'xs', data);
    modalRef.content.onClose = new Subject<boolean>();
    modalRef.content.onClose.subscribe(res => {
      if (res) {
        this.getSmartFormList();
      }
    });
  }

}
