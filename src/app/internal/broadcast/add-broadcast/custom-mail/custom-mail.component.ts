import { Component, OnInit } from '@angular/core';
import { EditorContent } from 'src/app/shared/models/editor.model';

@Component({
  selector: 'custom-mail',
  templateUrl: './custom-mail.component.html',
  styleUrls: ['./custom-mail.component.scss']
})
export class CustomMailComponent implements OnInit {

  ckeConfig: any = EditorContent;

  constructor() { }

  ngOnInit() {
  }

}
