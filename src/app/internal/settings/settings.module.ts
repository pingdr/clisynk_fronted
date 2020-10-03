import {NgModule} from '@angular/core';
import {SharedModule} from '../../shared/modules/shared.module';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuardService as AuthGuard} from '../../services/authguard.service';
import {MyProfileComponent} from './my-profile/my-profile.component';
import {SettingsComponent} from './settings.component';
import {BusinessProfileComponent} from './business-profile/business-profile.component';
import {UsersComponent} from './users/users.component';
import {ProductsComponent} from './products/products.component';

const routes: Routes = [
    {
        path: '', children: [
            {
                path: '',
                component: SettingsComponent,
                data: {title: 'Profile'},
                canActivate: [AuthGuard]
            }, {
                path: 'my-profile',
                component: MyProfileComponent,
                data: {title: 'Profile'},
                canActivate: [AuthGuard]
            }, {
                path: 'business-profile',
                component: BusinessProfileComponent,
                data: {title: 'Business Profile'},
                canActivate: [AuthGuard]
            }, {
                path: 'users',
                component: UsersComponent,
                data: {title: 'Users'},
                canActivate: [AuthGuard]
            }, {
                path: 'products',
                component: ProductsComponent,
                data: {title: 'Products'},
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
        MyProfileComponent, SettingsComponent, BusinessProfileComponent, UsersComponent, ProductsComponent
    ]
})
export class SettingsModule {
}
