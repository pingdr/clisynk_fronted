import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Routes, RouterModule} from '@angular/router';
import {SharedModule} from '../../shared/modules/shared.module';
import {AuthGuardService} from '../../services/authguard.service';
import { AutomationComponent } from './automation.component';
import { MatMenuModule } from '@angular/material';




const routes: Routes = [
  {
      path: '', children: [
          {
              path: '',
              component: AutomationComponent,
              canActivate: [AuthGuardService],
              data: {title: 'Automation'},
          }
      ]
  }
];

@NgModule({
  declarations: [
      AutomationComponent
  ],
  imports: [
      CommonModule,
      RouterModule.forChild(routes),
      SharedModule,
      MatMenuModule
  ],
 
})
export class AutomationsModule { }
