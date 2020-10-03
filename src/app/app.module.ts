import {BrowserModule, Title} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AppComponent} from './app.component';
import {LoginComponent} from './external/login/login.component';
import {ExportToExcelService} from './services/exportToExcel.service';
import {SharedModule} from './shared/modules/shared.module';
import {CapitalizePipe} from './shared/pipes/capitalizefirst.pipe';
import {AppRoutingModule} from './app-routing.module';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToastrModule} from 'ngx-toastr';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {InterceptorService} from './services/interceptor.service';
import {LightboxModule} from 'ngx-lightbox';
import {AsyncPipe} from '@angular/common';
import {PrivacyComponent} from './external/privacy/privacy.component';
import {ExternalAuthguardService} from './services/externalAuthguard.service';
import {ForgotPasswordComponent} from './shared/modals/forgot-password/forgot-password.component';
import {ReceiptComponent} from './external/receipt/receipt.component';
import {BookingComponent} from './internal/appointments/booking/booking.component';
import {ShoppingReducer} from './internal/actions/reducer';
import {StoreModule} from '@ngrx/store';
import {TodoComponent} from './internal/actions/todo/todo.component';
// firebase
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AngularFireModule } from '@angular/fire';
@NgModule({
    declarations: [
        CapitalizePipe, AppComponent, LoginComponent, PrivacyComponent, ForgotPasswordComponent,
        ReceiptComponent, BookingComponent, TodoComponent
    ],
    imports: [
        SharedModule, BrowserModule, AppRoutingModule, HttpClientModule,
        ServiceWorkerModule.register('/ngsw-worker.js', {
            enabled: environment.production
        }),
        StoreModule.forRoot({shopping: ShoppingReducer}),
        CommonModule, BrowserAnimationsModule,
        ToastrModule.forRoot({
            closeButton: true,
            timeOut: 3000,
            progressAnimation: 'increasing',
            preventDuplicates: true,
            resetTimeoutOnDuplicate: true,
            progressBar: true
        }),
        LightboxModule,
        AngularFireMessagingModule,
        AngularFireModule.initializeApp(environment.firebase)
    ],

    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: InterceptorService,
            multi: true
        },
        AsyncPipe, ExternalAuthguardService, ExportToExcelService, Title,
    ],
    bootstrap: [AppComponent],
    exports: [CapitalizePipe],
    entryComponents: [ForgotPasswordComponent]
    // HttpService,
})

export class AppModule {
}
