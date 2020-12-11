import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { HttpService } from 'src/app/services/http.service';
import { LeadFormCreateComponent } from 'src/app/shared/modals/lead-form-create/lead-form-create.component';

@Component({
  selector: 'app-lead-forms',
  templateUrl: './lead-forms.component.html',
  styleUrls: ['./lead-forms.component.css']
})
export class LeadFormsComponent implements OnInit {

  // leadForm = this.fb.group({
  //   businessname:[null, [Validators.required]],
  //   firstname: [null,[Validators.required]],
  //   lastname: [null,[Validators.required]],
  //   emailaddress: [null,[Validators.required, Validators.email]],
  //   phone: [null],
  //   phoneType: ["Personal"],
  //   note: [null]
  // })

  obj = {
    "name":"Smartform1",
    "description":"Test Description",
    "formJson":{
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
    },
      "tags":["lead"]
  }

  async getLeadForm(){
    let gotForm = false;  
    const res = await this.http.getLeadForm().toPromise();
    console.log(res);
    
    console.log(res.data[0].formJson.components.length);
    if(res.data[0].formJson != {} && res.data[0].formJson.components.length){
        // console.log("hi");
        this.editForm = res.data[0] 
        this.form = res.data[0].formJson;
        gotForm = true;
    }
    else if(!gotForm){
        this.http.postSmartForm(this.obj).subscribe(res =>{
            // console.log("hello");
            console.log(res);
            this.editForm = res["data"];
            this.form = res["data"].formJson
        })
    }
  }

  onPreview(){
      this.http.leadToPreview(this.form);
  }

  public editForm = {};

  public form: Object = {
    // "components": [
    //     {
    //         "label": "First Name",
    //         "placeholder": "First Name",
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
    //         "placeholder": "Last Name",
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
    //         "placeholder": "Email Address",
    //         "tableView": true,
    //         "validate": {
    //             "required": true
    //         },
    //         "key": "emailAddress",
    //         "type": "textfield",
    //         "input": true
    //     },
    //     {
    //       "label": "Phone",
    //         "placeholder": "Phone",
    //         "tableView": true,
    //         "validate": {
    //             "required": true
    //         },
    //         "key": "phone",
    //         "type": "phoneNumber",
    //         "input": true
    //   },
    //     {
    //         "label": "Phone Type",
    //         "placeholder": "Type",
    //         "widget": "choicesjs",
    //         "tableView": true,
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
    //         "placeholder": "Add a note here..",
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
  };

//   formToBeSend = this.form;

  onEdit(data?) {
    console.log(this.editForm);
    const modalRef = this.http.showModal(LeadFormCreateComponent, 'custom-class-for-create-smart-form', this.editForm,);
    modalRef.content.onClose = new Subject<boolean>();
    modalRef.content.onClose.subscribe(() =>{
        this.getLeadForm();
    })
  }

  constructor(private fb: FormBuilder, public http: HttpService) { }

  ngOnInit() {
    this.getLeadForm();
  }

  // onSubmit(){
    
  // }
  
}
