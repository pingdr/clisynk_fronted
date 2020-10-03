import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpService} from '../../../services/http.service';
import {ApiUrl} from '../../../services/apiUrls';
import {Subject} from 'rxjs';
import {TableModel} from '../../../shared/models/table.common.model';
import {EditorContent} from '../../../shared/models/editor.model';
import {TimeZones} from '../../../services/constants';
import {ActivatedRoute} from '@angular/router';
import {EmailTemplateComponent} from '../../../shared/modals/email-template/email-template.component';
import { ContactsModule } from '../../contacts/contacts.module';

@Component({
    selector: 'app-add-broadcast',
    templateUrl: './add-broadcast.component.html'
})
export class AddBroadcastComponent implements OnInit {

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
