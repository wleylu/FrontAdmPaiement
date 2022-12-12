import { ProfilComponent } from './component/profil/profil.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagenotfoundComponent } from './component/pagenotfound/pagenotfound.component';
import { CommonComponent } from './layout/common/common.component';
import { ConnectionComponent } from './pages/connection/connection.component';

import { HomeComponent } from './pages/home/home.component';

import { AuditconnexionComponent } from './pages/auditconnexion/auditconnexion.component';
import { CompteconnexionComponent } from './pages/compteconnexion/compteconnexion.component';
import { ConsultationComponent } from './pages/consultation/consultation.component';
import { AutreactionComponent } from './pages/autreaction/autreaction.component';
import { MonitoringComponent } from './pages/monitoring/monitoring.component';
import { ComptesconnexionGuard } from './comptesconnexion.guard';
import { ForbiddensComponent } from './pages/forbiddens/forbiddens.component';
import { ModificationpasswordComponent } from './pages/modificationpassword/modificationpassword.component';
import { CommissionsComponent } from './pages/commissions/commissions.component';
import { ValidationComponent } from './pages/validation/validation.component';
import { ErreurComponent } from './pages/erreur/erreur.component';
import { CreateuserComponent } from './pages/createuser/createuser.component';
import { ParametragesComponent } from './component/parametrages/parametrages.component';
import { FirstconnexionComponent } from './component/firstconnexion/firstconnexion.component';
import { AuthentificationComponent } from './component/authentification/authentification.component';
import { AuthGuardGuard } from './guard/auth-guard.guard';
import { AccueilComponent } from './component/accueil/accueil.component';
import { CreationmarchandComponent } from './component/creationmarchand/creationmarchand.component';
import { PagedeconnectionComponent } from './component/pagedeconnection/pagedeconnection.component';
import { ValidationBackOfficeComponent } from './component/validation-back-office/validation-back-office.component';
import { PwdForGotComponent } from './component/pwd-for-got/pwd-for-got.component';
import { ReclamationComponent } from './component/reclamation/reclamation.component';
import { ChangePwdComponent } from './component/change-pwd/change-pwd.component';
import { ContratComponent } from './component/contrat/contrat.component';

const routes: Routes = [
  { path: '', redirectTo: '/authentication', pathMatch: 'full' },
  { path: 'connection', component: PagedeconnectionComponent },
  {
    path: 'reinitialiser',
    component: ChangePwdComponent,
  },
  {
    path: 'firstconnexion',
    component: FirstconnexionComponent,
    canActivate: [ComptesconnexionGuard],
  },
  { path: 'authentication', component: AuthentificationComponent },
  { path: 'pwdForGot', component: PwdForGotComponent },
  {
    path: 'app',
    component: CommonComponent,
    canActivate: [AuthGuardGuard],
    children: [
      {
        path: 'auditconnexion',
        component: AuditconnexionComponent,
        canActivate: [AuthGuardGuard],
      },
      {
        path: 'compteconnexion',
        component: CompteconnexionComponent,
        canActivate: [AuthGuardGuard] /* canActivate:[ComptesconnexionGuard] */,
      },
      {
        path: 'Consultation',
        component: ConsultationComponent,
        canActivate: [AuthGuardGuard],
      },
      {
        path: 'createuser',
        component: CreateuserComponent,
        canActivate: [AuthGuardGuard],
      },
      {
        path: 'createuserbackoffice',
        component: CreationmarchandComponent,
        canActivate: [AuthGuardGuard],
      },

      {
        path: 'accueil',
        component: AccueilComponent,
        canActivate: [AuthGuardGuard],
      },
      {
        path: 'modificationpassword',
        component: ModificationpasswordComponent,
        canActivate: [AuthGuardGuard],
      },

      {
        path: 'forbiddens',
        component: ForbiddensComponent,
        canActivate: [AuthGuardGuard],
      },

      {
        path: 'autreaction',
        component: AutreactionComponent,
        canActivate: [AuthGuardGuard],
      },
      {
        path: 'monitoring',
        component: MonitoringComponent,
        canActivate: [AuthGuardGuard],
      },

      {
        path: 'validation',
        component: ValidationComponent,
        canActivate: [AuthGuardGuard],
      },

      {
        path: 'validationBackOffice',
        component: ValidationBackOfficeComponent,
        canActivate: [AuthGuardGuard],
      },

      {
        path: 'erreur',
        component: ErreurComponent,
        canActivate: [AuthGuardGuard] /* canActivate:[ComptesconnexionGuard] */,
      },

      {
        path: 'contrat',
        component: ContratComponent,
        canActivate: [AuthGuardGuard],
      },

      {
        path: 'commissions',
        component: CommissionsComponent,
        canActivate: [AuthGuardGuard],
      },
      {
        path: 'reclamations',
        component: ReclamationComponent,
        canActivate: [AuthGuardGuard],
      },
      {
        path: 'parametrages',
        component: ParametragesComponent,
        canActivate: [AuthGuardGuard],
      },
      {
        path: 'profil',
        component: ProfilComponent,
        canActivate: [AuthGuardGuard],
      },

      /*  { path: 'etat', component: EtatComponent },
       { path: 'home', component: HomeComponent }, */
    ],
  },

  { path: '**', component: PagenotfoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
