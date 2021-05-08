import {NgModule} from '@angular/core';
import {SharedModule} from '../../shared/modules/shared.module';
import {TasksComponent} from './tasks.component';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuardService as AuthGuard} from '../../services/authguard.service';
import {FullCalendarModule} from '@fullcalendar/angular';

const routes: Routes = [
    {
        path: '', children: [
            {
                path: '',
                component: TasksComponent,
                data: {title: 'Tasks'},
                canActivate: [AuthGuard]
            }
        ]
    }
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes),
        FullCalendarModule
    ],
    declarations: [
        TasksComponent
    ]
})
export class TasksModule {
}
