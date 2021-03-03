import { EventNames } from './../../../models/enum';
import { LeadFormDeletedComponent } from 'src/app/shared/modals/lead-form-deleted/lead-form-deleted.component';
import { HttpService } from 'src/app/services/http.service';
import { FormGroup } from '@angular/forms';
import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { EventType, Images } from '../../../automation-constants';
import { Subject } from 'rxjs';
import { AutomationService } from '../../../automation.service';
import { Router } from '@angular/router';
import { CardHelperFunctions } from "./card-helper-functions";
@Component({
  selector: 'app-display-card',
  templateUrl: './display-card.component.html',
  styleUrls: ['./display-card.component.css'],
})
export class DisplayCardComponent extends CardHelperFunctions implements OnInit {

  statusImages = Images;
  random: string;
  EventType = EventType;
  EventNames = EventNames;

  eventType: string;

  @Input()
  index: number = 0;

  _taskData: FormGroup;
  @Input()
  set taskData(value: FormGroup) {
    if (value) {
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


  constructor(public changeDetection: ChangeDetectorRef,
    public automationService: AutomationService,
    public router: Router,
    public http: HttpService) {

    super(changeDetection, automationService, router, http);
    this.random = this.makeid(15);
  }

  ngOnInit() {
    console.log(this.random);
    this.automationService.eventSelected.subscribe(res => this.eventType = res);
  }


  onEditTask() {
    switch (this._taskData.value.eventName) {
      case EventNames.WHEN.LEAD_FORM: {
        this.automationService.updateEventType(EventType.WHEN_EDIT_LEAD_FORM);
        break;
      }
      case EventNames.WHEN.APPOINTMENT_SCHEDULED: {
        this.automationService.updateEventType(EventType.WHEN_EDIT_APPOINTMENT_SCHEDULED);
        break;
      }
      case EventNames.WHEN.APPOINTMENT_CANCELED: {
        this.automationService.updateEventType(EventType.WHEN_EDIT_APPOINTMENT_CANCELED);
        break;
      }
      case EventNames.WHEN.TAG_ADDED: {
        this.automationService.updateEventType(EventType.WHEN_EDIT_TAG_ADDED);
        break;
      }
      case EventNames.WHEN.PRODUCT_PURCHASED: {
        this.automationService.updateEventType(EventType.WHEN_EDIT_PRODUCT_PURCHASED);
        break;
      }
      case EventNames.THEN.SEND_EMAIL: {
        this.thenTaskEditMode();
        this.automationService.updateEventType(EventType.THEN_EDIT_SEND_EMAIL);
        break;
      }
    }
  }

  goTo() {
    switch (this._taskData.value.eventName) {
      case EventNames.WHEN.LEAD_FORM: {
        this.goToLeadFormPreview();
        break;
      }
      case EventNames.WHEN.TAG_ADDED: {
        this.goToManageTags();
        break;
      }
      case EventNames.WHEN.PRODUCT_PURCHASED: {
        this.goToManageProducts();
        break;
      }
    }
  }

  thenTaskEditMode() {
    this._taskData.patchValue({
      eventData: {
        params: { thenTaskIndex: this.index }
      }
    })
    // this.automationService.setCurrentEditedThenTask(this._taskData);
    this.automationService.updateThenTask(this._taskData, this.index);
    this.automationService.currentThenTaskIndex = this.index;

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
            this.automationService.removeThenTaskFromList(this.index);
            break;
          }
        }

      }
    });
  }




}


