import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { ExtendedComponentSchema, FormBuilderComponent, FormioComponent, FormioForm } from 'angular-formio';

class FormBuilderChangeEvent  { 
    path: string
    index: number
    type:string
    component: ExtendedComponentSchema
    form:{ components: ExtendedComponentSchema[]}
    parent:{ components: ExtendedComponentSchema[]}
  }

@Component({
  selector: 'app-lead-form-create',
  templateUrl: './lead-form-create.component.html',
  styleUrls: ['./lead-form-create.component.css']
})
export class LeadFormCreateComponent implements OnInit {
      formInfo = this.fb.group({
          formName: [''],
          formDescription: ['']
      })
      modalData: any;
      public onClose: Subject<boolean>;
      public form: Object = {};
      formData = new FormData();

      private defaultForm: FormioForm = {
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
            "key": "email",
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
      };
      public tempForm:FormioForm;
      public formToBeSend: FormioForm;
      published = false;
      update = false;
      

      @ViewChild('myForm', {static: true}) 
      leadFormbuilder: FormBuilderComponent
  
      constructor(public http:HttpService, private fb: FormBuilder,public changeDetect: ChangeDetectorRef) { }
  
      ngOnInit() { 
        this.formData.append("businessName", "");
        if(this.modalData){
            this.updateForm(this.modalData);
        }
      }
      onUpdate(){
        // if(this.formToBeSend.){
        // }
        
        if(!this.formInfo.value.formDescription){
            this.formInfo.value.formDescription = "---";
        }
        // this.obj.name = this.formInfo.value.formName;
        // this.obj.description = this.formInfo.value.formDescription;
        // this.obj.formJson = this.formToBeSend;
        this.formData.set("businessName", this.formInfo.value.formName);
        this.formData.append("description", this.formInfo.value.formDescription);
        this.formData.append("formJson", JSON.stringify(this.formToBeSend));
        this.http.updateLeadForm(this.formData, this.modalData._id).subscribe(res => {
          console.log(res);
          this.onClose.next(true);
          this.http.updateSmartFormList();
        });
        this.http.hideModal();
        // if(this.update){
        //     this.obj.name = this.formInfo.value.formName;
        //     this.obj.description = this.formInfo.value.formDescription;
        //     this.obj.formJson = this.formToBeSend;
        //     this.obj.status = "PUBLISHED";
        //     console.log(this.obj);
        //     this.http.updateSmartForm(this.obj, this.modalData._id).subscribe(res => {
        //         console.log(res);
        //         this.onClose.next(true);
        //         this.http.updateSmartFormList();
        //     });
        //     this.published = true;
        //     this.update = false;
        // }
        // // console.log(this.formInfo.value.formName);
        // else{
        //     if(!this.formInfo.value.formDescription){
        //         this.formInfo.value.formDescription = "---";
        //     }
        //     this.obj.name = this.formInfo.value.formName;
        //     this.obj.description = this.formInfo.value.formDescription;
        //     this.obj.formJson = this.formToBeSend;
        //     this.obj.status = "PUBLISHED";
        //     console.log(this.obj);
        //     // this.objTest.resultJson = this.formToBeSend;
        //     // console.log(this.objTest);
        //     // const obj = {
        //     //     "name":"Smartform1",
        //     //     "description":"Test Description",
        //     //     "formJson": {components :{
        
        //     //     }}
        //     // }
        //     this.http.submitSmartForm(this.obj).subscribe(res => {
        //         console.log(res);
        //         this.onClose.next(true);
        //         this.http.updateSmartFormList();
        //     });
        //     this.published = true;
        // }
      }
  
  
      updateForm(data){
          console.log(data);
          if(data.name || data.description){
            this.formToBeSend = this.form = data.formJson;
            this.tempForm = data.formJson;
            const { businessName, description } = data;
              this.formInfo.patchValue({
                  formName: businessName, 
                  formDescription: description
              });
          }
          else{
            this.formToBeSend = this.form = data.formJson;
            this.tempForm = data.formJson;
            this.formInfo.patchValue({
              formName: "Untitled Form", 
              formDescription: "---"
            });
          }
        // console.log(this.formInfo);
        this.update = true;
      }
    
      onChange(event: FormBuilderChangeEvent) {
        console.log(event);
        // console.log(myForm);
        let tempForm: FormioForm = this.getDefaultForm(); 
        let currentFormComponent: ExtendedComponentSchema[] = event.form.components;
        let extraComponents: { index: number, component : ExtendedComponentSchema}[] = [];
        if(event.type == "deleteComponent")
        {
          let deltedComp = event.component;
          let deltedCompIndex = event.index;
          if(tempForm.components.find(x => x.key == event.component.key)){
            // Default component is deleted.
            console.log("default deleted");
            // rebuild form
            // TODO: find out what is extra component from currentFormComponet with their index numbers
              currentFormComponent.forEach((c, i) => {
                  let exists = tempForm.components.find(x => x.key == c.key);
                   if(!exists) { extraComponents.push( {index: i, component: c });}
                })
            // TODO: insert extra component at their respective index places.
            console.log("Extra Components" + JSON.stringify(extraComponents))
              extraComponents.forEach(x => {
                tempForm.components.splice(x.index, 0, x.component);
              })
            
            this.leadFormbuilder.rebuildForm(tempForm);
          }else {
            // Extra Component is deleted.
            
            this.leadFormbuilder.rebuildForm(event.form);
            console.log("extra deleted");
          }
        } else {
          console.log("----")
        }
        // if((event.type == "deleteComponent") && (event.component.key == "firstName" || event.component.key == "lastName" || event.component.key == "emailAddress" || event.component.key == "phone" || event.component.key == "phoneType" || event.component.key == "addNote" || event.component.key == "submit")){
        //   console.log("deleted");
        //   currentFormComponent.forEach(c => {
        //     let exists = this.defaultForm.components.find(x => x.key == c.key);
        //      if(!exists) { extraComponents.push(exists);}
        //   })
          

        //  this.defaultForm.components.push(...extraComponents)
        //  this.myForm.rebuildForm(this.defaultForm);
        //  //  alert("You can not delete default form components");
        //   // this.form = this.tempForm;
        //   // this.formToBeSend = this.tempForm; 

        //   // this.changeDetect.detectChanges();
        // }
        // else if(event.form){
        //   this.formToBeSend = event.form;
        //   this.tempForm = event.form;
        //   // console.log(this.formToBeSend);
        // }
      }

 
      onDraft(){
        // if(this.update){
        //     if(!this.published){
        //         this.obj.name = this.formInfo.value.formName;
        //         this.obj.description = this.formInfo.value.formDescription;
        //         this.obj.formJson = this.formToBeSend;
        //         this.obj.status = "DRAFT";
        //         console.log(this.obj);
        //         this.http.updateSmartForm(this.obj, this.modalData._id).subscribe(res => {
        //             this.onClose.next(true);
        //             this.http.updateSmartFormList();
        //         });
        //     }
        //     this.update = false;
        // }
        // else{
        //     if(!this.published){
        //         if(!this.formInfo.value.formName && !this.formInfo.value.formDescription){
        //             this.obj.name = "Untitled Form";
        //             this.obj.description = "---";
        //         }
        //         else if(!this.formInfo.value.formName){
        //             this.obj.name = "Untitled Form";
        //             this.obj.description = this.formInfo.value.formDescription;
        //         }
        //         else if(!this.formInfo.value.formDescription){
        //             this.obj.name = this.formInfo.value.formName;
        //             this.obj.description = "---";
        //         }
        //         else{
        //             this.obj.name = this.formInfo.value.formName;
        //             this.obj.description = this.formInfo.value.formDescription;
        //         }
        //         this.obj.formJson = this.formToBeSend;
        //         this.obj.status = "DRAFT";
        //         console.log(this.obj);
        //         this.http.postSmartForm(this.obj).subscribe(res => {
        //             console.log(res);
        //             this.onClose.next(true);
        //             this.http.updateSmartFormList();
        //         });
        //     }}
      }
      private getDefaultForm() {
        return {
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
              "key": "email",
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
      }
}
