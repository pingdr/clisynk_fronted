import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-smart-form-create',
  templateUrl: './smart-form-create.component.html',
  styleUrls: ['./smart-form-create.component.css']
})
export class SmartFormCreateComponent implements OnInit {
  // @ViewChild('json') jsonElement?: ElementRef;
  @ViewChild('json', { static: false }) JsonRef;

  public form: Object = {
    components: [
      {
        "label": "First Name",
        "placeholder": "First Name",
        "tableView": true,
        "validateOn": "blur",
        "validate": {
            "required": true
        },
        "key": "firstName",
        "type": "textfield",
        "input": true
    },
    {
        "label": "Last Name",
        "placeholder": "Last Name",
        "tableView": true,
        "validateOn": "blur",
        "validate": {
            "required": true
        },
        "key": "lastName",
        "type": "textfield",
        "input": true
    },
    {
        "label": "Email address",
        "placeholder": "Email address",
        "tableView": true,
        "validateOn": "blur",
        "validate": {
            "required": true,
            "pattern": "/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$/",
            "unique": true
        },
        "unique": true,
        "key": "emailAddress1",
        "type": "email",
        "input": true
    },
    {
        "label": "Phone",
        "placeholder": "Phone",
        "tableView": true,
        "validate": {
            "unique": true
        },
        "unique": true,
        "errorLabel": "Invalid phone number",
        "key": "phone",
        "type": "phoneNumber",
        "labelWidth": 20,
        "input": true
    },
    {
        "label": "Type",
        "widget": "choicesjs",
        "placeholder": "Type",
        "tableView": true,
        "data": {
            "values": [
                {
                    "label": "Personal",
                    "value": "personal"
                },
                {
                    "label": "Office",
                    "value": "office"
                },
                {
                    "label": "Home",
                    "value": "home"
                },
                {
                    "label": "Other",
                    "value": "other"
                }
            ]
        },
        "dataType": "string",
        "selectThreshold": 0.3,
        "key": "type",
        "type": "select",
        "indexeddb": {
            "filter": {}
        },
        "input": true
    },
    {
        "label": "Note",
        "placeholder": "Add a note here..",
        "autoExpand": false,
        "tableView": true,
        "key": "note",
        "type": "textarea",
        "input": true
    },
    {
        "type": "button",
        "label": "Submit",
        "key": "submit",
        "disableOnInvalid": true,
        "input": true,
        "tableView": false
    }
    ]
  };

  onChange(event) {
    console.log(event)
    this.JsonRef.nativeElement.innerHTML = '';
    this.JsonRef.nativeElement.appendChild(document.createTextNode(JSON.stringify(event.form, null, 2)));
  }

  constructor(public http:HttpService) { }

  ngOnInit() {
  }

}
