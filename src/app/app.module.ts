import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';

import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { PagesModule } from './pages/pages.module'; /*
import { LayoutModule } from './layout/layout.module'; */

import { AppComponent } from './app.component';
import { CommonComponent } from './layout/common/common.component';
import { ComponentModule } from './component/component.module';
import { LayoutModule } from './layout/layout.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MultiSelectModule } from 'primeng/multiselect';
import { StyleClassModule } from 'primeng/styleclass';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { SpeedDialModule } from 'primeng/speeddial';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { FieldsetModule } from 'primeng/fieldset';

import {
  DatePipe,
  HashLocationStrategy,
  Location,
  LocationStrategy,
} from '@angular/common';
import { BasicAuthHtppInterceptorService } from './services/basic-auth-interceptor.service';
import { TabViewModule } from 'primeng/tabview';
import { ExcelService } from './services/excel.service';

import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { CryptoService } from './services/crypto.service';
import {Ng2TelInputModule} from 'ng2-tel-input';
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    PagesModule,
    LayoutModule,
    ComponentModule,
    HttpClientModule,
    NgbModule,
    BrowserAnimationsModule,
    AngularMultiSelectModule,
    FormsModule,
    MultiSelectModule,
    StyleClassModule,
    DropdownModule,
    RadioButtonModule,
    SplitButtonModule,
    MessagesModule,
    MessageModule,
    ToastModule,
    SpeedDialModule,
    ButtonModule,
    FileUploadModule,
    FieldsetModule,
    TabViewModule,
    ConfirmDialogModule,
    DialogModule,
    ReactiveFormsModule,
    Ng2TelInputModule
  ],
  providers: [
    Location,
    { provide: LocationStrategy, useClass: HashLocationStrategy },

    {
      provide: HTTP_INTERCEPTORS,
      useClass: BasicAuthHtppInterceptorService,
      multi: true,
    },
    ExcelService,
    CryptoService,
    {
      provide: APP_INITIALIZER,
      useFactory: (ds: CryptoService) => () => ds.init(),
      deps: [CryptoService],
      multi: true,
    },
    DatePipe,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
