import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'choose-theme',
  templateUrl: './choose-theme.component.html',
  styleUrls: ['./choose-theme.component.scss']
})
export class ChooseThemeComponent implements OnInit {

  isThemeSelected = false;
  constructor() { }

  ngOnInit() {
  }

  selectTheme(item) {
    this.isThemeSelected = true;
    
  }

}
