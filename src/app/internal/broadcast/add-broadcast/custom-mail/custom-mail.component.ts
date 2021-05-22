import { MailTemplateData } from 'src/app/shared/models/mail-template.model';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { ApiUrl } from 'src/app/services/apiUrls';
import { TimeZones } from 'src/app/services/constants';
import { HttpService } from 'src/app/services/http.service';
import { EmailTemplateComponent } from 'src/app/shared/modals/email-template/email-template.component';
import { EditorContent } from 'src/app/shared/models/editor.model';
import { TableModel } from 'src/app/shared/models/table.common.model';
import { AngularEditorConfig } from '@kolkov/angular-editor';
declare type CurrentTabType = 'custom-mail' | 'themes' | 'code-your-own';

@Component({
  selector: 'custom-mail',
  templateUrl: './custom-mail.component.html',
  styleUrls: ['./custom-mail.component.scss']
})
export class CustomMailComponent implements OnInit {


  @Input('currentTab')
  currentTab: string;

  @Input('content')
  content: string;

  @Input('selectedTemplate')
  selectedTemplate:MailTemplateData;
  
  @Output('goBack')
  goBackEmitter = new EventEmitter();

  form: FormGroup;
  myModel: any;
  contacts: any = [];
  ckeConfig: any = EditorContent;
  signStatus = new FormControl();
  openTab = 1;
  dropdownSettings: any = {
      idField: '_id',
      textField: 'showName',
      itemsShowLimit: 2,
      allowSearchFilter: true,
      'disabled': true
  };
  isEdit = false;

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '25rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    uploadUrl: 'v1/images', // if needed
    customClasses: [ // optional
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  };

  constructor(public http: HttpService, public activeRoute: ActivatedRoute) {
      this.myModel = new TableModel();
      this.myModel.timeZones = TimeZones;
  }

  ngOnInit(): void {
      this.formInit();
      const routeParams = this.activeRoute.snapshot.params;
      if (routeParams.id) {
          this.myModel.id = routeParams.id;
          this.isEdit = true;
          this.myModel.data = this.http.getSavedData();
          this.fillValues(this.myModel.data);
      }
      this.contactList();
      this.templateList();
  }


  goBack() {
    if (this.currentTab == 'custom-mail') {
        this.http.goBack();
    } else {
        this.goBackEmitter.emit(true);
    }
  }


  formInit() {
      this.form = this.http.fb.group({
          subject: ['', Validators.required],
          content: ['', Validators.required],
          contactId: ['', Validators.required],
          previewLine: [''],
          timing: [new Date()],
          timingType: [''],
          timeZone: ['']
      });

      /* When user select theme or code your own theme then this will patch the content */
      if (this.currentTab == 'themes' && this.selectedTemplate) {
        this.form.patchValue({
            subject: this.selectedTemplate.subject,
            content: this.selectedTemplate.html,
        }) 
      }

      /* when user comes from code-your-own tab */
      if (this.currentTab == 'code-your-own' && this.content) {
        this.form.patchValue({
            content: this.content
        })
      }
    }

  fillValues(data) {
      this.form.patchValue({
          subject: data.subject,
          content: data.content,
          previewLine: data.previewLine,
          timingType: data.timingType,
          timeZone: data.timeZone
      });
      if (this.form.value.timingType === '2' || this.form.value.timingType === 2) {
          this.form.controls.timing.patchValue(new Date(data.timing));
      }
  }

  finalSubmit(status) {
      if (status === 1 || this.http.isFormValid(this.form)) {
          const obj: any = JSON.parse(JSON.stringify(this.form.value));
          obj.contactId = JSON.stringify(this.http.getIdsOnly(this.form.value.contactId));
          obj.status = status;
          // delete obj.timezone;
          if (this.isEdit) {
              obj.broadcastId = this.myModel.data._id;
          }
          this.http.openSnackBar(`Broadcast ${this.isEdit ? 'Updated' : 'Added'} Successfully`);
          this.http.postData(ApiUrl.ADD_BROADCAST, obj).subscribe(() => {
              this.http.navigate('broadcast');
          });
      }
  }

  contactList() {
      const obj: any = {
          skip: 0,
          limit: 100
      };
      this.http.getData(ApiUrl.CONTACTS, obj).subscribe(res => {
          this.myModel.contacts = res.data.data;
          this.myModel.totalItems = res.data.totalCount;
          res.data.data.forEach((val) => {
              this.http.checkLastName(val);
              if (val.email) {
                  val.showName = val.showName + ` (${val.email})`;
              }
          });
          if (this.isEdit) {
              this.form.controls.contactId.patchValue(this.http.selectedInArray(res.data.data, this.myModel.data.contactId));
          }
      });
  }

  selectTemplate(data) {
      this.form.patchValue({
          subject: data.subject,
          content: data.html
      });
  }

  templateList() {
      const obj = {
          skip: 0,
          limit: 30
      };
      this.http.getData(ApiUrl.TEMPLATE_LIST, obj).subscribe(res => {
          this.myModel.templates = res.data.data;
      });
  }

  openTemplate() {
      const obj: any = {
          isBroadcast: true
      };
      const modalRef = this.http.showModal(EmailTemplateComponent, 'more-lg', obj);
      modalRef.content.onClose = new Subject<boolean>();
      modalRef.content.onClose.subscribe(res => {
          this.form.patchValue({
              subject: res.subject,
              content: res.html
          });
      });
  }
}
