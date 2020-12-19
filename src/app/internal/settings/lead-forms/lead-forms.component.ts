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
    if(Array.isArray(res.data[0].formJson.components) && res.data[0].formJson.components.length){
        this.editForm = res.data[0] 
        this.form = res.data[0].formJson;       
        this.leadForm.patchValue({
            businessName: res.data[0].businessName
        });
        this.oldFile = this.file = this.logoUrl = res.data[0].businessLogo; // one is to display one is to store one is to compare
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
        // console.log("if name");
        this.formData.set("businessName", String(this.leadForm.value.businessName));  
    }
    else{
        // console.log("else name");
        this.formData.set("businessName", "");
    }
    if(this.file){
        // console.log("if logo");
        this.formData.set("businessLogo", this.file);
    }
    else{
        // console.log("else logo");
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
    this.formData.append("status", "PUBLISHED");
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
