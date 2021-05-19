import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-edit-code',
  templateUrl: './edit-code.component.html',
  styleUrls: ['./edit-code.component.css'],
  providers: []
})
export class EditCodeComponent implements OnInit {

  @ViewChild('iframe', {static: true}) iframe: ElementRef
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
}
