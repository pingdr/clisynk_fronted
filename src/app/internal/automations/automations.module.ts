import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Routes, RouterModule} from '@angular/router';
import {SharedModule} from '../../shared/modules/shared.module';
import {AuthGuardService} from '../../services/authguard.service';
import { AutomationComponent } from './automation.component';
import { MatExpansionModule, MatChipsModule } from '@angular/material';
import { BuildAutomationComponent } from './build-automation/build-automation.component';
import { AddBuildautomationComponent } from './add-buildautomation/add-buildautomation.component';
import { BuildThenautomationsComponent } from './build-thenautomations/build-thenautomations.component';
import { FreeConsulationComponent } from './free-consulation/free-consulation.component';
import { ChooseTagComponent } from './choose-tag/choose-tag.component';
import { MatMenuModule } from '@angular/material/menu';
import { FreeCosulationWhenComponent } from './free-cosulation-when/free-cosulation-when.component';

// import { AmazingTimePickerModule } from 'amazing-time-picker';








const routes: Routes = [
  {
      path: '', children: [
          {
              path: '',
              component: AutomationComponent,
              canActivate: [AuthGuardService],
              data: {title: 'Automation'},
          },
          {
            path:'build-automation',
            component:  BuildAutomationComponent,
            canActivate: [AuthGuardService],
            data: {title: 'Automation'},
        },
        {
            path:'add-build-automation',
            component:   AddBuildautomationComponent,
            canActivate: [AuthGuardService],
            data: {title: 'Automation'},
        },
        {
            path:'build-then-automation',
            component:   BuildThenautomationsComponent,
            canActivate: [AuthGuardService],
            data: {title: 'Automation'},
        },
        {
            path:'free-consulation',
            component:   FreeConsulationComponent,
            canActivate: [AuthGuardService],
            data: {title: 'Automation'},
        },
        {
            path:'choose-a-tag',
            component:   ChooseTagComponent,
            canActivate: [AuthGuardService],
            data: {title: 'Automation'},
        },
        {
            path:'free-consulation-when',
            component:   FreeCosulationWhenComponent,
            canActivate: [AuthGuardService],
            data: {title: 'Automation'},
        },
        
        
       
      ]
  }
];

@NgModule({
  declarations: [
      AutomationComponent, BuildAutomationComponent, AddBuildautomationComponent,  BuildThenautomationsComponent, 
      FreeConsulationComponent,  ChooseTagComponent, FreeCosulationWhenComponent

      
  ],
  imports: [
      CommonModule,
      RouterModule.forChild(routes),
      SharedModule,
      MatMenuModule,
      MatExpansionModule,
    //   AmazingTimePickerModule,
      MatChipsModule
      
    
      

  ],
 
})
export class AutomationsModule { }
