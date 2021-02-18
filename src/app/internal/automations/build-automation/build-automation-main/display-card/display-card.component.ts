import { LeadFormDeletedComponent } from 'src/app/shared/modals/lead-form-deleted/lead-form-deleted.component';
import { HttpService } from 'src/app/services/http.service';
import { FormGroup } from '@angular/forms';
import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';
import { EventType, Images } from '../../../automation-constants';
import { UUID } from 'angular2-uuid';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-display-card',
  templateUrl: './display-card.component.html',
  styleUrls: ['./display-card.component.css'],
})
export class DisplayCardComponent implements OnInit {

  statusImages = Images;
  random: string;
  EventType = EventType;

  @Input()
  eventType: string;

  @Input()
  index: number;

  _taskData: FormGroup;
  @Input() 
  set taskData(value: any) {
    if(value) {
      this._taskData = value;
      console.log(this._taskData);
    }
  }

  @Output() 
  onDelete = new EventEmitter<any>();
  
  public get cardStatus(): string {
    switch (this.eventType) {
      case this.EventType.WHEN: {
        return this.statusImages.greenCloud;
      }
      case this.EventType.THEN: {
        return this.statusImages.blueFlash;
      }
    }
  }


  constructor(private changeDetection: ChangeDetectorRef, private http: HttpService) {
    this.random = this.makeid(15);
   }

  ngOnInit() {
    console.log(this.random);
  }
 

  onEditTask() {

  }

  onDeleteTask() {
    const modalRef = this.http.showModal(LeadFormDeletedComponent, 'xs navigated-to-lead');
    modalRef.content.onClose = new Subject<boolean>();
    modalRef.content.onClose.subscribe((res) => {
      if (res) {
        this.onDelete.emit(this.index);
      }
    });
  }





  private makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
