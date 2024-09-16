import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { HeadingBoxModule } from '~/frontend/modules/heading-box/heading-box.module';
import { BoxContenntModule } from '~/frontend/modules/box-content';
import { BoxHeaderPageModule } from '~/frontend/modules/box-breadcrumb/box-header-page.module';
import { BoxLoadingModule } from '~/frontend/modules/box-loading/box-loading.module';
import { SanitizeHtmlModule } from '~/frontend/sanitizehtmlpipe';
import { ForgetCustomerComponent } from '../forget/forget.component';
import { SignInComponent } from './sign-in.component';

const routes: Routes = [{ path: '', component: SignInComponent }];

@NgModule({
    declarations: [SignInComponent, ForgetCustomerComponent],
    imports: [
        CommonModule,
        TranslateModule,
        FormsModule,
        ReactiveFormsModule,
        SanitizeHtmlModule,
        RouterModule.forChild(routes),
        BoxContenntModule,
        BoxHeaderPageModule,
        BoxLoadingModule,
        HeadingBoxModule,
    ],
})
export class SignInModule {}