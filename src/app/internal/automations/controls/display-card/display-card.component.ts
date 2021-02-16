import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef, Input } from '@angular/core';
import { EventType } from '../../constants';
import { UUID } from 'angular2-uuid';
@Component({
  selector: 'app-display-card',
  templateUrl: './display-card.component.html',
  styleUrls: ['./display-card.component.css'],
})
export class DisplayCardComponent implements OnInit {

  statusImages = {
    greenCloud: "assets/images/cloud-green.svg",
    blueFlash: "assets/images/blue-flash.svg",
    edit: "assets/images/edit-button-gray.svg",
    delete: "assets/images/delete-gray.svg",
    exportBlueIcon: "assets/images/export-blue-icon.svg"
  }
  random;
  EventType = EventType;
  open = false;

  @Input()
  eventType: string;

  _taskData: any;
  @Input() 
  set taskData(value: any) {
    if(value) {
      this._taskData = value;
      console.log(this._taskData);
    }
  }
  
  public get status(): string {
    switch (this.eventType) {
      case this.EventType.WHEN: {
        return this.statusImages.greenCloud;
      }
      case this.EventType.THEN: {
        return this.statusImages.blueFlash;
      }
    }
  }


  constructor(private changeDetection: ChangeDetectorRef) {
    this.random = this.makeid(15);
   }


 

  ngOnInit() {
    console.log(this.random);
    this.changeDetection.detectChanges();
  }
  ngOnChanges() {
    
    this.changeDetection.detectChanges();
  }
  ngAfterViewInit() {
    this.changeDetection.detectChanges();

  }









  private makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
