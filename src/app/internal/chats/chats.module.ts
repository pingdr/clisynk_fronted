import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../shared/modules/shared.module';
import {ChatsComponent} from './chats.component';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuardService as AuthGuard} from '../../services/authguard.service';
import  {  NgxEmojiPickerModule  }  from  'ngx-emoji-picker';
import {MatSidenavModule} from '@angular/material/sidenav';
import {NgxDocViewerModule} from 'ngx-doc-viewer';
// import { VideoCallComponent } from './video-call/video-call/video-call.component';
// import { FileSaverModule } from 'ngx-filesaver';

const routes: Routes = [
    {
        path: '', children: [
            {
                path: '',
                component: ChatsComponent,
                data: {title: 'Chats'},
                canActivate: [AuthGuard]
            }
        ]
    }
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes),
        NgxEmojiPickerModule,
        MatSidenavModule,
        NgxDocViewerModule,
         
    ],
    declarations: [
      ChatsComponent,
    ]
})
export class ChatsModule {
}

