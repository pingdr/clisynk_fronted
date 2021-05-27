import { ChooseThemeComponent } from './choose-theme/choose-theme.component';
import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpService} from '../../../services/http.service';
import {ActivatedRoute} from '@angular/router';
import { MatDialog } from '@angular/material';
import { SuccessBroadcastModalComponent } from 'src/app/shared/modals/success-broadcast-modal/success-broadcast-modal.component';

declare type CurrentTabType = 'custom-mail' | 'themes' | 'code-your-own';
@Component({
    selector: 'app-add-broadcast',
    templateUrl: './add-broadcast.component.html',
    styleUrls: ['./add-broadcast.component.scss']
})
export class AddBroadcastComponent implements OnInit {
  
    currentTab: CurrentTabType = 'custom-mail';
    constructor(public http: HttpService, public activeRoute: ActivatedRoute, public dialog: MatDialog) {  }

    ngOnInit(): void { }

    changeTab(tab: CurrentTabType) {
        this.currentTab = tab;
    }
    openDialogsuccess(){
        const dialogRef = this.dialog.open(SuccessBroadcastModalComponent, {
            panelClass:"success-broadcast"
          
          });
      
          dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            
          });
    }

}
