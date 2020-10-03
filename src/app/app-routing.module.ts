import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './external/login/login.component';
import {PrivacyComponent} from './external/privacy/privacy.component';
import {ExternalAuthguardService} from './services/externalAuthguard.service';
import {ReceiptComponent} from './external/receipt/receipt.component';
import {BookingComponent} from './internal/appointments/booking/booking.component';
import {TodoComponent} from './internal/actions/todo/todo.component';

const routes: Routes = [
    {path: '', redirectTo: '/login', pathMatch: 'full'},
    {path: 'login', component: LoginComponent, canActivate: [ExternalAuthguardService]},
    {path: 'privacy', component: PrivacyComponent},
    {path: 'receipt', component: ReceiptComponent},
    {path: 'ngrx', component: TodoComponent},
    {path: 'booking/:name', component: BookingComponent},
    {path: '', loadChildren: () => import('./internal/internal.module').then(m => m.InternalModule)}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule {
}
