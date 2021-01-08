import { Component, OnInit } from '@angular/core';
import { CreateFolderComponent } from '../../shared/modals/create-folder/create-folder.component';
import { CreateDocumentComponent } from '../../shared/modals/create-document/create-document.component';
import { DeleteDocComponent } from '../../shared/modals/delete-doc/delete-doc.component'
import { HttpService } from '../../services/http.service';
import * as $ from 'jquery';
import { Subject, Subscription } from 'rxjs';
//import {FILTERS} from './contact-filter.constant';
import * as _ from 'lodash';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MoveComponent } from '../../shared/modals/move/move.component';

import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';

export interface PeriodicElement {
  name: string;
  position: string;
  weight: string;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 'Documents for Client.', name: '', weight: '', symbol: 'Just now' },
  { position: 'Project Management', name: '', weight: '', symbol: 'Just now' },
  { position: 'Proposal', name: '', weight: '', symbol: 'Just now' },
  { position: 'Event Management Proposal', name: 'Draft', weight: '$0.00', symbol: '36 minutes ago' },
];

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit {

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;

  isView = true;
  isViewMenu = false;
  responseData = [];
  url = 'documents';
  folderList = [];
  selectedItem = [];

  searchText = "";
  sortType = -1;
  sortBy = 'lastModified';
  status = '';
  addedBy = 0;
  modalData: any;
  folderId: '';
  temp = false;
  tableHeaderFlag = false;
  isShowHeader = false;
  public loader = false;
  subscription: Subscription;
  isMasterSel: boolean;
  myForm: FormGroup;

  items_old = [new TreeviewItem({
    text: "IT",
    value: {},
    children: [
      {
        text: "Programming",
        value: 91,
        children: [
          {
            text: "Frontend",
            value: 911,
            children: [
              { text: "Angular 1", value: 9111 },
              { text: "Angular 2", value: 9112 },
              { text: "ReactJS", value: 9113 },
            ],
          },
          {
            text: "Backend",
            value: 912,
            children: [
              { text: "C#", value: 9121 },
              { text: "Java", value: 9122 },
              { text: "Python", value: 9123, checked: false },
            ],
          },
        ],
      },
      {
        text: "Networking",
        value: 92,
        children: [
          { text: "Internet", value: 921 },
          { text: "Security", value: 922 },
        ],
      },
    ],
  })];
  items = [];
  config = {
    hasAllCheckBox: false,
    hasFilter: false,
    hasCollapseExpand: false,
    decoupleChildFromParent: false,
    maxHeight: 500
  };
  constructor(public http: HttpService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.subscription = this.http.documentUpdatedStatus.subscribe(data => {

      this.documentList();
      this.selectedItem = [];
      this.isShowHeader = false;
    });

    this.myForm = this.fb.group({
      id: this.fb.array([])
    });

    this.folderListWithName();
    this.setActiveClass();
  }
  folderListWithName() {
    this.http.getData(this.url, {
      partial: 1,
    }).subscribe(res => {
      this.items_old = [new TreeviewItem({
        text: "IT",
        value: {},
        children:res.data
      })];
      this.folderList = res.data;
      let treeData = [];
      let i = 1;
      res.data.forEach(element => {
        treeData.push(new TreeviewItem(element));
        if (res.data.length === i) {
          this.items = treeData;
          //this.items_old = treeData;
        }
        i++;
      });
    });
  }
  onFilterChange(value: string): void {
    console.log('onFilterChangefilter:', value);
  }
  onSelectedChange(value: string): void {
    console.log('onSelectedChangefilter:', value);
  }

  setActiveClass() {
    $('div.all-row').click(function () {
      $('div.all-row').removeClass("active");
      $(this).addClass("active");
    });
  }

  getSelectedCount(i, id, isChecked: boolean) {
    console.log("getSelectedCount====ID========", id);
    console.log("getSelectedCount====I========", i);
    console.log("getSelectedCount====isChecked========", isChecked);

    const emailFormArray = <FormArray>this.myForm.controls.id;
    if (isChecked) {
      console.log("getSelectedCount====IF========", isChecked);
      emailFormArray.push(new FormControl(id));
    } else {
      let index = emailFormArray.controls.findIndex(x => x.value == id)
      console.log("getSelectedCount====index========", index);
      emailFormArray.removeAt(index);
    }
    this.selectedItem = emailFormArray.value;
    console.log("getSelectedCount====this.emailFormArray========", emailFormArray.value);
    $('square-checkmark').addClass("set");
  }

  selectAllCopyDocument() {

    let checked = false;
    if ($('.checkDocs').is(':checked')) {
      checked = true;
      this.isShowHeader = true;
    } else {
      this.isShowHeader = false;
      this.selectedItem = [];
    }

    const emailFormArray = <FormArray>this.myForm.controls.id;
    /* this.isMasterSel = this.responseData.every(function(item:any) {
      console.log("selectAllCopyDocument====item========",item);
      //emailFormArray.push(new FormControl(item.id));
        return item.isSelected = checked;
      }) */

    this.responseData.forEach(e => {
      e.isSelected = checked;
      if (checked) {
        this.selectedItem.push(e._id);
      }

      console.log("selectAllCopyDocument=====", e);

    });
  }

  handleClick() {
    this.tableHeaderFlag = !this.tableHeaderFlag;
  }

  openAddTask() {
    this.http.showModal(CreateFolderComponent, 'md', { 'parentId': this.folderId });
  }

  openAddDocument() {
    this.http.showModal(CreateDocumentComponent, 'md', { 'parentId': this.folderId });
  }

  deleteDocModal(data, type = 's') {
    if (type == 's') {
      this.http.showModal(DeleteDocComponent, 'xs', [data._id]);
    } else {
      this.http.showModal(DeleteDocComponent, 'xs', data);
    }

  }

  sorting(sortBy, sortType) {
    this.sortBy = sortBy;
    this.sortType = sortType;
    this.documentList();
  }

  documentList() {
    this.loader = true;
    const obj: any = {
      //skip: 0,
      //limit: 10000,
      sortBy: this.sortBy,
      sortType: this.sortType,
      search: this.searchText,
      status: this.status,
      addedBy: this.addedBy,
      id: this.folderId
      //filter:"5f80a54f3652e32eebe52583"
    };
    this.http.getData(this.url, obj).subscribe(res => {
      this.responseData = res.data.documents
      this.loader = false;
    });
  }

  filterLabel(labels) {
    this.status = labels;
    this.documentList();
  }

  addedByFilter(addStatus) {
    this.folderId = '';
    this.addedBy = addStatus;
    this.documentList();
  }

  renameDocs(data) {
    this.http.showModal(CreateFolderComponent, 'md', data);
  }

  subFolderList(data) {
    this.folderId = data._id;
    this.documentList();
  }

  copyDocument() {
    console.log("this.copyDocument======", this.selectedItem);

    const obj = {
      documentIds: this.selectedItem
    };
    this.http.updateDocument(this.url + '/clone', obj).subscribe(res => {
      this.isShowHeader = false;
      this.documentList();
      this.http.openSnackBar('Added Successfully');
    }, () => {

    });
  }

  moveDocument() {
    this.http.showModal(MoveComponent, 'md', '');
    const obj = {
      documentIds: [this.selectedItem],
      target: ''
    };
    this.http.postData(this.url + '/move', obj).subscribe(res => {
      this.documentList();
      this.http.openSnackBar('Moved Successfully');
    }, () => {
    });
  }

  multipleDeleteDocs() {
    let body = {
      "documentIds": this.selectedItem,
    };
    this.deleteDocModal(this.selectedItem, 'm');
  }

}
