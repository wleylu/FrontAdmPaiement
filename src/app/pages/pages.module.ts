import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConnectionComponent } from './connection/connection.component';
import { EtatComponent } from './etat/etat.component';
import { HomeComponent } from './home/home.component';
import { ComponentModule } from '../component/component.module';

import { AuditconnexionComponent } from './auditconnexion/auditconnexion.component';
import { CompteconnexionComponent } from './compteconnexion/compteconnexion.component';
import { ConsultationComponent } from './consultation/consultation.component';
import { MonitoringComponent } from './monitoring/monitoring.component';
import { AutreactionComponent } from './autreaction/autreaction.component';
import { ForbiddensComponent } from './forbiddens/forbiddens.component';
import { ModificationpasswordComponent } from './modificationpassword/modificationpassword.component';
import { CommissionsComponent } from './commissions/commissions.component';
import { ValidationComponent } from './validation/validation.component';
import { ErreurComponent } from './erreur/erreur.component';
import { CreateuserComponent } from './createuser/createuser.component';
import { ComptesComponent } from './comptes/comptes.component';
import { ParametragesComponent } from './parametrages/parametrages.component';
import { TabViewModule } from 'primeng/tabview';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@NgModule({
  declarations: [
    ConnectionComponent,
    EtatComponent,
    HomeComponent,
    AuditconnexionComponent,
    CompteconnexionComponent,
    ConsultationComponent,
    MonitoringComponent,
    AutreactionComponent,
    ForbiddensComponent,
    ModificationpasswordComponent,
    CommissionsComponent,
    ValidationComponent,
    ErreurComponent,
    CreateuserComponent,
    ComptesComponent,
    ParametragesComponent,
  ],
  imports: [CommonModule, ComponentModule, TabViewModule, ConfirmDialogModule],
})
export class PagesModule {}
