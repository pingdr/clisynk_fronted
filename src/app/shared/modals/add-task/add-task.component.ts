import {Component, OnInit} from '@angular/core';
import {FormGroup, Validators} from '@angular/forms';
import {HttpService} from '../../../services/http.service';
import {TableModel} from '../../models/table.common.model';
import {ApiUrl} from '../../../services/apiUrls';
import {Subject} from 'rxjs';
import * as moment from 'moment';

@Component({
    selector: 'app-add-task',
    templateUrl: './add-task.component.html',
    styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent implements OnInit {

    form: FormGroup;
    allData;
    myModel: any;
    modalData: any;
    public onClose: Subject<boolean>;
    contacts: any = [];
    isSelected = false;
    isEdit = false;
    today = new Date();
    constructor(public http: HttpService) {
        this.myModel = new TableModel();
    }

    ngOnInit(): void {
        this.formInit();
        if (this.modalData) {
            this.isEdit = true;
            this.fillValues();
        }
        this.createSlots();
        this.contactList();
    }

    deleteTask(template) {
        this.http.showModal(template, 'xs');
    }

    createSlots() {
        let slotTime = moment(this.isEdit ? new Date(new Date(this.modalData.dueDateTime).setDate(new Date().getDate())) : new Date(), 'HH:mm a');
        const endTime = moment('24:00 pm', 'HH:mm a');
        let selectedIndex = 0;
        while (slotTime < endTime) {
            this.myModel.timeSlots.push(moment(slotTime));
            if (this.isEdit) {
                if (moment(slotTime).format('hh:mm a') === moment(this.modalData.dueDateTime).format('hh:mm a')) {
                    this.form.controls.selectedSlot.patchValue(this.myModel.timeSlots[selectedIndex]);
                }
            } else {
                this.form.controls.selectedSlot.patchValue(this.myModel.timeSlots[0]);
            }
            slotTime = slotTime.add(15, 'minutes');
            selectedIndex++;
        }
    }

    finalSubmit() {
        const obj: any = JSON.parse(JSON.stringify(this.form.value));
        const hh: any = moment(this.form.value.selectedSlot).format('HH');
        const mm: any = moment(this.form.value.selectedSlot).format('mm');
        obj.dueDateTime = new Date(obj.dueDateTime).setHours(hh, mm);
        delete obj.selectedSlot;

        if (this.form.value.contactId.length) {
            obj.contactId = JSON.stringify(this.http.getIdsOnly(this.form.value.contactId));
        }

        if (this.isEdit) {
            obj.taskId = this.modalData._id;
        }
        obj.timeZone = this.http.getTimeZone();
        if (this.http.isFormValid(this.form)) {
            this.myModel.loader = true;
            this.http.postData(ApiUrl.ADD_TASK, obj).subscribe(() => {
                this.http.hideModal();
                this.myModel.loader = false;
                this.isEdit ? this.http.openSnackBar('Task Updated Successfully') : this.http.openSnackBar('Task Added Successfully');
                this.http.eventSubject.next({eventType: 'addTask'});
            }, () => {
                this.myModel.loader = false;
            });
        }
    }

    contactList(search?) {
        this.isSelected = false;
        const obj: any = {
            skip: 0,
            limit: 100,
            search: search ? search : ''
        };
        this.http.getData(ApiUrl.CONTACTS, obj).subscribe(res => {
                    res.data.data.forEach((val) => {
                        this.http.checkLastName(val);
                        if (val.email) {
                            val.showName = val.showName + ` (${val.email})`;
                        }
                        if (this.isEdit) {
                            if (this.modalData.contactId && this.modalData.contactId._id === val._id) {
                                this.form.controls.contactId.patchValue([val]);
                            }
                        }
                    });
                    this.contacts = res.data.data;
                },
                () => {
                });
    }

    formInit() {
        this.form = this.http.fb.group({
            contactId: ['', Validators.required],
            note: [''],
            title: ['', Validators.required],
            dueDateTime: [new Date(), Validators.required],
            reminderType: [''],
            selectedSlot: ['', Validators.required]
        });
    }

    fillValues() {
        this.form.patchValue({
            title: this.modalData.title,
            note: this.modalData.note,
            reminderType: this.modalData.reminderType,
        });
        if (this.modalData.dueDateTime) {
            this.form.controls.dueDateTime.patchValue(new Date(this.modalData.dueDateTime));
        }
    }

    changeStatus(status) {
        const obj = {
            status: status,
            taskId: this.modalData._id
        };
        this.http.hideModal();
        this.http.getData(ApiUrl.UPDATE_TASK, obj).subscribe(() => {
            if (status === 2) {
                this.http.openSnackBar('Task Completed Successfully');
            } else {
                this.http.openSnackBar('Task Deleted Successfully');
            }
            this.http.eventSubject.next({eventType: 'addTask'});
        });
    }

}
