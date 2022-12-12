import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccueilComponent } from './accueil/accueil.component';
import { BodyComponent } from './body/body.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { PagedeconnectionComponent } from './pagedeconnection/pagedeconnection.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

import { AuditsconnexionComponent } from './auditsconnexion/auditsconnexion.component';
import { ComptesconnexionComponent } from './comptesconnexion/comptesconnexion.component';
import { ConsultationsComponent } from './consultations/consultations.component';
import { AutresactionComponent } from './autresaction/autresaction.component';
import { MonitoringsComponent } from './monitorings/monitorings.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { MpasswordComponent } from './mpassword/mpassword.component';
import { AddcomptemarchandComponent } from './addcomptemarchand/addcomptemarchand.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { Ng2OrderModule } from 'ng2-order-pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommissionComponent } from './commission/commission.component';
import { CreationmarchandComponent } from './creationmarchand/creationmarchand.component';
import { ValidationcompteComponent } from './validationcompte/validationcompte.component';
import { ErreurtransactionComponent } from './erreurtransaction/erreurtransaction.component';
import { CreationuserComponent } from './creationuser/creationuser.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { SplitButtonModule } from 'primeng/splitbutton';
import { SpeedDialModule } from 'primeng/speeddial';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { FieldsetModule } from 'primeng/fieldset';

import { StyleClassModule } from 'primeng/styleclass';
import { ComptesComponent } from './comptes/comptes.component';
import { ParametragesComponent } from './parametrages/parametrages.component';
import { FirstconnexionComponent } from './firstconnexion/firstconnexion.component';
import { AuthentificationComponent } from './authentification/authentification.component';
import {
  HashLocationStrategy,
  Location,
  LocationStrategy,
} from '@angular/common';
import { TabViewModule } from 'primeng/tabview';
import { ExcelService } from '../services/excel.service';
import { ValidationBackOfficeComponent } from './validation-back-office/validation-back-office.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PwdForGotComponent } from './pwd-for-got/pwd-for-got.component';
import { DialogModule } from 'primeng/dialog';
import { ReclamationComponent } from './reclamation/reclamation.component';
import { ProfilComponent } from './profil/profil.component';
import { ChangePwdComponent } from './change-pwd/change-pwd.component';
import { ContratComponent } from './contrat/contrat.component';
import {TableModule} from 'primeng/table';
import {Ng2TelInputModule} from 'ng2-tel-input';
@NgModule({
  declarations: [
    AccueilComponent,
    BodyComponent,
    NavbarComponent,
    FooterComponent,
    PagedeconnectionComponent,
    PagenotfoundComponent,
    SidebarComponent,
    ForbiddenComponent,
    AuditsconnexionComponent,
    ComptesconnexionComponent,
    ConsultationsComponent,
    AutresactionComponent,
    MpasswordComponent,
    MonitoringsComponent,
    AddcomptemarchandComponent,
    CommissionComponent,
    CreationmarchandComponent,
    ValidationcompteComponent,
    ErreurtransactionComponent,
    CreationuserComponent,
    ComptesComponent,
    CreationmarchandComponent,
    ParametragesComponent,
    FirstconnexionComponent,
    AuthentificationComponent,
    ValidationBackOfficeComponent,
    PwdForGotComponent,
    ReclamationComponent,
    ProfilComponent,
    ChangePwdComponent,
    ContratComponent,
  ],

  exports: [
    AccueilComponent,
    BodyComponent,
    NavbarComponent,
    FooterComponent,
    PagedeconnectionComponent,
    PagenotfoundComponent,
    SidebarComponent,
    AuditsconnexionComponent,
    ForbiddenComponent,
    ComptesconnexionComponent,
    ConsultationsComponent,
    MpasswordComponent,
    AutresactionComponent,
    MonitoringsComponent,
    CommissionComponent,
    CreationmarchandComponent,
    ValidationcompteComponent,
    ErreurtransactionComponent,
    CreationuserComponent,
    CreationmarchandComponent,
  ],

  imports: [
    CommonModule,
    RouterModule,

    FormsModule,
    HttpClientModule,
    BrowserModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    Ng2OrderModule,
    NgxPaginationModule,
    SpeedDialModule,
    AngularMultiSelectModule,
    MultiSelectModule,
    StyleClassModule,
    DropdownModule,
    RadioButtonModule,
    SplitButtonModule,
    MessagesModule,
    MessageModule,
    ToastModule,
    ButtonModule,
    FileUploadModule,
    FieldsetModule,
    TabViewModule,
    ConfirmDialogModule,
    DialogModule,
    TableModule,
    Ng2TelInputModule
  ],
  providers: [
    Location,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    ExcelService,
  ],
})
export class ComponentModule {}
