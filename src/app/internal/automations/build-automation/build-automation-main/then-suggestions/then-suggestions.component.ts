import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { SubmitfeedbackComponent } from 'src/app/shared/modals/submitfeedback/submitfeedback.component';

@Component({
  selector: 'app-then-suggestions',
  templateUrl: './then-suggestions.component.html',
  styleUrls: ['./then-suggestions.component.css']
})
export class ThenSuggestionsComponent implements OnInit {

  showOption = false;

  @Output()
  onSelectedEvent = new EventEmitter<any>();

  selectedEvent:string;
  listOfThenEvents = ['Send an email', 'Send notification', 'Add a tag', 'Create a task'];

  constructor(public http: HttpService) { }

  ngOnInit() {
  }

  
  openSubmitfeedback() {
    this.http.showModal(SubmitfeedbackComponent);
  }


  toggleOptions(){
    this.showOption = !this.showOption
    document.body.scrollTop = 0;
    // window.scrollTo(1900, 1900);
  }

  onSelectEvent(item) {
    this.selectedEvent = item;
    this.onSelectedEvent.emit(item);
  }


}
