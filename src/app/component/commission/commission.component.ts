import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Commission } from 'src/app/model/commission.model';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { from } from 'rxjs';
import { CommissionService } from 'src/app/services/commission.service';
import {
  ConfirmationService,
  Message,
  MessageService,
  PrimeNGConfig,
} from 'primeng/api';
import { ErreurGenererService } from 'src/app/services/erreur-generer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AutoLogoutService } from 'src/app/services/auto-logout.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FacturierService } from 'src/app/services/facturier.service';
import { Facturier } from 'src/app/model/facturier';
@Component({
  selector: 'app-commission',
  templateUrl: './commission.component.html',
  styleUrls: ['./commission.component.scss'],
  providers: [MessageService, ConfirmationService],
})
export class CommissionComponent implements OnInit {
  formValue!: FormGroup;
  formula1 = '100-pourCommarch';
  formula2 = '(montantCommission*pourCommarch)/100';
  formula3 = '(montantCommission*pourCombank)/100';
  formRechercheCommissions!: FormGroup;
  commissionData!: any;
  showAdd!: number;
  isDisable = false;
  commissionObj: Commission = new Commission();
  p: number = 1;
  erreur!: FormGroup;
  msgs: Message[] = [];
  facturierData!: Facturier[];
  position!: string;
  loginConnect!: any;
  aut: any = localStorage.getItem('authhabilitation');
  hab: undefined = JSON.parse(this.aut);
  UI: any;
  habb: any;
  facturier = '';
  libelle = ''
  constructor(
    private messageService: MessageService,
    private api: CommissionService,
    private formbuilber: FormBuilder,
    private apiError: ErreurGenererService,
    private router: Router,
    public authService: AuthService,
    public autoLogoutService: AutoLogoutService,
    private confirmationService: ConfirmationService,
    private primengConfig: PrimeNGConfig,
    private facturierService: FacturierService
  ) {}

  ngOnInit(): void {
    this.authService.infoUser(localStorage.getItem('authlogin')).subscribe(
      (res) => {
        console.log(res);
        if (res) {
          this.UI = res;
          this.habb = res.habilitation;
          if (
            this.habb != 'ROLE_COMPTABILITE' &&
            this.habb != 'ROLE_ADMIN' &&
            this.habb != 'ROLE_SUPER_ADMIN'
          ) {
            this.autoLogoutService.Logout(this.router);
            this.router.navigate(['/authentication'], {
              queryParams: { returnUrl: this.router.routerState.snapshot.url },
            });
          } else {
            this.initForm();
            this.getallCommission();
            this.formRechercheCommission();
            this.listFacture();
            this.primengConfig.ripple = true;
            this.loginConnect = localStorage.getItem('authlogin');
            console.log(this.loginConnect + 'LOG');
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
  initForm(): void {
    this.formValue = this.formbuilber.group({
      facturier: [
        this.commissionObj.facturier,
        [Validators.required, Validators.minLength(1)],
      ],
      montantCommission: [
        this.commissionObj.montantCommission,
        [Validators.required],
      ],
      mntMin: [
        this.commissionObj.mntMin,
        [Validators.required],
      ],
      mntMax: [
        this.commissionObj.mntMax,
        [Validators.required],
      ],
      pourCommarch: [this.commissionObj.pourCommarch, [Validators.required]],
      pourCombank: [
        { value: this.commissionObj.pourCombank, disable: true },
        [Validators.required],
      ],
      commissionFacturier: [
        { value: this.commissionObj.commissionFacturier, disable: true },
        [Validators.required],
      ],
      commissionBanque: [
        { value: this.commissionObj.commissionBanque, disable: true },
        [Validators.required],
      ],
      libelle: [this.commissionObj.libelle, [Validators.required]],
      habilitation: [this.commissionObj.habilitation, [Validators.required]],
      mntTimbre: [this.commissionObj.mntTimbre, [Validators.required]],

    });
    this.setupRecalculation();
  }

  formRechercheCommission() {
    this.formRechercheCommissions = this.formbuilber.group({
      facturier: [''],
      libelle: [''],
    });
  }
  getallCommission() {
    this.api.getCommission().subscribe(
      (res) => {
        this.commissionData = res;
      },
      (err) => {
        if (err.status != 401) {
          this.erreur = this.formbuilber.group({
            httpStatusCode: err.status,
            methode: 'CommissionImpl.listCommissions',
            login: localStorage.getItem('authlogin'),
            description: 'Erreur de consultation des Commissions',
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
  isControle(controlName: string, validationType: string) {
    const control = this.formValue.controls[controlName];
    if (!control) {
      return false;
    }
    const result =
      control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }
  clickAddCommission() {
    this.formValue.reset();
    this.showAdd = 1;
    this.isDisable = false;
  }

  postCommission() {
    const controls = this.formValue.controls;
    if (this.formValue.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
      return;
    }

    this.commissionObj.facturier = this.formValue.value.facturier;
    this.commissionObj.montantCommission =this.formValue.value.montantCommission;
    this.commissionObj.mntMin=this.formValue.value.mntMin;
    this.commissionObj.mntMax= this.formValue.value.mntMax;
    this.commissionObj.pourCommarch = this.formValue.value.pourCommarch;
    this.commissionObj.pourCombank = this.formValue.value.pourCombank;
    this.commissionObj.commissionFacturier =this.formValue.value.commissionFacturier;
    this.commissionObj.commissionBanque = this.formValue.value.commissionBanque;
    this.commissionObj.libelle = this.formValue.value.libelle;
    this.commissionObj.habilitation = this.formValue.value.habilitation;
    this.commissionObj.mntTimbre = this.formValue.value.mntTimbre;
    this.commissionObj.loginAdd = this.loginConnect;
    this.commissionObj.loginMaj = this.loginConnect;
    console.log(this.commissionObj);
    this.api.postCommission(this.commissionObj).subscribe(
      (res) => {
        if (res.libelle != null) {
          this.messageService.add({
            severity: 'success',
            summary: 'Succes',
            detail: 'Commission enregistré avec succes',
          });
          this.formValue.reset();
          this.getallCommission();
        }else{
          this.messageService.add({
            severity: 'warn',
            summary: 'Avertissement',
            detail: 'Le libelle de la commission existe deja',
          });
        }
      },
      (err) => {
        if (err.status != 401) {
          this.erreur = this.formbuilber.group({
            httpStatusCode: err.status,
            methode: 'CommissionImpl.ajouterCommission',
            login: localStorage.getItem('authlogin'),
            description: "Erreur d'ajout des Commissions",
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
  onEdit(row: Commission) {
    this.showAdd = 0;
    this.commissionObj.idCommission = row.idCommission;
    this.commissionObj = row;

    this.formValue.controls['facturier'].setValue(row.facturier);

    this.formValue.controls['montantCommission'].setValue(
      row.montantCommission
    );
    this.formValue.controls['mntMin'].setValue(row.mntMin);
    this.formValue.controls['mntMax'].setValue(row.mntMax);
    this.formValue.controls['pourCommarch'].setValue(row.pourCommarch);
    this.formValue.controls['pourCombank'].setValue(row.pourCombank);
    this.formValue.controls['commissionFacturier'].setValue(
      row.commissionFacturier
    );
    this.formValue.controls['commissionBanque'].setValue(row.commissionBanque);
    this.formValue.controls['libelle'].setValue(row.libelle);
    this.formValue.controls['habilitation'].setValue(row.habilitation);
    this.formValue.controls['mntTimbre'].setValue(row.mntTimbre);

    this.setupRecalculation();
    this.isDisable = false;

    /*
      this.formValue.controls['nom'].setValue(row.nom);
      this.formValue.controls['prenom'].setValue(row.prenom);
      this.formValue.controls['login'].setValue(row.login);
      this.formValue.controls['email'].setValue(row.email);
      this.formValue.controls['telephone'].setValue(row.telephone);
      this.formValue.controls['password'].setValue(row.password);
      this.formValue.controls['roles'].setValue(row.roles);
     */
  }
  onEdite(row: any) {
    this.showAdd = 2;
    this.commissionObj.idCommission = row.idCommission;
    this.commissionObj = row;

    this.formValue.controls['facturier'].setValue(row.facturier);

    this.formValue.controls['montantCommission'].setValue(
      row.montantCommission
    );
    this.formValue.controls['mntMin'].setValue(row.mntMin);
    this.formValue.controls['mntMax'].setValue(row.mntMax);
    this.formValue.controls['pourCommarch'].setValue(row.pourCommarch);
    this.formValue.controls['pourCombank'].setValue(row.pourCombank);
    this.formValue.controls['commissionFacturier'].setValue(
      row.commissionFacturier
    );
    this.formValue.controls['commissionBanque'].setValue(row.commissionBanque);
    this.formValue.controls['libelle'].setValue(row.libelle);
    this.formValue.controls['habilitation'].setValue(row.habilitation);
    this.formValue.controls['mntTimbre'].setValue(row.mntTimbre);

    this.isDisable = true;

    this.setupRecalculation();
    /*
      this.formValue.controls['nom'].setValue(row.nom);
      this.formValue.controls['prenom'].setValue(row.prenom);
      this.formValue.controls['login'].setValue(row.login);
      this.formValue.controls['email'].setValue(row.email);
      this.formValue.controls['telephone'].setValue(row.telephone);
      this.formValue.controls['password'].setValue(row.password);
      this.formValue.controls['roles'].setValue(row.roles);
     */
  }

  updateCommission() {
    this.commissionObj.facturier = this.formValue.value.facturier;
    this.commissionObj.montantCommission =this.formValue.value.montantCommission;
    this.commissionObj.mntMin=this.formValue.value.mntMin;
    this.commissionObj.mntMax= this.formValue.value.mntMax
    this.commissionObj.pourCommarch = this.formValue.value.pourCommarch;
    this.commissionObj.pourCombank = this.formValue.value.pourCombank;
    this.commissionObj.commissionFacturier =
      this.formValue.value.commissionFacturier;
    this.commissionObj.commissionBanque = this.formValue.value.commissionBanque;
    this.commissionObj.libelle = this.formValue.value.libelle;
    this.commissionObj.habilitation = this.formValue.value.habilitation;
    this.commissionObj.mntTimbre = this.formValue.value.mntTimbre;

    this.commissionObj.loginMaj = this.loginConnect;

    this.api.updateCommission(this.commissionObj).subscribe(
      (res) => {
        if (res.libelle != null) {
          this.messageService.add({
            severity: 'success',
            summary: 'Succes',
            detail: 'Commission enregistré avec succes',
          });
          this.formValue.reset();
          let ref = document.getElementById('cancel');
          ref?.click();
          this.getallCommission();
        }else{
          this.messageService.add({
            severity: 'warn',
            summary: 'Avertissement',
            detail: 'Le libelle de la commission existe deja',
          });
        }
      },
      (err) => {
        if (err.status != 401) {
          this.erreur = this.formbuilber.group({
            httpStatusCode: err.status,
            methode: 'CommissionImpl.modifierCommission',
            login: localStorage.getItem('authlogin'),
            description: 'Erreur de modification de Commission',
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
  Search(): void {


    this.api.getrecherchecommission(this.facturier, this.libelle).subscribe(
      (data) => {
        this.commissionData = data;
      },
      (err) => {
        if (err.status != 401) {
          this.erreur = this.formbuilber.group({
            httpStatusCode: err.status,
            methode: 'CommissionImpl.rechercheByCommission',
            login: localStorage.getItem('authlogin'),
            description: "Erreur d'affichage des resultat de recherche",
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
  calculateResult(
    formValue: any,
    formulaName: 'formula1' | 'formula2' | 'formula3'
  ) {
    let formula = this[formulaName];
    Object.keys(formValue).forEach(
      (variable) =>
        (formula = formula.replaceAll(variable, formValue[variable]))
    );
    return eval(formula);
  }

  setupRecalculation() {
    this.formValue.valueChanges.subscribe(
      (value) => {
        value.pourCombank = this.calculateResult(value, 'formula1');
        value.commissionFacturier = this.calculateResult(value, 'formula2');
        value.commissionBanque = this.calculateResult(value, 'formula3');
        this.formValue.controls.pourCombank.setValue(value.pourCombank, {
          emitEvent: false,
        });
        this.formValue.controls.commissionFacturier.setValue(
          value.commissionFacturier,
          { emitEvent: false }
        );
        this.formValue.controls.commissionBanque.setValue(
          value.commissionBanque,
          { emitEvent: false }
        );
      },
      (err) => {
        this.autoLogoutService.autoLogout(err.status, this.router);
      }
    );
  }

  onDelete(row: any) {
    this.commissionObj.idCommission = row.idCommission;
    this.commissionObj = row;

    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir continuer?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.api
          .deleteCommission(this.commissionObj.idCommission)
          .subscribe((res) => {
            this.getallCommission();
          });
        this.msgs = [
          {
            severity: 'info',
            summary: 'Confirmed',
            detail: 'Commission supprimer avec succès',
          },
        ];
      },
      reject: () => {
        this.msgs = [
          { severity: 'info', summary: 'Rejected', detail: 'Vous avez rejeté' },
        ];
      },
    });
  }
}
