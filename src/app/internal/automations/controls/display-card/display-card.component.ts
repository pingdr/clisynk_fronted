import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef, Input } from '@angular/core';
import { SectionType } from '../../constants';

@Component({
  selector: 'app-display-card',
  templateUrl: './display-card.component.html',
  styleUrls: ['./display-card.component.css'],
})
export class DisplayCardComponent implements OnInit {

  random = this.makeid(10);
  SectionType = SectionType;
  @Input() 
  section: string;

  statusImages = {
    greenCloud : "assets/images/cloud-green.svg",
    blueFlash: "assets/images/blue-flash.svg",
    edit : "assets/images/edit-button-gray.svg",
    delete : "assets/images/delete-gray.svg",
    exportBlueIcon : "assets/images/export-blue-icon.svg"
  }
  
  public get status() : string {
    switch (this.section) {
      case this.SectionType.WHEN: {
        return this.statusImages.greenCloud;
      }
      case this.SectionType.THEN: {
        return this.statusImages.blueFlash;
      }
    }
  }
  

  constructor(private changeDetection: ChangeDetectorRef) { }

  ngOnInit() {
    console.log(this.random);
    this.changeDetection.detectChanges();
  }
  ngAfterViewInit() {
    this.changeDetection.detectChanges();

  }








  
  private makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }
}
