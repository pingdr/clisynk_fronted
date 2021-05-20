import { Component, ElementRef, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';


declare type ViewType = 'paste-in' | 'edit-code' | 'mail';

@Component({
  selector: 'edit-code',
  templateUrl: './edit-code.component.html',
  styleUrls: ['./edit-code.component.css'],
  providers: []
})
export class EditCodeComponent implements OnInit {

  @Output('changeView') 
  changeViewEmitter = new EventEmitter<ViewType>();

  content: any;
  constructor(public sanitizer: DomSanitizer) { }

  ngOnInit() {
  }
  ngAfterViewInit() {
    // this.iframe.nativeElement.setAttribute('src', project.projectUrl);
   }

  contentChange(event) {
    // console.log(event);
    // console.log(this.content);
  }

  changeView(view:ViewType) {
    this.changeViewEmitter.emit(view);
  }


}
