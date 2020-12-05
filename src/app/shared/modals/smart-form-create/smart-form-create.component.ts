import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-smart-form-create',
  templateUrl: './smart-form-create.component.html',
  styleUrls: ['./smart-form-create.component.css']
})
export class SmartFormCreateComponent implements OnInit {
//   @ViewChild('json') jsonElement?: ElementRef;
//   @ViewChild('formName', { static: false }) formName;
    formInfo = this.fb.group({
        formName: ['', Validators.required],
        formDescription: ['']
    })
    modalData: any;
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
    
    public formToBeSend = this.form;
    obj = {
        name: '',
        description: '',
        formJson: {}
    }
    published = false;
    update = false;

  getSmartFormData(){
      this.http.getSmartForm().subscribe(res => {
        console.log(res);
    });
  }  

  onPublish(){
    if(this.update){
        this.obj.name = this.formInfo.value.formName;
        this.obj.description = this.formInfo.value.formDescription;
        this.obj.formJson = this.formToBeSend;
        console.log(this.obj);
        this.http.updateSmartForm(this.obj, this.modalData._id).subscribe(res => {
            console.log(res);
        });
        this.published = true;
        this.update = false;
    }
    // console.log(this.formInfo.value.formName);
    else{
        if(!this.formInfo.value.formDescription){
            this.formInfo.value.formDescription = "---";
        }
        this.obj.name = this.formInfo.value.formName;
        this.obj.description = this.formInfo.value.formDescription;
        this.obj.formJson = this.formToBeSend;
        console.log(this.obj);
        // const obj = {
        //     "name":"Smartform1",
        //     "description":"Test Description",
        //     "formJson": {components :{
    
        //     }}
        // }
        this.http.postSmartForm(this.obj).subscribe(res => {
            console.log(res);
        });
        this.published = true;
    }
  }

  onDraft(){
    if(this.update){
        if(!this.published){
            // if(!this.formInfo.value.formName && !this.formInfo.value.formDescription){
            //     this.obj.name = "Untitled Form";
            //     this.obj.description = "---";
            // }
            // else if(!this.formInfo.value.formName){
            //     this.obj.name = "Untitled Form";
            //     this.obj.description = this.formInfo.value.formDescription;
            // }
            // else if(!this.formInfo.value.formDescription){
            //     this.obj.name = this.formInfo.value.formName;
            //     this.obj.description = "---";
            // }
            // else{
            this.obj.name = this.formInfo.value.formName;
            this.obj.description = this.formInfo.value.formDescription;
            this.obj.formJson = this.formToBeSend;
            this.obj.formJson = this.formToBeSend;
            console.log(this.obj);
            this.http.updateSmartForm(this.obj, this.modalData._id).subscribe(res => {
                console.log(res);
            });
        }
        this.update = false;
    }
    else{
        if(!this.published){
            if(!this.formInfo.value.formName && !this.formInfo.value.formDescription){
                this.obj.name = "Untitled Form";
                this.obj.description = "---";
            }
            else if(!this.formInfo.value.formName){
                this.obj.name = "Untitled Form";
                this.obj.description = this.formInfo.value.formDescription;
            }
            else if(!this.formInfo.value.formDescription){
                this.obj.name = this.formInfo.value.formName;
                this.obj.description = "---";
            }
            else{
                this.obj.name = this.formInfo.value.formName;
                this.obj.description = this.formInfo.value.formDescription;
                this.obj.formJson = this.formToBeSend;
            }
            this.obj.formJson = this.formToBeSend;
            console.log(this.obj);
            this.http.postSmartForm(this.obj).subscribe(res => {
                console.log(res);
            });
        }}
  }

  updateForm(data){
      console.log(data);
      this.form = data.formJson;
      const { name, description } = data;
        this.formInfo.patchValue({
        formName: name, 
        formDescription: description
        });
    // this.formToBeSend = this.form
    console.log(this.formInfo);
    this.update = true;
  }

  onChange(event) {
    // console.log(event);
    // this.JsonRef.nativeElement.innerHTML = '';
    // this.JsonRef.nativeElement.appendChild(document.createTextNode(JSON.stringify(event.form, null, 2)));
    this.formToBeSend = event.form;
    console.log(this.formToBeSend);
  }
  
  constructor(public http:HttpService, private fb: FormBuilder) { }

  ngOnInit() {
    this.getSmartFormData();  
    if(this.modalData){
        this.updateForm(this.modalData);
    }
  }
}
