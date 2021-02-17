import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { SubmitfeedbackComponent } from 'src/app/shared/modals/submitfeedback/submitfeedback.component';

@Component({
  selector: 'app-when-suggestions',
  templateUrl: './when-suggestions.component.html',
  styleUrls: ['./when-suggestions.component.css']
})
export class WhenSuggestionsComponent implements OnInit {

  showOption = false;

  @Output()
  onSelectedEvent = new EventEmitter<any>();

  selectedEvent:string;
  listOfWhenEvents = ['Lead form is submitted', 'Appointment is scheduled', 'Tag is added', 'Purchase is made'];

  constructor(public http:HttpService,) { }

  ngOnInit() {
  }

  
  openSubmitfeedback() {
    this.http.showModal(SubmitfeedbackComponent);
  }
  
  onSelectEvent(item) {
    this.selectedEvent = item;
    this.onSelectedEvent.emit(item);
  }

  toggleOptions(){
    this.showOption = !this.showOption
    document.body.scrollTop = 0;
    // window.scrollTo(1900, 1900);
  }

}
