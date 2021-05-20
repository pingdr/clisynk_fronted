import { Component, OnInit } from '@angular/core';


/**
 * @flow: User will select the theme then send the broadcast mail.
 */
 declare type ViewType = 'choose-theme' | 'mail';

@Component({
  selector: 'choose-theme',
  templateUrl: './choose-theme.component.html',
  styleUrls: ['./choose-theme.component.scss']
})
export class ChooseThemeComponent implements OnInit {

  showView: ViewType = "choose-theme";
  constructor() { }

  ngOnInit() {
  }

  changeView(view: ViewType) {
    this.showView = view;
  }

}
