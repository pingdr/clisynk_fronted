import {Component, OnInit} from '@angular/core';
import {HttpService} from '../../../services/http.service';
import {Subject, Subscription} from 'rxjs';
import {ApiUrl} from '../../../services/apiUrls';

@Component({
    selector: 'app-upload',
    templateUrl: './upload.component.html'
})
export class UploadComponent implements OnInit {

    modalData: any;
    public onClose: Subject<boolean>;
    loading = false;
    subscription: Subscription;

    constructor(public http: HttpService) {
        this.subscription = this.http.loaderStatus.subscribe(status => {
            this.loading = status;
        });
    }

    ngOnInit(): void {
    }

    goBack() {
        this.http.hideModal();
        this.http.openModal('sendEmail', this.modalData);
    }

    uploadImage(file) {
        this.http.uploadImage(ApiUrl.UPLOAD_IMAGE, file, true).subscribe(res => {
            this.modalData.filesData.push({
                original: res.data.original,
                thumbnail: res.data.thumbnail,
                ext: res.data.ext,
                fileName: res.data.fileName
            });
            this.goBack();
        }, () => {
        });
    }

}
