import {Component, OnInit} from '@angular/core';
import {smoothlyMenu} from '../../app.helpers';
import {HttpService} from '../../services/http.service';
import {FormControl, FormGroup} from '@angular/forms';
import {ApiUrl} from '../../services/apiUrls';
import {ContactDetailsComponent} from '../../shared/modals/contact-details/contact-details.component';
import {AddContactComponent} from '../../shared/modals/add-contact/add-contact.component';
import {LogoutComponent} from '../../shared/modals/logout/logout.component';
import * as moment from 'moment';
import $ from 'jquery';

declare var jQuery: any;
import {interval} from 'rxjs';

@Component({
    selector: 'app-top-nav-bar',
    templateUrl: 'topNavBar.html'
})
export class TopNavBarComponent implements OnInit {

    constructor(public http: HttpService) {
    }

    title: string;
    public form: FormGroup;
    searchName = new FormControl();
    notifications: any = [];
    contacts: any = [];
    loader = false;
    loginData: any;
    showClose = false;
    chatToggle = false;

    unreadCount = 0;

    ngOnInit(): void {
        const that = this;
        jQuery(document).ready(function () {
            jQuery('.new-input').focus(function () {
                that.showClose = true;
                jQuery('.search-menu').addClass('focused');
            });
        });
        jQuery('.new-input').blur(function () {
            setTimeout(function () {
                that.showClose = false;
                that.searchName.patchValue('');
            }, 100);
            jQuery('.search-menu').removeClass('focused');
        });

        // this.loginData = JSON.parse(localStorage.getItem('loginData'));
        this.loginData = this.http.loginData;
        this.notificationList();
        const secondsCounter = interval(30000);
        secondsCounter.subscribe(n => {
            this.notificationList();
        });
    }

    openAddContact(data?) {
        const obj: any = {};
        if (data) {
            obj.firstName = data;
        }
        this.http.showModal(AddContactComponent, 'new-md', obj);
        this.searchName.patchValue('');
        this.contacts = [];
    }

    searchChange() {
        if (this.searchName.value) {
            this.getList(this.searchName.value);
        } else {
            this.contacts = [];
        }
    }

    finalSelected(data) {
        const temp = JSON.parse(JSON.stringify(data));
        if (window.location.pathname === '/contacts') {
            localStorage.setItem('savedData', JSON.stringify(temp));
            this.http.sendSearch(temp);
        } else {
            this.http.showModal(ContactDetailsComponent, 'md', temp);
        }
        this.searchName.patchValue('');
        this.contacts = [];
    }

    getList(val?) {
        const obj: any = {
            skip: 0,
            limit: 5,
            search: val ? val : ''
        };
        this.loader = true;
        this.http.getData(ApiUrl.CONTACTS, obj).subscribe(res => {
                    this.contacts = res.data.data;
                    this.loader = false;
                },
                () => {
                    this.loader = false;
                });
    }

    toggleNavigation(): void {
        jQuery('body').toggleClass('mini-navbar');
        this.chatToggle = !this.chatToggle;
        if(this.chatToggle){
            $('.wrapper.border-bottom.white-bg').css('margin-left','65px');
        }
        else{
            $('.wrapper.border-bottom.white-bg').css('margin-left','225px');
        }
        smoothlyMenu();
    }

    logout() {
        this.http.showModal(LogoutComponent, 'xs');
    }

    openNav() {
        this.notificationList(true);
        document.getElementById('notifications-panel').style.width = '400px';
    }

    getTimeFromMins(mins) {
        // do not include the first validation check if you want, for example,
        // getTimeFromMins(1530) to equal getTimeFromMins(90) (i.e. mins rollover)
        if ((parseInt(mins) > 24 * 60) || mins < 0) {
            throw new RangeError('Valid input should be greater than or equal to 0 and less than 1440.');
        }
        const h = mins / 60 | 0,
            m = mins % 60 | 0;
        return moment.utc().hours(h).minutes(m).format('hh:mm A');
    }

    notificationList(readAll?) {
        const obj: any = {
            skip: 0,
            limit: 1000
        };

        if (readAll) {
            obj.readAll = true;
        }

        this.http.getData(ApiUrl.NOTIFICATIONS, obj).subscribe(res => {

            if (res.data.data.length) {
                for (const key of res.data.data) {
                    if (key.type === 5) {
                        key.id.dueDateTime = new Date(key.id.dueDateTime);
                    }
                    if (key.id !== null  &&  (key.type === 7 || key.type === 8)) {
                        key.startTime = key.id.startTime ? this.getTimeFromMins(key.id.startTime) : '';
                        key.endTime = key.id.endTime ? this.getTimeFromMins(key.id.endTime) : '';
                    }
                }
            }

            this.notifications = res.data;
            this.unreadCount = res.data.unreadCount;
        });
    }

    closeNav() {
        document.getElementById('notifications-panel').style.width = '0';
    }

}



