import { BsModalRef } from 'ngx-bootstrap/modal';
import {ChangeDetectorRef, Component, NgZone, OnInit} from '@angular/core';
import {FormGroup, Validators} from '@angular/forms';
import {HttpService} from '../../../services/http.service';
import {TableModel} from '../../models/table.common.model';
import {ApiUrl} from '../../../services/apiUrls';
import {EditorContent} from '../../models/editor.model';
import {forkJoin, Subject} from 'rxjs';
import {DeleteComponent} from '../delete/delete.component';
import {AppointmentService} from '../../../internal/appointments/appointment.service';
import { map, mergeMap, toArray } from 'rxjs/operators';

declare var CKEDITOR: any;
@Component({
    selector: 'app-email-template',
    templateUrl: './email-template.component.html'
})
export class EmailTemplateComponent implements OnInit {

    form: FormGroup;
    allData;
    myModel: any;
    modalData: any;
    templates: any[] = [];
    ckeConfig: any = EditorContent;

    public onClose: Subject<boolean>;
    selectedTemplate: any = {};

    constructor(public http: HttpService, public appoint: AppointmentService) {
        this.myModel = new TableModel();
        this.ckeConfig.height = '370px';
    }


    ngOnInit(): void {
        this.formInit();
        this.templateList();
        this.getAppointments();
    }

    templateList() {
        const obj = {
            skip: 0,
            limit: 30
        };
        // this.http.getData(ApiUrl.TEMPLATE_LIST, obj).subscribe(res => {
        //     this.templates = res.data.data;
        //     this.selectedTemplate = this.templates[0];
        //     this.selectTemplate(this.templates[0]);
        // }, () => {
        // });

        this.http.getMailTemplates().subscribe(res => {
            let allTemplates: {name:string, _id:string}[] = res.data;
            const requests: any[] = [];
            allTemplates.forEach(template => {
                requests.push(this.http.getMailTemplateById(template._id));
            })
            forkJoin(requests)
            .subscribe((res: any[]) => {
                this.templates = res.map(x => x.data)
            })
        })
        console.log(this.templates);

    }

    formInit() {
        this.form = this.http.fb.group({
            name: ['New Template', Validators.required],
            subject: ['subject', Validators.required],
            html: ['Hi! This is your content area.']
        });
    }

    goBackToEmail(data?) {
        this.http.hideModal();
        this.http.openModal('sendEmail', data);
    }

    insertTemplate() {
        if (this.modalData && this.modalData.isBroadcast) {
            this.onClose.next(this.selectedTemplate);
        } else if (this.modalData && this.modalData.fromPipeline) {
            this.http.hideModal();
            this.http.showModal('PipelineSendEmailComponent', this.selectedTemplate);
        } else {
            this.modalData = this.selectedTemplate;
            this.goBackToEmail(this.modalData);
        }
    }

    selectTemplate(data) {
        this.selectedTemplate = data;
        this.form.patchValue({
            name: this.selectedTemplate.name,
            subject: this.selectedTemplate.subject,
            html: this.selectedTemplate.html
        });
    }

    finalSubmit(isNew?) {
        if (this.http.isFormValid(this.form)) {
            const obj: any = this.form.value;
            isNew ? obj.name = 'New template' : obj.templateId = this.selectedTemplate._id;
            this.http.postData(ApiUrl.ADD_EMAIL_TEMPLATE, obj).subscribe(() => {
                this.templateList();
            }, () => {
            });
        }
    }

    addLink(data) {
        const tempContent = this.form.value.html + `<br><a style="color:blue">${this.appoint.getBookingLink(data.name)}</a><br>`;
        this.form.controls.html.patchValue(tempContent);
        this.finalSubmit(false);
    }

    getAppointments() {
        this.http.getData(ApiUrl.APPOINTMENT_LIST_TYPES, {}).subscribe(res => {
            this.myModel.appointmentTypes = res.data;
        });
    }

    deleteTemplate() {
        const obj: any = {
            type: 6,
            key: 'id',
            title: 'Delete template?',
            message: 'Once you delete this template, it\'s gone forever.',
            id: this.selectedTemplate._id
        };
        const modalRef = this.http.showModal(DeleteComponent, 'xs', obj);
        modalRef.content.onClose = new Subject<boolean>();
        modalRef.content.onClose.subscribe(() => {
            this.templateList();
            this.form.patchValue({
                name: '',
                subject: '',
                html: ''
            });
        });
    }

}
