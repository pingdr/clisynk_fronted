import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HttpService } from '../../../services/http.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-delete-doc',
  templateUrl: './delete-doc.component.html'
})
export class DeleteDocComponent implements OnInit {

  modalData: any;
  public onClose: Subject<boolean>;


  constructor(public http: HttpService) {
  }

  ngOnInit(): void {
  }

  deleteDocs() {
    console.log("this.modalData==========",this.modalData);
    
    let url = 'documents/delete';
    let body = {
      "documentIds": this.modalData,
    };
    this.http.updateDocument(url, body).subscribe(() => {
      this.http.documentUpdated();
      this.http.openSnackBar('Deleted Successfully');
      this.http.hideModal();
    }, () => {
    });

  }



}
