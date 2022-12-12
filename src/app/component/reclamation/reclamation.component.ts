import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Commission } from 'src/app/model/commission.model';
import { Facturier } from 'src/app/model/facturier';
import { AuditConnexionService } from 'src/app/services/audit-connexion.service';
import { AuthService } from 'src/app/services/auth.service';
import { AutoLogoutService } from 'src/app/services/auto-logout.service';
import { CommissionService } from 'src/app/services/commission.service';
import { ErreurGenererService } from 'src/app/services/erreur-generer.service';
import { ExcelService } from 'src/app/services/excel.service';
import { FacturierService } from 'src/app/services/facturier.service';
import { environment } from 'src/environments/environment';
import { ReclamationsService } from '../../services/reclamations.service';

@Component({
  selector: 'app-reclamation',
  templateUrl: './reclamation.component.html',
  styleUrls: ['./reclamation.component.scss'],
  providers: [MessageService],
})
export class ReclamationComponent implements OnInit {
  ReclamationData!: any;
  p: number = 1;
  formRechercheReclamation!: FormGroup;
  erreur!: FormGroup;
  isDisable!: boolean;
  isDisable1!: boolean;
  commissionData!: Commission[];
  facturierData!: Facturier[];
  aut: any = localStorage.getItem('authhabilitation');
  hab: undefined = JSON.parse(this.aut);
  UI: any;
  habb: any;


  firstDate! : Date;
  lastDate! : Date;
  login= ''
  nom= ''
  reference= ''
  facturier= ''
  remplir!: number;

  constructor(
    private httpClient: HttpClient,
    private messageService: MessageService,
    private formbuilber: FormBuilder,
    private api: ReclamationsService,
    private apiError: ErreurGenererService,
    private excelService: ExcelService,
    public authService: AuthService,
    public autoLogoutService: AutoLogoutService,
    private router: Router,
    private commissionService: CommissionService,
    private facturierService: FacturierService
  ) {}

  ngOnInit(): void {
    this.authService.infoUser(localStorage.getItem('authlogin')).subscribe(
      (res) => {
        console.log(res);
        if (res) {
          this.UI = res;
          this.habb = res.habilitation;
          if (this.habb != 'ROLE_ADMIN' && this.habb != 'ROLE_SUPER_ADMIN') {
            this.autoLogoutService.Logout(this.router);
            this.router.navigate(['/authentication'], {
              queryParams: { returnUrl: this.router.routerState.snapshot.url },
            });
          } else {
            this.getallReclamations();
            this.formRechercheReclamations();
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

  formRechercheReclamations(): void {
    this.formRechercheReclamation = this.formbuilber.group({
      nom: [''],
      login: [''],
      facturier: [''],
      reference: [''],
      firstDate: [''],
      lastDate: [''],
    });
  }
  getallReclamations() {
    this.api.listeReclamation().subscribe(
      (res) => {
        this.ReclamationData = res;
      },
      (err) => {
        if (err.status != 401) {
          this.erreur = this.formbuilber.group({
            httpStatusCode: err.status,
            methode: 'UserAuditeImpl.listAudit',
            login: localStorage.getItem('authlogin'),
            description: 'Erreur de consultation des audites',
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
  SearchUser() {
    if(this.firstDate == null || this.lastDate == null){
      this.remplir = 1;
    }else{
      this.remplir = 0;
    }


    this.api
      .rechercheReclamation(
        this.firstDate,
        this.lastDate,
        this.login,
        this.nom,
        this.facturier,
        this.reference
      )
      .subscribe(
        (data) => {
          this.ReclamationData = data;
        },
        (err) => {
          if (err.status != 401) {
            if (
              this.login != null &&
              this.nom != null &&
              this.facturier != null &&
              this.reference != null
            ) {
              this.api
                .getReclamation(this.login, this.nom, this.facturier, this.reference)
                .subscribe((resp) => {
                  this.ReclamationData = resp;
                });
            } else {
              this.getallReclamations();
            }

            this.erreur = this.formbuilber.group({
              httpStatusCode: err.status,
              methode: '',
              login: localStorage.getItem('authlogin'),
              description: "Erreur d'affichage des resultats des recherches",
              message: err.message,
            });
          }
          this.apiError
            .addErreurGenerer(this.erreur.value)
            .subscribe((data) => {});

          this.autoLogoutService.autoLogout(err.status, this.router);
        }
      );
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
  exportAsXLSX(): void {
    this.excelService.exportAsExcelFile(this.ReclamationData, 'Audit');
  }

  annuler() {
    this.formRechercheReclamation.reset;
    location.reload();
    this.isDisable = false;
    this.isDisable1 = false;
  }
  block() {
    this.isDisable = true;
  }
  block1() {
    this.isDisable1 = true;
  }
}
