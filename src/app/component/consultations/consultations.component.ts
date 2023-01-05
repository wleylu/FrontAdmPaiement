import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Agence } from 'src/app/model/agence.model';
import { Commission } from 'src/app/model/commission.model';
import { Comptemarchand } from 'src/app/model/comptemarchand.model';
import { Facturier } from 'src/app/model/facturier';
import { Marchand } from 'src/app/model/marchand.model';
import { AuthService } from 'src/app/services/auth.service';
import { AutoLogoutService } from 'src/app/services/auto-logout.service';
import { ConsultationsServiceService } from 'src/app/services/consultations-service.service';
import { CreationcompteService } from 'src/app/services/creationcompte.service';
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
  listTransactions! :Marchand[];
  p: number = 1;
  erreur!: FormGroup;
  isDisable!: boolean;
  isDisable1!: boolean;
  facturierData!: Facturier[];
  agences!: Agence[];
  firstDate! : Date;
  lastDate! : Date;

  firstDate1: string="";
  lastDate1: string="";

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
    private compteCreation: CreationcompteService,
    public autoLogoutService: AutoLogoutService,
    private facturierService: FacturierService
  ) {}

  ngOnInit() {
    this.formRechercheConsultations();
    this.authService.infoUser(localStorage.getItem('authlogin')).subscribe(
      (res) => {
       // console.log(res);
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
            this.agence();
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


  formRechercheConsultations() {
    this.formRechercheConsultation = this.formbuilber.group({
      login: [''],
      refTransaction: [''],
      codeVille: [''],
      codeTransaction: [''],
      firstDate: [''],
      lastDate: [''],
    });
  }




  agence() {
    this.compteCreation.getAgence().subscribe(
      (res) => {
        this.agences = res;
        //console.log(res);
      },
      (err) => {
        if (err.status != 401) {
          this.erreur = this.formbuilber.group({
            httpStatusCode: err.status,
            methode: 'agence.liste',
            login: localStorage.getItem('authlogin'),
            description: 'Erreur de consultation des agences',
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

     this.api.getAllTransaction(this.formRechercheConsultation.value.login,
      this.formRechercheConsultation.value.refTransaction,
      this.formRechercheConsultation.value.codeTransaction,
      this.formRechercheConsultation.value.firstDate,
      this.formRechercheConsultation.value.lastDate,
      this.formRechercheConsultation.value.codeVille
    ).subscribe(
      (res) => {
        this.listTransactions = res;

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



  exportAsXLSX(): void {
    this.excelService.exportAsExcelFile(this.consultationData, 'Consultation');
  }

  block() {
    this.isDisable = true;
  }
  block1() {
    this.isDisable1 = true;
  }
}
