import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-preview-smartform',
  templateUrl: './preview-smartform.component.html',
  styleUrls: ['./preview-smartform.component.css']
})
export class PreviewSmartformComponent implements OnInit {

  constructor(public http: HttpService, public route: ActivatedRoute) { }

  loader = false;

  obj = { 
    smartFormId:"",
    resultJson: {
      addNote: "",
      emailAddress: "",
      firstName: "",
      lastName: "",
      phone: "",
      phoneType: ""
    }
  }

  formName: string;

  getForm(){    
    this.form = {
      "components": [
        {
            "label": "First Name",
            "tableView": true,
            "validate": {
                "required": true
            },
            "key": "firstName",
            "type": "textfield",
            "input": true
        },
        {
            "label": "Last Name",
            "tableView": true,
            "validate": {
                "required": true
            },
            "key": "lastName",
            "type": "textfield",
            "input": true
        },
        {
            "label": "Email Address",
            "tableView": true,
            "validate": {
                "required": true
            },
            "key": "emailAddress",
            "type": "textfield",
            "input": true
        },
        {
            "label": "Phone",
            "placeholder": "Phone",
            "tableView": true,
            "validate": {
                "required": true
            },
            "key": "phone",
            "type": "phoneNumber",
            "input": true
        },
        {
            "label": "Phone Type",
            "widget": "choicesjs",
            "tableView": true,
            "defaultValue": "office",
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
            "selectThreshold": 0.3,
            "key": "phoneType",
            "type": "select",
            "indexeddb": {
                "filter": {}
            },
            "input": true
        },
        {
            "label": "Add Note",
            "autoExpand": false,
            "tableView": true,
            "key": "addNote",
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
    }
    // if(this.http.leadFormJson['formJson']){
    //   this.form = this.http.leadFormJson['formJson'];
    //   this.obj.smartFormId = this.http.leadFormJson['_id'];
    // }
    // else 
    {
      this.loader = true; 
      this.http.getLeadFormById(this.route.snapshot.paramMap.get('id')).subscribe(res => {  
        console.log(res);
        if(res.data.formJson.components.length){
            // console.log(res);
            this.obj.smartFormId = res.data._id
            this.form = res.data.formJson;
            this.formName = res.data.name
            this.loader = false;
        }
      }, () => {
          this.loader = false;
      });
    }
  }

  ngOnInit() {
    this.getForm();
  }

  public form: Object = {};

  onSubmit(event){
    // console.log(event.data);
    // this.obj.resultJson.addNote = event.data.addNote;
    // this.obj.resultJson.emailAddress = event.data.emailAddress;
    // this.obj.resultJson.firstName = event.data.firstName;
    // this.obj.resultJson.lastName = event.data.lastName;
    // this.obj.resultJson.phone = event.data.phone;
    // this.obj.resultJson.phoneType = event.data.phoneType;
    // this.http.postLeadForm(this.obj).subscribe(res => {
    //   console.log(res);
    // })    
  }

}
