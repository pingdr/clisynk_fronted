import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { Subject } from 'rxjs';
import { HttpService } from 'src/app/services/http.service';
import { LeadFormCreateComponent } from 'src/app/shared/modals/lead-form-create/lead-form-create.component';

@Component({
  selector: 'app-lead-forms',
  templateUrl: './lead-forms.component.html',
  styleUrls: ['./lead-forms.component.css']
})
export class LeadFormsComponent implements OnInit {

  leadForm = this.fb.group({
    businessName:[null, [Validators.required]],
    logo:['', [ 
        RxwebValidators.image({ maxHeight: 300,maxWidth: 300 }),
        RxwebValidators.extension({ extensions: ["jpeg","png","tiff"] })
        ]       
    ],
  })

  obj = {
    "name":"Smartform1",
    "description":"Test Description",
    "formJson":{
        "components": [
        {
            "label": "First Name",
            "tableView": true,
            "validate": {
                "required": true,
                "maxLength": 40
            },
            "key": "firstName",
            "type": "textfield",
            "input": true
        },
        {
            "label": "Last Name",
            "tableView": true,
            "validate": {
                "required": true,
                "maxLength": 40
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
      "tags":["lead"],
      "businessName":"Tesla",
      "businessLogo":"data:image/png;base64,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"
  }

  formData = new FormData();

  logoUrl: any;
  loader: any;
  file: any = null;
  oldFile: any = null;
  copied = false;

  async getLeadForm(){
    this.loader = true;
    let gotForm = false;
    const res = await this.http.getLeadForm().toPromise();
    console.log(res);
    if(res.data[0].formJson.components.length){     //-----error prone
        this.editForm = res.data[0] 
        this.form = res.data[0].formJson;
        const { businessName } = res.data[0];        
        this.leadForm.patchValue({
            businessName: businessName
        });
        this.logoUrl = res.data[0].businessLogo;
        this.oldFile = this.file = res.data[0].businessLogo;
        this.loader = false;
        gotForm = true;
    }
    if(!gotForm){
        this.formData.append("name", "Smartform1");
        this.formData.append("description", "Test Description");
        this.formData.append("formJson", JSON.stringify({
            "components": [
            {
                "label": "First Name",
                "tableView": true,
                "validate": {
                    "required": true,
                    "maxLength": 40
                },
                "key": "firstName",
                "type": "textfield",
                "input": true
            },
            {
                "label": "Last Name",
                "tableView": true,
                "validate": {
                    "required": true,
                    "maxLength": 40
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
        }));
        this.formData.append("tags", JSON.stringify(["lead"]));
        this.http.postSmartForm(this.formData).subscribe(res =>{
            console.log(res);
            this.editForm = res["data"];
            this.form = res["data"].formJson;
            this.loader = false;
        }, () => {
            this.loader = false;
        })
    }
  }

  onPreview(){
    if(this.leadForm.value.businessName){
        console.log("if name");
        this.formData.set("businessName", String(this.leadForm.value.businessName));  
    }
    else{
        console.log("else name");
        this.formData.set("businessName", "");
    }
    if(this.file){
        console.log("if logo");
        this.formData.set("businessLogo", this.file);
    }
    else{
        console.log("else logo");
        this.formData.set("businessLogo", "");
    }
    if(this.oldFile == this.file){
        this.formData.delete("businessLogo");
    }
    this.http.updateLeadForm(this.formData, this.editForm._id).subscribe(res => {
        console.log(res);
    });
    if(!this.copied){
        this.router.navigate([]).then(result => {  window.open("/preview-leadform/" + this.editForm._id, '_blank'); });
    }
    this.copied = false;
  }


  public editForm: any;

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

  onEdit(data?) {
    console.log(this.editForm);
    const modalRef = this.http.showModal(LeadFormCreateComponent, 'custom-class-for-create-smart-form', this.editForm,);
    modalRef.content.onClose = new Subject<boolean>();
    modalRef.content.onClose.subscribe(() =>{
        this.getLeadForm();
    })
  }

  constructor(private fb: FormBuilder, public http: HttpService, public router: Router) { }

  ngOnInit() {
    this.getLeadForm();
    this.formData.append("businessName", "");
    this.formData.append("businessLogo", "");
  }

  onSubmit(){
    console.log(this.leadForm);
  }

  onImageChanged(event) {
        console.log(event.target.files);
        this.file = <File>event.target.files[0];
        if (event.target.files === 0){
            return;
        }
        else{
            const reader = new FileReader();
            console.log(this.file);
            reader.readAsDataURL(this.file); 
            reader.onload = (_event) => { 
                this.logoUrl = reader.result;
            }
            this.formData.set("businessLogo", this.file);
        }
    }

    copyLink(){
        this.copied = true;
        this.onPreview();
        const copy = document.createElement('textarea');
        copy.style.position = 'fixed';
        copy.style.left = '0';
        copy.style.top = '0';
        copy.style.opacity = '0';        
        copy.value = window.location.origin + "/preview-leadform/" + this.editForm._id;
        document.body.appendChild(copy);
        copy.focus();
        copy.select();
        document.execCommand('copy');
        document.body.removeChild(copy);
        this.http.openSnackBar('Form link copied successfully');
    }

    copyCode(){
        const copy = document.createElement('textarea');
        copy.style.position = 'fixed';
        copy.style.left = '0';
        copy.style.top = '0';
        copy.style.opacity = '0';      
        let object = {};
        // this.formData.forEach(function(value, key){
        //     object[key] = value;
        // });
        copy.value = JSON.stringify(this.editForm, null, 2);
        document.body.appendChild(copy);
        copy.focus();
        copy.select();
        document.execCommand('copy');
        document.body.removeChild(copy);
        this.http.openSnackBar('Code copied successfully');
    }

    removeLogo(){
        this.logoUrl = null;
        this.leadForm.controls['logo'].setValue(null);
        this.file = null;
        this.formData.set("businessLogo", "");
    }
  
}
