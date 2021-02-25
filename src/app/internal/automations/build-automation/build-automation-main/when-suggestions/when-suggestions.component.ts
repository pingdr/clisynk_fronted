import { FormBuilder, FormGroup } from '@angular/forms';
import { WhenThenEvent } from './../../../models/automation';
import { BackendResponse } from './../../../models/backend-response';
import { AutomationParams } from './../../../models/params';
import { AutomationService } from './../../../automation.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { SubmitfeedbackComponent } from 'src/app/shared/modals/submitfeedback/submitfeedback.component';
import { Automation } from '../../../models/automation';

@Component({
  selector: 'app-when-suggestions',
  templateUrl: './when-suggestions.component.html',
  styleUrls: ['./when-suggestions.component.css']
})
export class WhenSuggestionsComponent implements OnInit {

  private get whenEventsUrl() { return "automation/when-events" }

  showOption = false;
  
  selectedEvent:WhenThenEvent;
  
  loader: boolean = false;
 
  listOfWhenEvents: WhenThenEvent[];


  constructor(public http:HttpService, 
    public automationService: AutomationService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.getWhenEvents();
  }
  
  getWhenEvents() {
    this.loader = true;
    return this.http.getData(this.whenEventsUrl)
    .map((res: BackendResponse<WhenThenEvent[]>) => res.data)
    .subscribe(res =>{ 
      this.listOfWhenEvents = res;
      this.listOfWhenEvents.forEach(x => x.img = this.mapImage(x.eventName) ); //setting Images dynamically
      this.loader = false;
    });
    ;
  }
  openSubmitfeedback() {
    this.http.showModal(SubmitfeedbackComponent);
  }
  
  onSelectEvent(item: WhenThenEvent) {
    delete item.img;
    this.selectedEvent = item;
    let whenForm: FormGroup;
    whenForm = this.createWhenEventObj();
    whenForm.controls.eventName.setValue(item.eventName);
    whenForm.controls.eventDescription.setValue(item.eventDescription);
    this.automationService.updateWhenEvent(whenForm);
  }

  
  createWhenEventObj(): FormGroup {
    return this.formBuilder.group({
      eventName: [''],
      eventDescription: [''],
      eventData : this.formBuilder.group({
        dataId : [''],
        params : [{}]
      })
    });
  }

  toggleOptions(){
    this.showOption = !this.showOption
    document.body.scrollTop = 0;
    // window.scrollTo(1900, 1900);
  }

  private mapImage = (eventName) => {
    switch (eventName) {
      case "leadForm": {return 'assets/images/lead-form-is-submitted.svg'}
      case "appointmentScheduled": {return 'assets/images/appointment-is-scheduled.svg'}
      case "appointmentCancelled": {return 'assets/images/lead-form-is-submitted.svg'}
      case "tagAdded": {return 'assets/images/tag-is-addwd.svg'}
      case "productPurcased": {return 'assets/images/purchase-is-made.svg'}
      default: {return 'assets/images/lead-form-is-submitted.svg'}
       
    }
  }

}
