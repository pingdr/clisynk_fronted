import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {


  loaderSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  loader$ = this.loaderSubject.asObservable();

  constructor() { }

  loadingOn() {
    this.loaderSubject.next(true);
  }

  loadingOff() {
    this.loaderSubject.next(false);
  }

}
