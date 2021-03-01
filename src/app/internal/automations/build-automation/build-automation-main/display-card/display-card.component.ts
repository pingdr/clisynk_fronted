import { NavigateToTagsComponent } from 'src/app/shared/modals/navigate-to-tags/navigate-to-tags.component';
import { WhenEvent } from './../../../models/automation';
import { EventNames, FormType } from './../../../models/enum';
import { LeadFormDeletedComponent } from 'src/app/shared/modals/lead-form-deleted/lead-form-deleted.component';
import { HttpService } from 'src/app/services/http.service';
import { FormGroup } from '@angular/forms';
import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';
import { EventType, Images } from '../../../automation-constants';
import { UUID } from 'angular2-uuid';
import { Subject } from 'rxjs';
import { AutomationService } from '../../../automation.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-display-card',
  templateUrl: './display-card.component.html',
  styleUrls: ['./display-card.component.css'],
})
export class DisplayCardComponent implements OnInit {

  statusImages = Images;
  random: string;
  EventType = EventType;
  EventNames = EventNames;

  eventType: string;

  @Input()
  index: number;

  _taskData: FormGroup;
  @Input() 
  set taskData(value: any) {
    if(value) {
      this._taskData = value;
      console.log(this._taskData.value);
    }
  }
  
  public get cardStatus(): string {
    switch (this.eventType) {
      case EventType.WHEN: {
        return this.statusImages.greenCloud;
      }
      case EventType.THEN: {
        return this.statusImages.blueFlash;
      }
    }
  }


  constructor(private changeDetection: ChangeDetectorRef, 
    public automationService: AutomationService,
    private router: Router,
    private http: HttpService) {
    this.random = this.makeid(15);
   }

  ngOnInit() {
    console.log(this.random);
    this.automationService.eventSelected.subscribe(res => this.eventType = res);
  }
 

  onEditTask() {
    switch (this._taskData.value.eventName) {
      case EventNames.WHEN.LEAD_FORM : {
        this.automationService.updateEventType(EventType.WHEN_EDIT_LEAD_FORM);
        break;
      }
      case EventNames.WHEN.APPOINTMENT_SCHEDULED : {
        this.automationService.updateEventType(EventType.WHEN_EDIT_APPOINTMENT_SCHEDULED);
        break;
      }
      case EventNames.WHEN.APPOINTMENT_CANCELED : {
        this.automationService.updateEventType(EventType.WHEN_EDIT_APPOINTMENT_CANCELED);
        break;
      }
      case EventNames.WHEN.TAG_ADDED : {
        this.automationService.updateEventType(EventType.WHEN_EDIT_TAG_ADDED);
        break;
      }
    }
  }

  goTo() {
    switch (this._taskData.value.eventName) {
      case EventNames.WHEN.LEAD_FORM : {
        this.goToLeadFormPreview();
        break;
      }
      case EventNames.WHEN.TAG_ADDED : {
        this.goToManageTags();
        break;
      }
    }
  }

  goToLeadFormPreview() {
    const whenEvent: WhenEvent = this.automationService.getWhenEvent().value;
    if (whenEvent.eventData.params.formTag == FormType.LEAD_FORM) {
      this.router.navigate([]).then(result => { window.open(`/preview-leadform/${whenEvent.eventData.dataId}`)})
    } else if (whenEvent.eventData.params.formTag == FormType.SMART_FORM) {
      this.router.navigate([]).then(result => { window.open(`/preview-smartform/${whenEvent.eventData.dataId}`)})
    }
    this.automationService.updateEventType(EventType.WHEN);
  }

  goToManageTags() {
    const modalRef = this.http.showModal(NavigateToTagsComponent, 'xs lead-form-popup-main navigated-appointment-modal');
    modalRef.content.onClose = new Subject<boolean>();
    modalRef.content.onClose.subscribe((res) => {
      if (res) {
        this.router.navigate(["/contacts/tag-settings"]);
      }
    })
  }

  onDeleteTask() {
    const modalRef = this.http.showModal(LeadFormDeletedComponent, 'xs navigated-to-lead');
    modalRef.content.onClose = new Subject<boolean>();
    modalRef.content.onClose.subscribe((res) => {
      if (res) {
        switch (this.eventType) {
          case EventType.WHEN: {
            this.automationService.updateWhenEvent(null);
            break;
          }
          case EventType.THEN: {
            this.automationService.removeThenTasksFromList(this.index);
            break;
          }
        }

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
