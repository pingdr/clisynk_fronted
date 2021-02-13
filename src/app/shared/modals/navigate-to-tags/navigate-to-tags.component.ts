import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-navigate-to-tags',
  templateUrl: './navigate-to-tags.component.html',
  styleUrls: ['./navigate-to-tags.component.css']
})
export class NavigateToTagsComponent implements OnInit {

  constructor(public http:HttpService) { }

  ngOnInit() {
  }

}
