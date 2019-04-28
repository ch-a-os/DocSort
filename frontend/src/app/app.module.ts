import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { PageHomeComponent } from './page-home/page-home.component';
import { RouterModule } from '@angular/router';
import { routes } from './routes';
import { PageUploadSingleFileComponent } from './page-upload-single-file/page-upload-single-file.component';
import { MenuComponent } from './menu/menu.component';
import { SnotifyModule, ToastDefaults, SnotifyService } from 'ng-snotify';
import { PageShowTagsComponent } from './page-show-tags/page-show-tags.component';
import { PageSearchComponent } from './page-search/page-search.component';
import { TagSelectContainerComponent } from './tag-select-container/tag-select-container.component';
import { TagSelectItemComponent } from './tag-select-item/tag-select-item.component';
import { PageHistoryComponent } from './page-history/page-history.component';
import { DocumentComponent } from './document/document.component';
import { TokenInterceptor } from './httpInterceptor';
import { TextboxComponent } from './textbox/textbox.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PageHomeComponent,
    PageUploadSingleFileComponent,
    MenuComponent,
    PageShowTagsComponent,
    PageSearchComponent,
    TagSelectContainerComponent,
    TagSelectItemComponent,
    PageHistoryComponent,
    DocumentComponent,
    TextboxComponent
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
    {
      provide: 'SnotifyToastConfig', useValue: ToastDefaults
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    SnotifyService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
