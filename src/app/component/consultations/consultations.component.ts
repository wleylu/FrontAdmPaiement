import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Commission } from 'src/app/model/commission.model';
import { Facturier } from 'src/app/model/facturier';
import { AuthService } from 'src/app/services/auth.service';
import { AutoLogoutService } from 'src/app/services/auto-logout.service';
import { ConsultationsServiceService } from 'src/app/services/consultations-service.service';
import { ErreurGenererService } from 'src/app/services/erreur-generer.service';
import { ExcelService } from 'src/app/services/excel.service';
import { FacturierService } from 'src/app/services/facturier.service';
import { environment } from 'src/environments/environment';
import { CommissionService } from '../../services/commission.service';

@Component({
  selector: 'app-consultations',
  templateUrl: './consultations.component.html',
  styleUrls: ['./consultations.component.scss'],
  providers: [MessageService],
})
export class ConsultationsComponent implements OnInit {
  formRechercheConsultation!: FormGroup;
  consultationData: any;
  p: number = 1;
  erreur!: FormGroup;
  isDisable!: boolean;
  isDisable1!: boolean;
  facturierData!: Facturier[];

  firstDate! : Date;
  lastDate! : Date;
  login= ''
  identifiant= ''
  referenceFt= ''
  facturier= ''

  aut: any = localStorage.getItem('authhabilitation');
  hab: undefined = JSON.parse(this.aut);
  UI: any;
  habb: any;
  remplir!: number;
  constructor(
    private messageService: MessageService,
    private formbuilber: FormBuilder,
    private api: ConsultationsServiceService,
    private apiError: ErreurGenererService,
    private excelService: ExcelService,
    private router: Router,
    public authService: AuthService,
    public autoLogoutService: AutoLogoutService,
    private facturierService: FacturierService
  ) {}

  ngOnInit() {
    this.authService.infoUser(localStorage.getItem('authlogin')).subscribe(
      (res) => {
        console.log(res);
        if (res) {
          this.UI = res;
          this.habb = res.habilitation;
          if (
            this.habb != 'ROLE_SUPER_ADMIN' &&
            this.habb != 'ROLE_ADMIN' &&
            this.habb != 'ROLE_HELPDESK' &&
            this.habb != 'ROLE_SUPERVISEUR' &&
            this.habb != 'ROLE_USER' &&
            this.habb != 'ROLE_MONETIQUE' &&
            this.habb != 'ROLE_SUPPORT' &&
            this.habb != 'ROLE_AUDIT' &&
            this.habb != 'ROLE_COMPTABILITE'
          ) {
            this.autoLogoutService.Logout(this.router);
            this.router.navigate(['/authentication'], {
              queryParams: { returnUrl: this.router.routerState.snapshot.url },
            });
          } else {
            this.getConsultations();
            this.formRechercheConsultations();
            this.listFacture();
          }
        }
      },
      (err) => {
        this.autoLogoutService.Logout(this.router);
        this.router.navigate(['/authentication'], {
          queryParams: { returnUrl: this.router.routerState.snapshot.url },
        });
      }
    );
  }
  formRechercheConsultations(): void {
    this.formRechercheConsultation = this.formbuilber.group({
      login: [''],
      referenceFt: [''],
      facturier: [''],
      identifiant: [''],
      firstDate: [''],
      lastDate: [''],
    });
  }
  listFacture() {
    this.facturierService.getFacturier().subscribe(
      (res) => {
        this.facturierData = res;
      },
      (err) => {
        if (err.status != 401) {
          this.erreur = this.formbuilber.group({
            httpStatusCode: err.status,
            methode: 'facturier.liste',
            login: localStorage.getItem('authlogin'),
            description: 'Erreur de consultation des Facturier',
            message: err.message,
          });

          this.apiError
            .addErreurGenerer(this.erreur.value)
            .subscribe((data) => {});
        }

        this.autoLogoutService.autoLogout(err.status, this.router);
      }
    );
  }
  getConsultations() {
    this.api.getConsultation().subscribe(
      (res) => {
        this.consultationData = res;
      },
      (err) => {
        if (err.status != 401) {
          this.erreur = this.formbuilber.group({
            httpStatusCode: err.status,
            methode: 'ConsultationImpl.listHistorique',
            login: localStorage.getItem('authlogin'),
            description: 'Erreur de consultation des Transactions',
            message: err.message,
          });

          this.apiError
            .addErreurGenerer(this.erreur.value)
            .subscribe((data) => {});
        }

        this.autoLogoutService.autoLogout(err.status, this.router);
      }
    );
  }

  Search(){
    if(this.firstDate == null || this.lastDate == null){
      this.remplir = 1;
    }else{
      this.remplir = 0;
    }


    this.api
      .getrechercheConsultation(
        this.firstDate,
        this.lastDate,
        this.login,
        this.referenceFt,
        this.facturier,
        this.identifiant
      )
      .subscribe(
        (data) => {
          this.consultationData = data;
        },
        (err) => {
          if (
            this.login != null &&
            this.referenceFt != null &&
            this.facturier != null &&
            this.identifiant != null
          ) {
            this.api
              .recherche(this.login, this.referenceFt, this.facturier, this.identifiant)
              .subscribe((resp) => {
                this.consultationData = resp;
              });
          } else {
            this.getConsultations();
          }

          if (err.status != 401) {
            this.erreur = this.formbuilber.group({
              httpStatusCode: err.status,
              methode: 'ConsultationImpl.vueConsultation',
              login: localStorage.getItem('authlogin'),
              description: 'Erreur de consultation des Resultats de recherche',
              message: err.message,
            });

            this.apiError
              .addErreurGenerer(this.erreur.value)
              .subscribe((data) => {});
          }

          this.autoLogoutService.autoLogout(err.status, this.router);
        }
      );
  }
  SearchUser1(firstDate: string, lastDate: string): void {
    firstDate = this.formRechercheConsultation.value.firstDate;
    lastDate = this.formRechercheConsultation.value.lastDate;

    this.api.rechercheByDateBetween(firstDate, lastDate).subscribe(
      (data) => {
        this.consultationData = data;
        this.isDisable = true;
      },
      (err) => {
        this.autoLogoutService.autoLogout(err.status, this.router);
      }
    );
  }
  exportAsXLSX(): void {
    this.excelService.exportAsExcelFile(this.consultationData, 'Consultation');
  }
  annuler() {
    this.formRechercheConsultation.reset;

    location.reload();
  }
  block() {
    this.isDisable = true;
  }
  block1() {
    this.isDisable1 = true;
  }
}
