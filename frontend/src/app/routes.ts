import { Routes } from '@angular/router';
//import { LoginComponent } from './login/login.component';
//import { GuardService } from './guard.service';
//import { AppComponent } from './app.component';
import { PageHomeComponent } from './page-home/page-home.component';
import { PageUploadSingleFileComponent } from './page-upload-single-file/page-upload-single-file.component';
import { PageShowTagsComponent } from './page-show-tags/page-show-tags.component';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: PageHomeComponent },
    { path: 'uploadSingleDocument', component: PageUploadSingleFileComponent },
    { path: 'showTags', component: PageShowTagsComponent }
]