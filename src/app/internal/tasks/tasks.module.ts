import {NgModule} from '@angular/core';
import {SharedModule} from '../../shared/modules/shared.module';
import {TasksComponent} from './tasks.component';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuardService as AuthGuard} from '../../services/authguard.service';

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
        RouterModule.forChild(routes)
    ],
    declarations: [
        TasksComponent
    ]
})
export class TasksModule {
}
