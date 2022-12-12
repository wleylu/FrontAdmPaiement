import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { Facturier, Plafond, TypePaiement } from 'src/app/model/parametrages';
import { User } from 'src/app/model/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { AutoLogoutService } from 'src/app/services/auto-logout.service';
import { ErreurGenererService } from 'src/app/services/erreur-generer.service';
import { ParametragesService } from 'src/app/services/parametrages.service';
import { CreationcompteService } from '../../services/creationcompte.service';

@Component({
  selector: 'app-parametrages',
  templateUrl: './parametrages.component.html',
  styleUrls: ['./parametrages.component.scss'],
  providers: [MessageService],
})
export class ParametragesComponent implements OnInit {
  items!: MenuItem[];
  show!: number;
  uploadedFiles: any[] = [];
  formPlafond!: FormGroup;
  formPlafond1!: FormGroup;
  formPlafond2!: FormGroup;
  formTypesPaie!: FormGroup;
  formFacturier!: FormGroup;
  plafondData!: any;
  typePaieData!: any;
  facturierData!: any;
  plafondObj: Plafond = new Plafond();
  plafondObjType: any;
  plafondObjs: Plafond = new Plafond();
  plafondObjs1: Plafond = new Plafond();
  plafondObj1: Plafond = new Plafond();
  typePaieObj: TypePaiement = new TypePaiement();
  facturierObj: Facturier = new Facturier();
  isDisable!: boolean;
  showAdd!: number;
  erreur!: number;
  type!: number;
  formValue: any;
  listModes!: TypePaiement[];
  errors!: FormGroup;

  firstConnexionForm!: FormGroup;
  submitted: boolean = false;
  user = new User();
  compteuserObj = new User();

  confirmErreur!: number;
  loginUser: any = localStorage.getItem('authlogin');
  /***************************type confirmation */

  aut: any = localStorage.getItem('authhabilitation');
  hab: undefined = JSON.parse(this.aut);
  UI: any;
  habb: any;
  constructor(
    private messageService: MessageService,
    private apiError: ErreurGenererService,
    private api: ParametragesService,
    private formbuilber: FormBuilder,
    private router: Router,
    public authService: AuthService,
    public autoLogoutService: AutoLogoutService,
    private creationcompteService: CreationcompteService
  ) {}

  ngOnInit(): void {
    this.items = [
      {
        label: 'Plafond',
        icon: 'pi pi-chart-line',
        command: () => {
          this.onFormPlafond();
        },
      },
    ];
    this.getallPlafonds();
    this.formPlafonds1();
    this.formPlafonds2();
    this.formTypesPaies();
    this.initForm();
    this.listmodepaiement();
    this.firstConnexionForm = this.formbuilber.group({
      password: ['', Validators.required],
      password1: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }
  onFormPlafond() {
    this.show = 1;
  }

  onModifierPassword() {
    this.show = 2;
  }
  onFormFacturiers() {
    this.show = 3;
  }
  onUpload(event: any) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
  }

  isControleUpdateMdp(controlName: string, validationType: string) {
    const control = this.firstConnexionForm.controls[controlName];
    if (!control) {
      return false;
    }
    const result =
      control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }

  formPlafonds1() {
    this.formPlafond1 = this.formbuilber.group({
      nombreFacture1: ['', Validators.required],
      montantMax1: ['', Validators.required],
    });
  }
  formPlafonds2() {
    this.formPlafond2 = this.formbuilber.group({
      nombreFacture2: ['', Validators.required],
      montantMax2: ['', Validators.required],
    });
  }
  formTypesPaies() {
    this.formTypesPaie = this.formbuilber.group({
      type: '',
      libelle: '',
    });
  }
  getallPlafonds() {
    this.api.getPlafond().subscribe(
      (res) => {
        this.plafondObjType = res;
      },
      (err) => {
        this.autoLogoutService.autoLogout(err.status, this.router);
      }
    );
  }
  getPlafonds1() {
    this.type = 1;
    this.api.plafondType(this.plafondObj.typePlafond).subscribe(
      (res) => {
        this.plafondData = res;
      },
      (err) => {
        this.autoLogoutService.autoLogout(err.status, this.router);
      }
    );
  }

  isControle(controlName: string, validationType: string) {
    const control = this.formPlafond1.controls[controlName];
    if (!control) {
      return false;
    }
    const result =
      control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }
  isControles(controlName: string, validationType: string) {
    const control = this.formPlafond2.controls[controlName];
    if (!control) {
      return false;
    }
    const result =
      control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }

  postPlafond1() {
    const controls = this.formPlafond1.controls;
    if (this.formPlafond1.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
      return;
    }
    this.plafondObj.nombreFacture = this.formPlafond1.value.nombreFacture1;
    this.plafondObj.montantMax = this.formPlafond1.value.montantMax1;
    this.plafondObj.typePlafond = 0;
    this.plafondObj.loginAdd = this.loginUser;
    this.plafondObj.loginMaj = this.loginUser;

    this.api.postPlafond(this.plafondObj).subscribe(
      (res) => {
        this.plafondObjs = res;
        if (
          this.plafondObjs.montantMax == 0 &&
          this.plafondObjs.nombreFacture == 0
        ) {
          this.erreur = 1;
        } else {
          this.messageService.add({
            severity: 'success',
            summary: 'Succes',
            detail: 'Plafond ajouter avec succes',
          });
          let ref = document.getElementById('cancel');
          ref?.click();
          this.formPlafond1.reset();

          this.erreur = 3;
          this.getallPlafonds();
        }
      },
      (err) => {
        this.errors = this.formbuilber.group({
          httpStatusCode: err.status,
          methode: 'PlafondImp.addPlafond',
          login: localStorage.getItem('authlogin'),
          description: "Erreur d'ajout de plafond",
          message: err.message,
        });
        this.apiError
          .addErreurGenerer(this.errors.value)
          .subscribe((data) => {});

        this.autoLogoutService.autoLogout(err.status, this.router);
      }
    );
  }
  postPlafond2() {
    const controls = this.formPlafond2.controls;
    if (this.formPlafond2.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
      return;
    }

    this.plafondObj1.nombreFacture = this.formPlafond2.value.nombreFacture2;
    this.plafondObj1.montantMax = this.formPlafond2.value.montantMax2;
    this.plafondObj1.typePlafond = 1;
    this.plafondObj1.loginAdd = this.loginUser;
    this.plafondObj1.loginMaj = this.loginUser;

    this.api.postPlafond(this.plafondObj1).subscribe(
      (res) => {
        this.plafondObjs1 = res;
        if (
          this.plafondObjs1.montantMax == 0 &&
          this.plafondObjs1.nombreFacture == 0
        ) {
          this.erreur = 0;
        } else {
          this.messageService.add({
            severity: 'success',
            summary: 'Succes',
            detail: 'Plafond ajouter avec succes',
          });
          let ref = document.getElementById('cancel');
          ref?.click();
          this.formPlafond2.reset();

          this.erreur = 3;
          this.getallPlafonds();
        }
      },
      (err) => {
        this.errors = this.formbuilber.group({
          httpStatusCode: err.status,
          methode: 'PlafondImp.addPlafond',
          login: localStorage.getItem('authlogin'),
          description: "Erreur d'ajout de plafond",
          message: err.message,
        });
        this.apiError
          .addErreurGenerer(this.errors.value)
          .subscribe((data) => {});

        this.autoLogoutService.autoLogout(err.status, this.router);
      }
    );
  }
  onAnnuler1() {
    this.formPlafond2.reset();
    this.erreur = 3;
  }
  onAnnuler2() {
    this.formPlafond1.reset();
    this.erreur = 3;
  }
  ondesactiver() {
    this.showAdd = 0;

    this.isDisable = true;
  }
  onEdit(row: any) {
    this.plafondObj.nombreFacture = row.nombreFacture;
    this.plafondObj = row;

    this.formPlafond.controls['nombreFacture'].setValue(row.nombreFacture);
    this.formPlafond.controls['montantMax'].setValue(row.montantMax);
    this.formPlafond.controls['typePlafond'].setValue(row.typePlafond);

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
  updatePlafond() {
    this.plafondObj.nombreFacture = this.formPlafond.value.nombreFacture;
    this.plafondObj.montantMax = this.formPlafond.value.montantMax;
    this.plafondObj.typePlafond = this.formPlafond.value.typePlafond;
    this.plafondObj.loginMaj = this.loginUser;
    this.api.plafondUpdate(this.plafondObj).subscribe(
      (res) => {
        alert('modification avec succes');

        let ref = document.getElementById('cancel');
        ref?.click();
        this.formPlafond.reset();
        this.getallPlafonds();
      },
      (err) => {
        this.autoLogoutService.autoLogout(err.status, this.router);
      }
    );
  }
  onLoggedin() {
    const controls = this.firstConnexionForm.controls;
    if (this.firstConnexionForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
      return;
    }

    if (
      this.firstConnexionForm.value.password1 != null &&
      this.firstConnexionForm.value.password1 != ''
    ) {
      if (
        this.firstConnexionForm.value.password1 ===
        this.firstConnexionForm.value.confirmPassword
      ) {
        this.compteuserObj.login = this.loginUser;
        this.compteuserObj.password = this.firstConnexionForm.value.password;
        this.compteuserObj.password1 = this.firstConnexionForm.value.password1;
        this.compteuserObj.mdpOublie = this.compteuserObj.password1;

        this.creationcompteService
          .detailUser(this.compteuserObj.login)
          .subscribe((data) => {
            if (this.compteuserObj.password == data.mdpOublie) {
              this.authService
                .firstconnexion(this.compteuserObj)
                .subscribe((res) => {
                  if (res.password !== res.password1) {
                    localStorage.removeItem('authisAuth1');
                    localStorage.removeItem('authbloquser');
                    localStorage.removeItem('authclient');
                    localStorage.removeItem('authdateCreation');
                    localStorage.removeItem('authemail');
                    localStorage.removeItem('authhabilitation');
                    localStorage.removeItem('authlogin');
                    localStorage.removeItem('authnom');
                    localStorage.removeItem('authpassword');
                    localStorage.removeItem('authpassword1');
                    localStorage.removeItem('authpassword2');
                    localStorage.removeItem('authprenom');
                    localStorage.removeItem('authstatus');
                    localStorage.removeItem('authtel');
                    localStorage.removeItem('authtypePlanfond');
                    localStorage.removeItem('authvalidation');
                    this.router.navigate(['authentication']);
                  } else {
                    this.router.navigate(['/app/parametrages']);
                  }
                });
            } else {
            }
          });
      } else {
        this.confirmErreur = 1;
      }
    } else {
      this.confirmErreur = 2;
    }
  }
  /*-------------------------------------------type paiement------------------------------------------------------*/
  initForm(): void {
    this.formValue = this.formbuilber.group({
      type: '',
      libelle: '',
      loginAdd: this.loginUser,
      loginMaj: this.loginUser,
    });
  }
  listmodepaiement() {
    this.api.getTypePaie().subscribe(
      (res) => {
        this.listModes = res;
      },
      (err) => {
        this.errors = this.formbuilber.group({
          httpStatusCode: err.status,
          methode: 'TypePaieImp.TypePaie',
          login: localStorage.getItem('authlogin'),
          description: 'Erreur de consultation des confirmation de paiement',
          message: err.message,
        });
        this.apiError
          .addErreurGenerer(this.errors.value)
          .subscribe((data) => {});

        this.autoLogoutService.autoLogout(err.status, this.router);
      }
    );
  }
  /*

code permettant de verifier s'il existe une valeur de type int deja enregistré */

  ajoutmodepaiement() {
    this.api.getTypePaye(this.formValue.value.type).subscribe((data) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Succes',
        detail: 'Plafond ajouter avec succes',
      });
      if (data) {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Ce type de confirmation est déja parametré',
        });
      }
      if (data === null) {
        const formData = this.formValue.value;
        this.api.postTypePaie(formData).subscribe((data) => {
          this.listmodepaiement();
          this.formValue.reset();
        });
      }
    });
  }
  getallTypePaiement() {
    this.api.getTypePaie().subscribe((res) => {
      this.typePaieData = res;
    });
  }
  postTypePaie() {
    this.typePaieObj.type = this.formTypesPaie.value.type;
    this.typePaieObj.loginAdd = this.loginUser;
    this.typePaieObj = this.loginUser;

    this.api.postTypePaie(this.typePaieObj).subscribe(
      (res) => {
        alert('compte ajouté avec success');
        let ref = document.getElementById('cancel');
        ref?.click();
        this.formTypesPaie.reset();
        this.getallTypePaiement();
      },
      (err) => {
        alert("une erreure c'est produite");
      }
    );
  }

  onEdiTypePaie(row: any) {
    this.typePaieObj.type = row.type;
    this.typePaieObj = row;

    this.formTypesPaie.controls['type'].setValue(row.type);

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
    this.typePaieObj.type = this.formTypesPaie.value.type;
    this.typePaieObj = this.loginUser;

    this.api.modifiertypePaie(this.typePaieObj).subscribe((res) => {
      alert('modification avec succes');

      let ref = document.getElementById('cancel');
      ref?.click();
      this.formTypesPaie.reset();
      this.getallTypePaiement();
    });
  }
}
