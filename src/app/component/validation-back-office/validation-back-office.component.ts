import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { Commission } from 'src/app/model/commission.model';
import { Comptemarchand } from 'src/app/model/comptemarchand.model';
import { Comptes } from 'src/app/model/comptes.model';
import { User } from 'src/app/model/user.model';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { AutoLogoutService } from 'src/app/services/auto-logout.service';
import { CreationcompteService } from 'src/app/services/creationcompte.service';
import { ErreurGenererService } from 'src/app/services/erreur-generer.service';

@Component({
  selector: 'app-validation-back-office',
  templateUrl: './validation-back-office.component.html',
  styleUrls: ['./validation-back-office.component.scss'],
  providers: [MessageService],
})
export class ValidationBackOfficeComponent implements OnInit {
  @ViewChild('closebutton') closebutton: any;
  compteuserObj: User = new User();
  compteuserObj1: User = new User();
  compteuserData!: any;
  monStatut: any;
  nom = '';
  loginn = '';
  p: number = 1;
  formValue!: FormGroup;
  editValue!: FormGroup;
  formRecherche!: FormGroup;
  formRechercheUser!: FormGroup;
  modifier!: boolean;
  formRechercheLogin!: FormGroup;
  client: string | any;
  clientUser: string | any;
  comptemarchandObj: Comptemarchand = new Comptemarchand();
  comptemarchandObj1: Comptemarchand = new Comptemarchand();
  compteObj: Comptes = new Comptes();
  compteObj1: Comptes = new Comptes();
  commissionObj: Commission = new Commission();

  compte1: Comptes = new Comptes();
  comptemarchandData!: any;
  signal!: any;
  showAdd!: Boolean;
  login!: string;
  comptesMarch!: Comptes[];
  comptesMarch1!: Comptes[];
  comptesMarch2!: Comptes[];
  commission!: Commission;
  selectcomptesMarch!: Comptes[];
  selectCommission!: Commission;
  commissionData!: Commission[];
  comptesData!: Comptes[];

  searchTerm!: string;

  marchands: Comptemarchand[] = [];
  supprimer!: Boolean;
  rowDelate!: any;

  isInexistClient = false;
  isDisable = true;
  erreur!: FormGroup;
  aut: any = localStorage.getItem('authhabilitation');
  hab: undefined = JSON.parse(this.aut);
  UI: any;
  habb: any;
  constructor(
    private messageService: MessageService,
    private formbuilber: FormBuilder,
    private api: CreationcompteService,
    private modalService: NgbModal,
    private apis: ApiService,
    private router: Router,
    private apiError: ErreurGenererService,
    public authService: AuthService,
    public autoLogoutService: AutoLogoutService
  ) {}

  ngOnInit(): void {
    this.authService.infoUser(localStorage.getItem('authlogin')).subscribe(
      (res) => {
        console.log(res);
        if (res) {
          this.UI = res;
          this.habb = res.habilitation;
          if (this.habb != 'ROLE_SUPER_ADMIN' && this.habb != 'ROLE_ADMIN') {
            this.autoLogoutService.Logout(this.router);
            this.router.navigate(['/authentication'], {
              queryParams: { returnUrl: this.router.routerState.snapshot.url },
            });
          } else {
            this.getallCompteuser();
            this.initForm1();
            this.initFormSearchuser();

            this.getallCommission();
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
  getallCompteuser() {
    this.api.listeUserByProfilBackOffice().subscribe(
      (res) => {
        this.compteuserData = res;
      },
      (err) => {
        if (err.status != 401) {
          this.erreur = this.formbuilber.group({
            httpStatusCode: err.status,
            methode: 'compteImpl.cpt',
            login: localStorage.getItem('authlogin'),
            description: 'Erreur de consultation des Comptes',
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
  Search() {

    let name  = this.nom;
    //let nom = name.toUpperCase();
    let login = this.loginn;
    console.log(this.nom + this.loginn)
    this.api.getrecherchenomlogin(this.loginn, this.nom.toUpperCase()).subscribe(
      (data) => {
        this.compteuserData = data;
      },
      (err) => {
        this.autoLogoutService.autoLogout(err.status, this.router);
      }
    );
  }
  initFormSearchuser(): void {
    this.formRechercheUser = this.formbuilber.group({
      insertuser: [''],
      searchLoginuser: [''],
    });
  }
  SearchUser(nom: string, login: string): void {
    nom = this.formRechercheUser.value.insertuser;
    login = this.formRechercheUser.value.searchLoginuser;

    this.api.getrecherchenomlogin(nom, login).subscribe(
      (data) => {
        if (data.validation == 0) {
          this.compteuserData = data;
        }
      },
      (err) => {
        if (err.status != 401) {
          this.erreur = this.formbuilber.group({
            httpStatusCode: err.status,
            methode: 'UserServiceImpl.rechercheByNomAndLogin',
            login: localStorage.getItem('authlogin'),
            description: 'Erreur de consultation des resultats utilisateurs',
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
  /*======================================== VALIDATIONS && STATUTS && BLOCAGE =============================================*/
  /*================================================= FONCTION VALIDATION ===================================================*/

  onvalide5(clientUser: any) {
    clientUser = this.comptemarchandObj1.client;
    this.getUserLoginBackoffice(clientUser);
    this.messageService.add({
      severity: 'success',
      summary: 'Succes',
      detail: 'Validation éffectuée avec succes',
    });

    this.closebutton.nativeElement.click();
    this.compteuserData;
    location.reload();
  }
  onvalide(clientUser: any) {
    this.compteuserObj = clientUser;
    this.compteuserObj1.login = clientUser.login;

    this.getUserLoginBackoffice(this.compteuserObj1.login);
    this.messageService.add({
      severity: 'success',
      summary: 'Succes',
      detail: 'Validation éffectuée avec succes',
    });
    let ref = document.getElementById('cancel');
    ref?.click();
    this.closebutton.nativeElement.click();
    this.compteuserData;
  }
  getUserLoginBackoffice(login: string) {
    this.api.detailUser(login).subscribe((res) => {
      this.compteuserObj = res;
      this.compteuserObj.validation = 1;
      this.compteuserObj.status = 1;

      this.api.updateCompteuser(this.compteuserObj).subscribe(
        (data) => {},
        (err) => {
          if (err.status != 401) {
            this.erreur = this.formbuilber.group({
              httpStatusCode: err.status,
              methode: 'compteImpl.ajouterCompte',
              login: localStorage.getItem('authlogin'),
              description: 'Erreur de modification des comptes',
              message: err.message,
            });

            this.apiError
              .addErreurGenerer(this.erreur.value)
              .subscribe((data) => {});
          }

          this.autoLogoutService.autoLogout(err.status, this.router);
        }
      );
      this.comptemarchandObj1.statut = 1;

      this.apis.updateComptemarchand(this.comptemarchandObj1).subscribe(
        (res2) => {},
        (err1) => {
          if (err1.status != 401) {
            this.erreur = this.formbuilber.group({
              httpStatusCode: err1.status,
              methode: 'cmImpl.modifierCm',
              login: localStorage.getItem('authlogin'),
              description: 'Erreur de modification du marchand',
              message: err1.message,
            });

            this.apiError
              .addErreurGenerer(this.erreur.value)
              .subscribe((data) => {});
          }

          this.autoLogoutService.autoLogout(err1.status, this.router);
        }
      );
      location.reload();
    });
  }
  onInValide(row: any) {
    this.compteuserObj = row;
    this.compteuserObj.validation = 0;

    this.api.updateCompteuser(this.compteuserObj).subscribe(
      (res) => {},
      (err1) => {
        if (err1.status != 401) {
          this.erreur = this.formbuilber.group({
            httpStatusCode: err1.status,
            methode: 'compteImpl.ajouterCompte',
            login: localStorage.getItem('authlogin'),
            description: 'Erreur de modification du compte',
            message: err1.message,
          });

          this.apiError
            .addErreurGenerer(this.erreur.value)
            .subscribe((data) => {});
        }

        this.autoLogoutService.autoLogout(err1.status, this.router);
      }
    );
  }
  /* pour initialiser et preremplie les champs venant du web service de la signalitique */
  initForm(): void {
    this.comptesMarch = [];
    this.comptesMarch = this.comptemarchandObj.comptes;

    this.formValue = this.formbuilber.group({
      client: [
        this.comptemarchandObj1.client,
        [Validators.required, Validators.minLength(8)],
      ],
      nom: [this.comptemarchandObj1.nom, []],
      prenom: [this.comptemarchandObj1.prenom],
      nomPrenom: [this.comptemarchandObj1.nom],
      login: [this.comptemarchandObj1.client],
      numCptContribuable: [this.comptemarchandObj1.numCptContribuable],
      tel: [this.comptemarchandObj1.tel],
      tel1Cm: [this.comptemarchandObj1.autreContact],
      dateNais: [this.comptemarchandObj1.dateNais],
      comptemarchand: [this.comptemarchandObj1.numCpt],
      regcrc: [this.comptemarchandObj1.regCrc],
      /* datecreation: [''],
      adressecomptemarchand: [this.comptemarchandObj1.adCm], */
      /* numerocpt: [''], */
      raisonsocial: [this.comptemarchandObj1.raisonSocial],
      agec: [this.comptemarchandObj1.agec],
      sexe: [this.comptemarchandObj1.sexe],
      dateExpir: [this.comptemarchandObj1.dateExpir],
      pieceId: [this.comptemarchandObj1.pieceId],
      email: [this.comptemarchandObj1.email],
      selectcomptesMarch: [],
      adCm: [this.comptemarchandObj1.adCm],
      statut: [this.comptemarchandObj1.statut],
      com: [],
    });
  }
  initForm1(): void {
    this.formValue = this.formbuilber.group({
      client: [''],
      nom: ['', []],
      prenom: [''],
      nomPrenom: [''],
      login: [''],
      numCptContribuable: [''],
      tel: [''],
      tel1Cm: [''],
      dateNais: [''],
      comptemarchand: [''],
      regcrc: [''],
      /* datecreation: [''], *
      adressecomptemarchand: [this.comptemarchandObj.adCm], */
      /* numerocpt: [''], */
      raisonsocial: [''],
      agec: [''],
      sexe: [''],
      dateExpir: [''],
      pieceId: [''],
      email: [''],
      selectcomptesMarch: [],
      adCm: [''],
      statut: [''],
      com: [],
    });
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
  onEdit(row: any) {
    this.showAdd = false;
    this.comptemarchandObj = row;
    this.comptemarchandObj.client = row.client;

    this.getComptes1(this.comptemarchandObj.client);

    var Cm1 = JSON.stringify(this.comptemarchandObj);
    var Cm2 = JSON.parse(Cm1);

    this.monStatut = Cm2.status;

    this.isDisable = false;
    this.initForm();
    /*

      this.formValue.controls['nom'].setValue(row.nomCm);
      this.formValue.controls['prenom'].setValue(row.prenomCm);
      this.formValue.controls['login'].setValue(row.login);
      this.formValue.controls['racine'].setValue(row.racineCm);
      this.formValue.controls['tel1'].setValue(row.tel1Cm);
      this.formValue.controls['tel2'].setValue(row.tel2Cm);
      this.formValue.controls['tel3'].setValue(row.tel3Cm);
      this.formValue.controls['comptemarchand'].setValue(row.numCptComCm);
      this.formValue.controls['registredecommerce'].setValue(row.regCrcCm);
      this.formValue.controls['adressecomptemarchand'].setValue(row.adCm);
      this.formValue.controls['numerocpt'].setValue(row.numCptCm);
      this.formValue.controls['raisonsocial'].setValue(row.intRs);
     */
  }
  getallCommission() {
    this.apis.listCommission().subscribe(
      (res) => {
        this.commissionData = res;
      },
      (err) => {
        if (err.status != 401) {
          this.erreur = this.formbuilber.group({
            httpStatusCode: err.status,
            methode: 'CommissionImpl.listCommissions',
            login: localStorage.getItem('authlogin'),
            description: 'Erreur de chargement des commissions',
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
  getComptes15(client: string) {
    this.api.getsignaletiqueMarchand(client).subscribe((res: any) => {
      this.comptemarchandObj1 = res;

      this.comptesMarch1 = this.comptemarchandObj1.comptes;
      this.initForm();
    }),
      (err: any) => {
        if (err.status != 401) {
          this.erreur = this.formbuilber.group({
            httpStatusCode: err.status,
            methode: 'CmImpl.getMarchand',
            login: localStorage.getItem('authlogin'),
            description: 'Erreur de recuperation du client',
            message: err.message,
          });
        }
        this.isInexistClient = true;

        this.apiError
          .addErreurGenerer(this.erreur.value)
          .subscribe((data) => {});

        this.autoLogoutService.autoLogout(err.status, this.router);
      };
  }
  getComptes1(client: string) {
    this.apis.getMachandByRacine(client).subscribe((res: any) => {
      this.comptemarchandObj1 = res;

      this.comptesMarch1 = this.comptemarchandObj1.comptes;
      this.initForm();
    }),
      (error: any) => {
        this.isInexistClient = true;
        this.autoLogoutService.autoLogout(error.status, this.router);
      };
  }

  getColor(): string | any {
    if (this.comptemarchandObj.statut === 1) {
      return '#ffffff !important';
    } else if (this.comptemarchandObj.statut === 0) {
      return '#e9ecef !important';
    }
  }
  /*=================================================(FIN) FONCTION VALIDATION ===================================================*/
  /*================================================= FONCTION STATUT ===================================================*/

  /*=================================================(FIN) FONCTION STATUT ===================================================*/
  /*================================================= FONCTION BLOCAGE ===================================================*/

  /*=================================================(FIN) FONCTION BLOCAGE ===================================================*/
  /*========================================(FIN) VALIDATIONS && STATUTS && BLOCAGE =============================================*/
}
