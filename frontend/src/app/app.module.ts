import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule} from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { PageHomeComponent } from './page-home/page-home.component';
import { GuardService } from './guard.service';
import { RouterModule } from '@angular/router';
import { routes } from './routes';
import { TagSelectComponent } from './tag-select/tag-select.component';
import { TagComponent } from './tag/tag.component';
import { PageUploadSingleFileComponent } from './page-upload-single-file/page-upload-single-file.component';
import { MenuComponent } from './menu/menu.component';
import { SnotifyModule, ToastDefaults, SnotifyService } from 'ng-snotify';
import { PageShowTagsComponent } from './page-show-tags/page-show-tags.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PageHomeComponent,
    TagSelectComponent,
    TagComponent,
    PageUploadSingleFileComponent,
    MenuComponent,
    PageShowTagsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    SnotifyModule
  ],
  providers: [
    GuardService,
    { provide: 'SnotifyToastConfig', useValue: ToastDefaults},
    SnotifyService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
