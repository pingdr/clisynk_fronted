import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-lead-forms',
  templateUrl: './lead-forms.component.html',
  styleUrls: ['./lead-forms.component.css']
})
export class LeadFormsComponent implements OnInit {

  leadForm = this.fb.group({
    businessname:[null, [Validators.required]],
    firstname: [null,[Validators.required]],
    lastname: [null,[Validators.required]],
    emailaddress: [null,[Validators.required, Validators.email]],
    phone: [null],
    phoneType: ["Personal"],
    note: [null]
  })

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
  }

  onSubmit(){
    console.log(this.leadForm.value.phoneType);
  }
  
}
