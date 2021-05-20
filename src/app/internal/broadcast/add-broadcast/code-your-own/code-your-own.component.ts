import { Component, OnInit } from '@angular/core';

/**
 * @flow: 
 *  1. User will click or paste the code.
 *  2. Edit the code then save as a theme or can redirect to the send
 *  
 */
declare type viewType = 'paste-in' | 'edit-code' | 'mail';
@Component({
  selector: 'code-your-own',
  templateUrl: './code-your-own.component.html',
  styleUrls: ['./code-your-own.component.scss']
})
export class CodeYourOwnComponent implements OnInit {
  
  
  showView: viewType = 'paste-in';
  constructor() { }

  ngOnInit() {
    
  }

  changeView(view: viewType) {
    this.showView = view;
  }
}
