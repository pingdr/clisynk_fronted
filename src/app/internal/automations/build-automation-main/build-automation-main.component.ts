import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
declare var $ : any;

@Component({
  selector: 'app-build-automation-main',
  templateUrl: './build-automation-main.component.html',
  styleUrls: ['./build-automation-main.component.css']
})
export class BuildAutomationMainComponent implements OnInit {


  option:boolean=false;
  buttonName = 'Show more option';
  hide: any;

  leadform = false;
  appointment = false;
  aftersubmits = false
  sectionSelected = "when";

  constructor(public http:HttpService) { }

  ngOnInit() {
    $(document).ready(function(){
      $(".scroll-class").click(function() {
          $('html,body').animate({                                                          //  fine in moz, still quicker in chrome. 
              scrollTop: $(".all-option-available").offset().top},
              'slow');
      }); 
       }); 
  }

  Showoption(){
    this.option = !this.option
    // window.scrollTo(1900, 1900);
    document.body.scrollTop = 0;
    if(this.option) {
      this.buttonName = 'Show less option'
      // console.log(this.option)
      
      }
      else {
      this.buttonName = 'Show more option'
      }
  }

  // ----------lead-formsubmited---------//
  Aftersubmit(){
    this.leadform = true;
    this.aftersubmits =true;
    this.appointment = false;
    
  }

  Appointment(){
    this.leadform = true;
    this.aftersubmits =false;
    this.appointment = true;
  }
}
