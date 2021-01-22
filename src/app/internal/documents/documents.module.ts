import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../shared/modules/shared.module';
import {DocumentsComponent} from './documents.component';
import {RouterModule, Routes} from '@angular/router';
import {ApprovalDocumentComponent} from './approval-document/approval-document.component';
import {AuthGuardService as AuthGuard} from '../../services/authguard.service';
import {GridsterModule} from 'angular-gridster2';
import { CKEditorModule } from 'ng2-ckeditor'; 
import { TreeviewModule } from 'ngx-treeview';
const routes: Routes = [
    {
        path: '', children: [
            {
                path: '',
                component: DocumentsComponent,
                data: {title: 'Documents'},
                canActivate: [AuthGuard]
            },
             {
                path: 'approve-doc/:id',
                component: ApprovalDocumentComponent,
                data: {title: 'Documents'},
                canActivate: [AuthGuard]
            }, 
        ]
    }
];

@NgModule({
    imports: [
        GridsterModule,
        CKEditorModule,
        SharedModule,
        TreeviewModule.forRoot(),
        RouterModule.forChild(routes)
    ],
    declarations: [
      DocumentsComponent,
      ApprovalDocumentComponent      
    ]
})
export class DocumentsModule {
}
