import {Subscription} from 'rxjs';

export class TableModel {
    subscription: Subscription;
    totalItems: number;
    limit = 1000;
    search = '';
    allData: any = [];
    data: any = [];
    currentPage = 0;
    status = 1;
    heading = '';
    id: string;
    loader = false;
    timeSlots: any = [];
    notifications: any = [];
    templates: any = [];
    contacts: any = [];
    tags: any = [];
    tasks: any = [];
    categories: any = [];
    products: any = [];
    invoices: any = [];
    types: any = [];
    appointmentTypes: any = [];
    addresses: any = [];
    recentInvoices: any = [];
    appoints: any = [];
    selectedTab = 1;
    selected: any;
    contactSettings: any = {
        idField: '_id',
        textField: 'showName',
        itemsShowLimit: 2,
        allowSearchFilter: true,
        'disabled': true
    };
    today = new Date();
}

