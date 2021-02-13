import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-navigate-to-products',
  templateUrl: './navigate-to-products.component.html',
  styleUrls: ['./navigate-to-products.component.css']
})
export class NavigateToProductsComponent implements OnInit {

  constructor(public http:HttpService) { }

  ngOnInit() {
  }

}
