import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-preview-leadform',
  templateUrl: './preview-leadform.component.html',
  styleUrls: ['./preview-leadform.component.css']
})
export class PreviewLeadformComponent implements OnInit {

  constructor(public http: HttpService) { }

  getForm(){
      this.form = this.http.leadFormJson;
  }

  ngOnInit() {
      this.getForm();
  }

  public form: Object = {};

    //    "components": [
    //     {
    //         "label": "First Name",
    //         "tableView": true,
    //         "validate": {
    //             "required": true
    //         },
    //         "key": "firstName",
    //         "type": "textfield",
    //         "input": true
    //     },
    //     {
    //         "label": "Last Name",
    //         "tableView": true,
    //         "validate": {
    //             "required": true
    //         },
    //         "key": "lastName",
    //         "type": "textfield",
    //         "input": true
    //     },
    //     {
    //         "label": "Email Address",
    //         "tableView": true,
    //         "validate": {
    //             "required": true
    //         },
    //         "key": "emailAddress",
    //         "type": "textfield",
    //         "input": true
    //     },
    //     {
    //         "label": "Phone",
    //         "placeholder": "Phone",
    //         "tableView": true,
    //         "validate": {
    //             "required": true
    //         },
    //         "key": "phone",
    //         "type": "phoneNumber",
    //         "input": true
    //     },
    //     {
    //         "label": "Phone Type",
    //         "widget": "choicesjs",
    //         "tableView": true,
    //         "defaultValue": "office",
    //         "data": {
    //             "values": [
    //                 {
    //                     "label": "Personal",
    //                     "value": "personal"
    //                 },
    //                 {
    //                     "label": "Office",
    //                     "value": "office"
    //                 },
    //                 {
    //                     "label": "Home",
    //                     "value": "home"
    //                 },
    //                 {
    //                     "label": "Other",
    //                     "value": "other"
    //                 }
    //             ]
    //         },
    //         "selectThreshold": 0.3,
    //         "key": "phoneType",
    //         "type": "select",
    //         "indexeddb": {
    //             "filter": {}
    //         },
    //         "input": true
    //     },
    //     {
    //         "label": "Add Note",
    //         "autoExpand": false,
    //         "tableView": true,
    //         "key": "addNote",
    //         "type": "textarea",
    //         "input": true
    //     },
    //     {
    //         "type": "button",
    //         "label": "Submit",
    //         "key": "submit",
    //         "disableOnInvalid": true,
    //         "input": true,
    //         "tableView": false
    //     }
    // ]
}
