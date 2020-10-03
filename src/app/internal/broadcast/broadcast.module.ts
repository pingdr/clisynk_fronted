import {NgModule} from '@angular/core';
import {SharedModule} from '../../shared/modules/shared.module';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuardService as AuthGuard} from '../../services/authguard.service';
import {BroadcastComponent} from './broadcast.component';
import {AddBroadcastComponent} from './add-broadcast/add-broadcast.component';

const routes: Routes = [
    {
        path: '', children: [
            {
                path: '',
                component: BroadcastComponent,
                data: {title: 'BroadCast'},
                canActivate: [AuthGuard]
            },
            {
                path: 'add-broadcast',
                component: AddBroadcastComponent,
                data: {title: 'Add BroadCast'},
                canActivate: [AuthGuard]
            },
            {
                path: 'edit-broadcast/:id',
                component: AddBroadcastComponent,
                data: {title: 'Edit BroadCast'},
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
        BroadcastComponent,
        AddBroadcastComponent
    ]
})
export class BroadcastModule {
}
