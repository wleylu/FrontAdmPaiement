import { Component, OnInit } from '@angular/core';
import {
  NgForm,
  FormBuilder,
  FormGroup,
  Validators,
  ValidationErrors,
  FormControl,
} from '@angular/forms';
import { from, Subscription } from 'rxjs';
import { City, Comptemarchand } from 'src/app/model/comptemarchand.model';
import { ApiService } from 'src/app/services/api.service';
import { ComptemarchandService } from 'src/app/services/comptemarchand.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Comptes } from 'src/app/model/comptes.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Commission } from '../../model/commission.model';
import { element } from 'protractor';
import { MessageService, SelectItem } from 'primeng/api';
import { ErreurGenererService } from 'src/app/services/erreur-generer.service';
import { timeout } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { AutoLogoutService } from 'src/app/services/auto-logout.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/model/user.model';
import { CreationcompteService } from 'src/app/services/creationcompte.service';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { SharedService } from 'src/app/services/shared.service';
import { CommissionService } from 'src/app/services/commission.service';
import { MessageStatut } from 'src/app/model/messageStatut.model';
import { Agence } from 'src/app/model/agence.model';

@Component({
  selector: 'app-comptesconnexion',
  templateUrl: './comptesconnexion.component.html',
  styleUrls: [
    './comptesconnexion.component.scss',
    './comptesconnexion.component.css',
  ],
  providers: [MessageService],
})
export class ComptesconnexionComponent implements OnInit {
  messageRetour!: MessageStatut;
  formValue!: FormGroup;
  editValue!: FormGroup;
  formRecherche!: FormGroup;
  modifier!: boolean;
  formRechercheLogin!: FormGroup;
  client: string | any;
  subscription!: Subscription;
  comptemarchandObj: Comptemarchand = new Comptemarchand();
  comptemarchandObj1: Comptemarchand = new Comptemarchand();
  comptemarchandObj2: Comptemarchand = new Comptemarchand();
  comptemarchandObj3: Comptemarchand = new Comptemarchand();
  comptemarchandObjAdd: Comptemarchand = new Comptemarchand();
  comptemarchandObjMoral: Comptemarchand = new Comptemarchand();
  loginConnect: any;
  compteObj: Comptes = new Comptes();
  compteObj1: Comptes = new Comptes();
  commissionObj: Commission = new Commission();
  commissionObjMoral: Commission = new Commission();
  commissionObj1: any = {
    idCommission: 1,
    montantCommission: 0,
    typeCommission: 0,
    pourCommarch: 0,
    pourCombank: 100,
    commissionFacturier: 0,
    commissionBanque: 0,
    libelle: 'COMMISSION PAR DEFAUT',
    facturier: 'ABI',
  };

  compte1: Comptes = new Comptes();
  comptemarchandData!: Comptemarchand[];
  signal!: any;
  showAdd!: Boolean;
  showAddMoral!: Boolean;
  login!: string;
  insert!: string;
  comptesMarch!: Comptes[];
  comptesMarch1!: Comptes[];
  comptesMarch2!: any[];
  commission!: Commission;
  selectcomptesMarch!: Comptes[];

  commissionData!: Commission[];
  comptesData!: Comptes[];
  clientString!: string;

  comptemarchand !: Comptemarchand;

  searchTerm!: string;

  marchands: Comptemarchand[] = [];
  supprimer!: Boolean;
  rowDelate!: any;

  isInexistClient = false;
  isDisable!: boolean;
  isExistClient = false;
  isExistClientModif = false;
  p: number = 1;
  erreur!: FormGroup;
  messError!: number;
  abiMessage!: string;
  formValueMoral!: FormGroup;
  comptesMarchMoral!: Comptes[];
  comptesMarchMoral1!: Comptes[];
  emailExisteAjouterMarchandPp!: number;
  emailExisteModificationMarchandPp!: number;
  emailExisteAjouterMarchandPm!: number;
  emailExisteModificationMarchandPm!: number;
  clientByTel!: Comptemarchand;
  telExisteAjouterMarchandPp!: number;
  telExisteAjouterMarchandPm!: number;
  telExisteModificationMarchandPm!: number;
  telExisteModificationMarchandPp!: number;
  userhabilitation: any = localStorage.getItem('authhabilitation');
  addButton!: boolean;
  MailEnvoi!: FormGroup;
  lienMessageMailMarchand: any;
  lienMessageMailBack: any;
  adresseMail: any;
  userMarchand: any;
  agences !: Agence[];
  nom = '';
  loginn = '';
  aut: any = localStorage.getItem('authhabilitation');
  hab: undefined = JSON.parse(this.aut);
  UI: any;
  habb: any;
  emailExisteAjouterUser !: number;
  telExisteAjouterUser !: number;
  selectcom!:Commission[];
  comptesMarchMorale1!: Comptes[];
  listCompteClients: any;
  constructor(
    private apii: CreationcompteService,
    private httpClient: HttpClient,
    private messageService: MessageService,
    private formbuilber: FormBuilder,
    private api: ApiService,
    private modalService: NgbModal,
    private route: Router,
    private aroute: ActivatedRoute,
    private apiError: ErreurGenererService,
    private router: Router,
    public authService: AuthService,
    public autoLogoutService: AutoLogoutService,
    private datePipe: DatePipe,
    private shared : SharedService,
    private commissionService: CommissionService
  ) {
      this.comptesMarch2=[];
    }

  ngOnInit(): void {
    this.initForm1();
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
            this.habb != 'ROLE_USER'
          ) {
            this.autoLogoutService.Logout(this.router);
            this.router.navigate(['/authentication'], {
              queryParams: { returnUrl: this.router.routerState.snapshot.url },
            });
          } else {
            this.initForm1();

            this.initFormSearch();

          //  this.getallComptemarchant();
            this.getallCommission();
            this.getallComptes();
            this.loginConnect = localStorage.getItem('authlogin');
            this.checkProfil();
            this.agence();
            this.Search();

            this.liens();
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

  Contrat(row :any){
    this.shared.setData(row.login);
    this.router.navigate(['/app/contrat'])
  }

  dateStringToDate(dateString:any) {
    try {
      var year = dateString.substring(0, 4);
      var month = dateString.substring(4, 6);
      var day = dateString.substring(6, 8);
      var date = new Date(year, month - 1, day);
      const offset = date.getTimezoneOffset()
      date = new Date(date.getTime() - (offset * 60 * 1000));
      return date;
    } catch (error) {
      return null;
    }
  }

  liens() {
    this.httpClient
      .get(environment.urlFinal + '/efacture/pwdParam/allParam')
      .subscribe((res: any) => {
        this.lienMessageMailBack = res[0].lienPremClient;
        this.lienMessageMailMarchand = res[0].lienPremAdmin;
        this.adresseMail = res[0].mailEfacture;
        console.log(res);
      });
  }

  oninitForm(){
    this.initForm1();
  }

  agence() {
    this.apii.getAgence().subscribe(
      (res) => {
        this.agences = res;
        console.log(res);
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

  /* pour initialiser et preremplie les champs venant du web service de la signalitique */
  initForm(): void {
    this.comptesMarch = [];
    this.comptesMarch = this.comptemarchandObj.comptes;

    this.formValue = this.formbuilber.group({
      id: [''],
      client: [''],
      nom: [this.comptemarchandObj.nom, [Validators.required]],
      prenom: [this.comptemarchandObj.prenom],
      nomPrenom: [this.comptemarchandObj.nom],
      login: [this.comptemarchandObj.client],
      numCptContribuable: [this.comptemarchandObj.numCptContribuable],
      tel: [this.comptemarchandObj.tel, [Validators.required]],
      tel1Cm: [this.comptemarchandObj.autreContact],

      dateNais: ([this.comptemarchandObj.dateNais]),
      comptemarchand: [this.comptemarchandObj.numCpt],
      regcrc: [this.comptemarchandObj.regCrc],
      /* datecreation: [''],
      adressecomptemarchand: [this.comptemarchandObj.adCm], */
      /* numerocpt: [''], */
      raisonsocial: [this.comptemarchandObj.raisonSocial],
      agec: [this.comptemarchandObj.agec],
      sexe: [this.comptemarchandObj.sexe],
      dateExpir: [this.comptemarchandObj.dateExpir],
      pieceId: [this.comptemarchandObj.pieceId],
      email: [this.comptemarchandObj.email, [Validators.required]],
      selectcomptesMarch: [],
      adCm: [this.comptemarchandObj.adCm],
      statut: [this.comptemarchandObj.statut],
      backagence:[this.comptemarchandObj.agence],
      selectCommission: [],
    });
  }

  initForm1(): void {
    this.formValue = this.formbuilber.group({
      id: [''],
      client: [''],
      nom: [''],
      prenom: [''],
      nomPrenom: [''],
      login: [''],
      numCptContribuable: [''],
      tel: ['',[Validators.required]],
      tel1Cm: [''],
      dateNais: [''],
      comptemarchand: [''],
      regcrc: [''],
      /* datecreation: [''],
      adressecomptemarchand: [this.comptemarchandObj.adCm], */
      /* numerocpt: [''], */
      raisonsocial: [''],
      agec: [''],
      sexe: [''],
      dateExpir: [''],
      pieceId: [''],
      email: ['',[Validators.required,Validators.email]],
      selectcomptesMarch: [],
      adCm: [''],
      statut: [''],
      selectCommission: [''],
      montant:[0,[Validators.required,Validators.min(1000)]],
      backagence:[''],
      refTransaction:['',[Validators.required]],
      codeTransaction:['',[Validators.required]],

    });
  }

  checkProfil() {
    console.log(this.userhabilitation + typeof this.userhabilitation);
    if (
      //this.userhabilitation == '"ROLE_SUPERVISEUR"' ||
      this.userhabilitation == '"ROLE_USER"' ||
      this.userhabilitation == '"ROLE_HELPDESK"'
    ) {
      this.addButton = true;
    } else {
      this.addButton = false;
    }
  }

  initFormSearch(): void {
    this.formRecherche = this.formbuilber.group({
      nom: [''],
      login: [''],
    });
  }
  initFormSearchlogin(): void {
    this.formRechercheLogin = this.formbuilber.group({
      searchLogin: [''],
    });
  }

  clickAddcomptemarchand() {
    this.formValue.reset();
    this.showAdd = true;
    this.isDisable = false;
  }
  onCommissionFilter(e:any){

      let com = e.value as Commission[];
      const distinctThings = com.filter(
        (thing, i, arr) => arr.findIndex(t => t.facturier === thing.facturier) === i
      );
      console.log(distinctThings);
      distinctThings.forEach((thing, i) => {
        if(com.filter (c => c.facturier === thing.facturier).length === 2) {
          console.log("Yes I find");
          this.messageService.add({severity:'warn', summary: 'Avertissement', detail: "Vous n'êtes pas autorisé à avoir plusieurs commissions pour le facturier "+thing.facturier+",veuillez choisir une commission par facturier"});
           e.value = [];
           this.formValue.controls['selectCommission'].setValue(
             e.value = []
           );
           return;
          }

      });

  }

   /****************************************************************************************************************************
   *******************************************AJOUTER UN COMPTE MARCHAND****************************************************
   ****************************************************************************************************************************/
  /*cette methode nous permet d'affiche le detail des comptes marchand  et le reinitialiser après enregistrement*/
  /* choisir aussi le compte */


  postComptemarchanddetails(){

    this.formAjoutMarchand(0);

  //console.log(JSON.stringify(this.comptemarchandObj));

    this.api.postComptemarchand(this.comptemarchandObj).subscribe(
      (res) => {
        this.messageRetour = res;
        switch(this.messageRetour.codeMsg ){
          case "00":{
            this.messageService.add({
              severity: 'success',
              summary: 'Succes',
              detail: this.messageRetour.libelle,
            });
            this.comptemarchandData.push(this.comptemarchandObj);
            this.formValue.reset();
            break;
          }

          case "03":{
            this.isExistClient =true;
            break;
          }
          case "04":{

            this.isExistClient =true;
            break;
          }
          case "05":{
            this.isExistClient =true;
            break;
          }

          case "06":{
            this.isExistClient =true;
            break;
          }

          default:{
            this.messageService.add({
              severity: 'info',
              summary: 'Info',
              detail: this.messageRetour.libelle,
            });
            break;
          }

        }
      },
      (err) => {
        if (err.status != 401) {
          this.erreur = this.formbuilber.group({
            httpStatusCode: err.status,
            methode: 'CmImpl.ajouterCm',
            login: localStorage.getItem('authlogin'),
            description: 'Erreur de Creation de marchands',
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

  formAjoutMarchand(tform: number){

    if (tform === 0){
      this.modifier = false;
    }

    this.comptemarchandObj.nom = this.formValue.value.nom;
    this.comptemarchandObj.prenom = this.formValue.value.prenom;
    this.comptemarchandObj.login = this.formValue.value.client;
    this.comptemarchandObj.client = this.formValue.value.refTransaction;;
    this.comptemarchandObj.numCptContribuable =
      this.formValue.value.numCptContribuable;
    this.comptemarchandObj.dateNais = this.formValue.value.dateNais;
    this.comptemarchandObj.tel = this.formValue.value.tel;
    this.comptemarchandObj.numCpt = this.formValue.value.comptemarchand;
    this.comptemarchandObj.regCrc = this.formValue.value.regcrc;
    this.comptemarchandObj.adCm = this.formValue.value.adCm;
    this.comptemarchandObj.numCpt = this.formValue.value.numerocpt;
    this.comptemarchandObj.raisonSocial = this.formValue.value.raisonsocial;
    this.comptemarchandObj.sexe = this.formValue.value.sexe;
    this.comptemarchandObj.dateExpir = this.formValue.value.dateExpir;
    this.comptemarchandObj.pieceId = this.formValue.value.pieceId;
    this.comptemarchandObj.email = this.formValue.value.email;
    this.comptemarchandObj.loginModification = this.loginConnect;
    this.comptemarchandObj.loginAdd = this.loginConnect;
    this.comptemarchandObj.montant = this.formValue.value.montant;
    this.comptemarchandObj.agence= this.formValue.value.backagence;
    this.comptemarchandObj.refTransaction= this.formValue.value.refTransaction;
    this.comptemarchandObj.codeTransaction=this.formValue.value.codeTransaction;


    this.comptemarchandObj.nom = this.formValue.value.nom;
    this.comptemarchandObj.prenom = this.formValue.value.prenom;
    this.comptemarchandObj.login = this.formValue.value.client;
    this.comptemarchandObj.client = this.formValue.value.client;
      this.formValue.value.numCptContribuable;
    this.comptemarchandObj.dateNais = this.formValue.value.dateNais;
    this.comptemarchandObj.tel = this.formValue.value.tel;
    this.comptemarchandObj.numCpt = this.formValue.value.comptemarchand;
    this.comptemarchandObj.regCrc = this.formValue.value.regcrc;
    this.comptemarchandObj.adCm = this.formValue.value.adCm;
    this.comptemarchandObj.numCpt = this.formValue.value.numerocpt;
    this.comptemarchandObj.raisonSocial = this.formValue.value.raisonsocial;
    this.comptemarchandObj.sexe = this.formValue.value.sexe;
    this.comptemarchandObj.dateExpir = this.formValue.value.dateExpir;
    this.comptemarchandObj.pieceId = this.formValue.value.pieceId;
    this.comptemarchandObj.email = this.formValue.value.email;
    this.comptemarchandObj.commission = this.formValue.value.selectCommission;
    this.comptemarchandObj.loginModification = this.loginConnect;
    this.comptemarchandObj.loginAdd = this.loginConnect;
    this.comptemarchandObj.montant = this.formValue.value.montant;



  }

  postComptemarchanddetails1() {
  /*   const controls = this.formValue.controls;
    if (this.formValue.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
      return;
    }
 */
    console.log(this.formValue.value);

    this.modifier = false;
    this.comptemarchandObj.nom = this.formValue.value.nom;
    this.comptemarchandObj.prenom = this.formValue.value.prenom;
    this.comptemarchandObj.login = this.formValue.value.client;
    this.comptemarchandObj.client = this.formValue.value.client;
    this.comptemarchandObj.numCptContribuable =
      this.formValue.value.numCptContribuable;
    this.comptemarchandObj.dateNais = this.formValue.value.dateNais;
    this.comptemarchandObj.tel = this.formValue.value.tel;
    this.comptemarchandObj.numCpt = this.formValue.value.comptemarchand;
    this.comptemarchandObj.regCrc = this.formValue.value.regcrc;
    this.comptemarchandObj.adCm = this.formValue.value.adCm;
    this.comptemarchandObj.numCpt = this.formValue.value.numerocpt;
    this.comptemarchandObj.raisonSocial = this.formValue.value.raisonsocial;
    this.comptemarchandObj.sexe = this.formValue.value.sexe;
    this.comptemarchandObj.dateExpir = this.formValue.value.dateExpir;
    this.comptemarchandObj.pieceId = this.formValue.value.pieceId;
    this.comptemarchandObj.email = this.formValue.value.email;

/*     this.comptemarchandObj.comptes = this.formValue.value.selectcomptesMarch;
    if (this.formValue.value.selectcomptesMarch.length==0) {
      this.comptemarchandObj.comptesInactif = this.listCompteClients;
    }
    this.comptemarchandObj.commission = this.formValue.value.selectCommission; */
    this.comptemarchandObj.statut = 0;
    this.comptemarchandObj.loginModification = this.loginConnect;
    this.comptemarchandObj.loginAdd = this.loginConnect;
    this.apii.getUserByMail(this.comptemarchandObj.email).subscribe((resp) => {

      console.log(resp)
      this.apii.getUserByTel(this.comptemarchandObj.tel).subscribe((tel)=>{
        if (resp != null) {
          this.emailExisteAjouterUser = 0;
        } else if (tel != null) {
          this.telExisteAjouterUser = 0;

        } else {
          this.api
          .recherchebyEmail(this.comptemarchandObj.email)
          .subscribe((resp) => {
            /****************************************************VERIFICATION MAIL********************************************* */
            this.api
              .recherchebyTel(this.comptemarchandObj.tel)
              .subscribe((respTel) => {
                if (resp.email != null) {
                  this.emailExisteAjouterMarchandPp = 0;
                  this.telExisteAjouterMarchandPp = 1;
                } else if (respTel.tel != null) {
                  this.telExisteAjouterMarchandPp = 0;
                  this.emailExisteAjouterMarchandPp = 1;
                } else {
                  this.emailExisteAjouterMarchandPp = 1;
                  this.telExisteAjouterMarchandPp = 1;
                  console.log(JSON.stringify(this.commissionObj) + 'ENREG')
                  this.api.postComptemarchand(this.comptemarchandObj).subscribe(
                    (res) => {
                      console.log(JSON.stringify(res) + 'RETOUR ENREG')

                      if (res) {
                        this.comptemarchandObjAdd = res;
                        console.log(this.comptemarchandObjAdd);
                            if(this.comptemarchandObjAdd.client != null){
                               this.messageService.add({
                                  severity: 'success',
                                  summary: 'Succes',
                                  detail: 'Client enregistré avec succes',
                                });
                                this.formValue.reset();
                            }
                            else {
                              this.messageService.add({
                                severity: 'info',
                                summary: 'Info',
                                detail: 'Ce Client existe déja !',
                              });
                            }
                      } else {
                        this.messageService.add({
                          severity: 'info',
                          summary: 'Info',
                          detail: 'Ce Client existe déja !',
                        });
                      }

                      this.getallComptemarchant();
                    },
                    (err) => {
                      if (err.status != 401) {
                        this.erreur = this.formbuilber.group({
                          httpStatusCode: err.status,
                          methode: 'CmImpl.ajouterCm',
                          login: localStorage.getItem('authlogin'),
                          description: 'Erreur de Creation de marchands',
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
              });
          });
      }
    },
    (err) => {
      if (err.status != 401) {
        this.erreur = this.formbuilber.group({
          httpStatusCode: err.status,
          methode: 'Ajouter Compte marchand',
          login: localStorage.getItem('authlogin'),
          description: 'Erreur de Verification du téléphone dans la liste des users',
          message: err.message,
        });

        this.apiError
          .addErreurGenerer(this.erreur.value)
          .subscribe((data) => {});
      }

      this.autoLogoutService.autoLogout(err.status, this.router);
    })
    },
    (err) => {
      if (err.status != 401) {
        this.erreur = this.formbuilber.group({
          httpStatusCode: err.status,
          methode: 'Ajouter Compte marchand',
          login: localStorage.getItem('authlogin'),
          description: 'Erreur de Verification de l\'adresse mail dans la liste des users',
          message: err.message,
        });

        this.apiError
          .addErreurGenerer(this.erreur.value)
          .subscribe((data) => {});
      }

      this.autoLogoutService.autoLogout(err.status, this.router);
    });
  }
  /****************************************************************************************************************************
   *******************************************FIN AJOUT COMPTE MARCHAND****************************************************
   ****************************************************************************************************************************/
  /* nous permettre de faire apparaitre les messages d'erreur */
  isControle(controlName: string, validationType: string) {
    const control = this.formValue.controls[controlName];
    if (!control) {
      return false;
    }

    const result =
      control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }
  isControles(controlName: string, validationType: string) {
    const control = this.formValue.controls[controlName];
    if (!control) {
      return false;
    }

    const result =
      control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }
 /****************************************************************************************************************************
  ***********************************************************FERMETURE DU FORMULAIRE***********************************************
  ****************************************************************************************************************************/
  annulerParticulier() {
    this.formValue.reset();
    location.reload();
  }
   /****************************************************************************************************************************
  ***********************************************************FIN FERMETURE DU FORMULAIRE***********************************************
  ****************************************************************************************************************************/

  /****************************************************************************************************************************
  ***********************************************************ACTIVATION COMPTES***********************************************
  ****************************************************************************************************************************/
  actif1(row: any) {
    this.compteObj = row;

    this.compteObj.statut = 1;

    this.api
      .postCompte(this.comptemarchandObj.client, this.compteObj)
      .subscribe(
        (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succes',
            detail: 'Compte activé avec succes',
          });
        },
        (err) => {
          if (err.status != 401) {
            this.erreur = this.formbuilber.group({
              httpStatusCode: err.status,
              methode: 'compteImpl.ajouterCompte',
              login: localStorage.getItem('authlogin'),
              description: "Erreur d'activation du compte",
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
  /****************************************************************************************************************************
  ***********************************************************FIN ACTIVATION COMPTES***********************************************
  ****************************************************************************************************************************/



  /****************************************************************************************************************************
  ***********************************************************DESACTIVATION COMPTES***********************************************
  ****************************************************************************************************************************/
  inactif1(row: any) {
    this.compteObj = row;

    this.compteObj.statut = 0;

    this.api
      .postCompte(this.comptemarchandObj.client, this.compteObj)
      .subscribe(
        (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succes',
            detail: 'Compte desactivé avec succes',
          });
        },
        (err) => {
          if (err.status != 401) {
            this.erreur = this.formbuilber.group({
              httpStatusCode: err.status,
              methode: 'compteImpl.ajouterCompte',
              login: localStorage.getItem('authlogin'),
              description: 'Erreur de desactivation du compte',
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
  /****************************************************************************************************************************
  ***********************************************************FIN DESACTIVATION COMPTES***********************************************
  ****************************************************************************************************************************/


  getallComptemarchant() {
    this.api.getCompteMarchand().subscribe(
      (res) => {
        this.comptemarchandData = res;
      },
      (err) => {
        if (err.status != 401) {
          this.erreur = this.formbuilber.group({
            httpStatusCode: err.status,
            methode: 'CmImpl.cpt',
            login: localStorage.getItem('authlogin'),
            description: 'Erreur de Consultation des marchands',
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

  deletedcomptemarchant(row: any) {
    this.api.deletedComptemarchand(row.id).subscribe((res) => {
    //  alert('compte supprimer');
      this.getallComptemarchant();
    });
  }

  onEdit(row: any) {
    console.log(row);
    this.comptesMarch2=[];

    this.showAdd = false;
    this.comptemarchandObj.client = row.client;
    this.comptemarchandObj = row;
    this.formValue.controls['client'].setValue(row.client);
    this.formValue.controls['nom'].setValue(row.nom);
    this.formValue.controls['prenom'].setValue(row.prenom);
    this.formValue.controls['email'].setValue(row.email);
    this.formValue.controls['dateNais'].setValue(row.dateNais);
    this.formValue.controls['tel'].setValue(row.tel);
    this.formValue.controls['sexe'].setValue(row.sexe);
    this.formValue.controls['pieceId'].setValue(row.pieceId);
    this.formValue.controls['adCm'].setValue(row.adCm);
    this.formValue.controls['agec'].setValue(row.agec);
    this.formValue.controls['montant'].setValue(row.montant);
    this.formValue.controls['refTransaction'].setValue(row.refTransaction);
    this.formValue.controls['codeTransaction'].setValue(row.codeTransaction);
   // this.formValue.controls['backagence'].setValue(row.agence.id);

        if (row.agence== null) {this.formValue.controls['backagence'].setValue(row.agence);}
          else{this.formValue.controls['backagence'].setValue(row.agence.id);}



    console.log('this.commission22222222222222222');
    console.log(row.commission);
    console.log(this.comptesMarch2);
    console.log('this.commission222222222222222222');
    this.formValue.controls['selectCommission'].setValue(
      row.commission
    );
    console.log('this.comptesMarch2');
    console.log(row.comptes);
    console.log(this.comptesMarch2);
    console.log('this.comptesMarch2');
    this.comptesMarch2=row.comptes
    console.log('this.comptesMarch3');
    console.log(this.comptesMarch2);
    console.log('this.comptesMarch3');
    //this.commissionObj = this.comptemarchandObj.commission;
    console.log("this.comptemarchandObj");
    console.log(this.formValue);
    console.log(this.comptemarchandObj);
    console.log("this.comptemarchandObj");
    console.log(row);
    //this.initForm();

     //this.getComptes1(row.client);
     console.log("this.comptemarchandObj999999999999");
     //console.log(this.getComptes1(this.comptemarchandObj.client))
     console.log("this.comptemarchandObj99999999999");


  }

  onEdit12(row: any) {
    console.log(row);
    this.comptesMarch2=[];
    this.api.getCommissionByClient(row.client).subscribe(res=>{
      console.log("res------------------------------");
      console.log(res);
      console.log("res------------------------------");

    row.commission=res;
    console.log(row);
    this.showAdd = false;
    this.comptemarchandObj.client = row.client;
    this.comptemarchandObj = row;
    this.formValue.controls['client'].setValue(row.client);
    this.formValue.controls['nom'].setValue(row.nom);
    this.formValue.controls['prenom'].setValue(row.prenom);
    this.formValue.controls['email'].setValue(row.email);
    this.formValue.controls['dateNais'].setValue(row.dateNais);
    this.formValue.controls['tel'].setValue(row.tel);
    this.formValue.controls['sexe'].setValue(row.sexe);
    this.formValue.controls['pieceId'].setValue(row.pieceId);
    this.formValue.controls['adCm'].setValue(row.adCm);
    this.formValue.controls['agec'].setValue(row.agec);
    this.formValue.controls['montant'].setValue(row.montant);
    this.formValue.controls['refTransaction'].setValue(row.refTransaction);
    this.formValue.controls['codeTransaction'].setValue(row.codeTransaction);
 //   this.formValue.controls['backagence'].setValue(row.agence);
 //
   this.formValue.controls['backagence'].setValue(row.agence.id);

    this.formValue.controls['selectCommission'].setValue(
      row.commission
    );
    console.log('this.comptesMarch2');
    console.log(row.comptes);
    console.log(this.comptesMarch2);
    console.log('this.comptesMarch2');
    this.comptesMarch2=row.comptes
    console.log('this.comptesMarch3');
    console.log(this.comptesMarch2);
    console.log('this.comptesMarch3');
    //this.commissionObj = this.comptemarchandObj.commission;
    console.log("this.comptemarchandObj");
    console.log(this.formValue);
    console.log(this.comptemarchandObj);
    console.log("this.comptemarchandObj");
    console.log(row);
    //this.initForm();

     //this.getComptes1(row.client);
     console.log("this.comptemarchandObj999999999999");
     //console.log(this.getComptes1(this.comptemarchandObj.client))
     console.log("this.comptemarchandObj99999999999");


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
      });
  }

  onEdit3(row: any) {
    row = this.comptemarchandObj.client;
    this.api.detailById(row).subscribe((res) => {});
  }

  /*cette methode nous permet d'affiche le detail des comptes marchand et le reinitialiser après enregistrement*/
  /* choisir aussi le compte */

  updateComptemarchanddetails(){
    this.isExistClient=false;
    this.formAjoutMarchand(1);

    this.api.updateComptemarchand(this.comptemarchandObj).subscribe(
      (res) => {
        this.messageRetour = res;

        console.log("Message retour :"+JSON.stringify(this.messageRetour));

        switch(this.messageRetour.codeMsg ){
          case "00":{
           //this.comptemarchandData.push(this.comptemarchandObj);
            let marchand = this.comptemarchandData.find(m =>m.id === this.comptemarchandObj.id);
            if (marchand != undefined){
              let idexm = this.comptemarchandData.indexOf(marchand);
              this.comptemarchandData[idexm] = this.comptemarchandObj;
             /*  this.comptemarchandData.splice(idexm,1);
              this.comptemarchandData.push(this.comptemarchandObj); */
            }
            this.messageService.add({
              severity: 'success',
              summary: 'Succes',
              detail: this.messageRetour.libelle,
            });
            break;
          }

          case "03":{
            this.isExistClientModif =true;
            break;
          }
          case "04":{

            this.isExistClientModif =true;
            break;
          }
          case "05":{
            this.isExistClientModif =true;
            break;
          }

          case "06":{
            this.isExistClientModif =true;
            break;
          }

          default:{
            this.messageService.add({
              severity: 'info',
              summary: 'Info',
              detail: this.messageRetour.libelle,
            });
            break;
          }

        }

        let ref = document.getElementById('cancel1');
        ref?.click();
        this.formValue.reset();
       // this.getallComptemarchant();
      },
      (err) => {
        if (err.status != 401) {
          this.erreur = this.formbuilber.group({
            httpStatusCode: err.status,
            methode: 'CmImpl.modifierCm',
            login: localStorage.getItem('authlogin'),
            description: 'Erreur de modification du marchands',
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



  updateComptemarchanddetails1() {
    const controls = this.formValue.controls;
    if (this.formValue.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
      return;
    }

    this.comptemarchandObj.nom = this.formValue.value.nom;
    this.comptemarchandObj.prenom = this.formValue.value.prenom;
    this.comptemarchandObj.login = this.formValue.value.client;
    this.comptemarchandObj.client = this.formValue.value.client;
    this.comptemarchandObj.numCptContribuable =
      this.formValue.value.numCptContribuable;
    this.comptemarchandObj.dateNais = this.formValue.value.dateNais;
    this.comptemarchandObj.tel = this.formValue.value.tel;
    this.comptemarchandObj.numCpt = this.formValue.value.comptemarchand;
    this.comptemarchandObj.regCrc = this.formValue.value.regcrc;
    this.comptemarchandObj.adCm = this.formValue.value.adCm;
    this.comptemarchandObj.numCpt = this.formValue.value.numerocpt;
    this.comptemarchandObj.raisonSocial = this.formValue.value.raisonsocial;
    this.comptemarchandObj.sexe = this.formValue.value.sexe;
    this.comptemarchandObj.dateExpir = this.formValue.value.dateExpir;
    this.comptemarchandObj.pieceId = this.formValue.value.pieceId;
    this.comptemarchandObj.email = this.formValue.value.email;
    this.comptemarchandObj.commission = this.formValue.value.selectCommission;
    //this.comptemarchandObj.commission = this.commissionObj1;
    //this.comptemarchandObj.statut = 0;
    this.comptemarchandObj.loginModification = this.loginConnect;
    this.comptemarchandObj.loginAdd = this.loginConnect;
    console.log("this.comptemarchandObj++++++++++++++++++++++++++++++++");
    console.log(this.comptemarchandObj);
    console.log("this.comptemarchandObj+++++++++++++++++++++++++++++++");
    for (let i = 0; i < this.comptemarchandObj.comptes.length; i++) {
      const element = this.comptemarchandObj.comptes[i];
    }

    this.api.detailById(this.comptemarchandObj.client).subscribe((result) => {
      this.api
        .recherchebyEmail(this.comptemarchandObj.email)
        .subscribe((resp1) => {
          this.api
            .recherchebyTel(this.comptemarchandObj.tel)
            .subscribe((respUpdateClient) => {
              if (
                resp1.email != null &&
                resp1.client != this.comptemarchandObj.client &&
                resp1.email == this.comptemarchandObj.email
              ) {
                this.emailExisteModificationMarchandPp = 0;
                this.telExisteModificationMarchandPp = 1;
              } else if (
                respUpdateClient.tel != null &&
                respUpdateClient.client != this.comptemarchandObj.client &&
                respUpdateClient.tel == this.comptemarchandObj.tel
              ) {
                this.telExisteModificationMarchandPp = 0;
                this.emailExisteModificationMarchandPp = 1;
              } else {
                this.emailExisteModificationMarchandPp = 1;
                this.telExisteModificationMarchandPp = 1;
                this.api.updateComptemarchand(this.comptemarchandObj).subscribe(
                  (res) => {
                    this.messageService.add({
                      severity: 'success',
                      summary: 'Succes',
                      detail: 'Marchand modifié avec succes',
                    });

                    let ref = document.getElementById('cancel1');
                    ref?.click();
                    this.formValue.reset();
                    this.getallComptemarchant();
                  },
                  (err) => {
                    if (err.status != 401) {
                      this.erreur = this.formbuilber.group({
                        httpStatusCode: err.status,
                        methode: 'CmImpl.modifierCm',
                        login: localStorage.getItem('authlogin'),
                        description: 'Erreur de modification du marchands',
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
            });
        });
    });
  }

  Comptemarchanddetail() {
    const controls = this.formValue.controls;
    if (this.formValue.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
      return;
    }

    this.comptemarchandObj.nom = this.formValue.value.nom;
    this.comptemarchandObj.prenom = this.formValue.value.prenom;
    this.comptemarchandObj.login = this.formValue.value.client;
    this.comptemarchandObj.client = this.formValue.value.client;
    this.comptemarchandObj.numCptContribuable =
      this.formValue.value.numCptContribuable;
    this.comptemarchandObj.tel = this.formValue.value.tel2Cm;
    this.comptemarchandObj.tel = this.formValue.value.tel;
    this.comptemarchandObj.numCpt = this.formValue.value.comptemarchand;
    this.comptemarchandObj.regCrc = this.formValue.value.regcrc;
    this.comptemarchandObj.adCm = this.formValue.value.adCm;
    this.comptemarchandObj.numCpt = this.formValue.value.numerocpt;
    this.comptemarchandObj.raisonSocial = this.formValue.value.raisonsocial;
    this.comptemarchandObj.sexe = this.formValue.value.sexe;
    this.comptemarchandObj.dateExpir = this.formValue.value.dateExpir;
    this.comptemarchandObj.pieceId = this.formValue.value.pieceId;
    this.comptemarchandObj.email = this.formValue.value.email;

    this.comptemarchandObj.comptes = this.formValue.value.selectcomptesMarch;
    this.comptemarchandObj.commission = this.commissionObj1;
    this.comptemarchandObj.statut = this.formValue.value.statut;
    this.comptemarchandObj.loginModification = this.loginConnect;
    this.comptemarchandObj.loginAdd = this.loginConnect;

    this.api.updateComptemarchand(this.comptemarchandObj).subscribe(
      (res) => {
        //alert('modification avec succes');

        let ref = document.getElementById('cancel');
        ref?.click();
        this.formValue.reset();
        this.getallComptemarchant();
      },
      (err) => {
        this.autoLogoutService.autoLogout(err.status, this.router);
      }
    );
  }
  /*Pour faire la recherche dans un champs et appele la fonction a l'aide d'un clique*/

  Search() {
      this.api.getrecherchenomlogin(this.loginn,this.nom.toUpperCase(),this.loginConnect).subscribe(
        (data) => {
          console.log("Machands liste : "+JSON.stringify(data));
          this.comptemarchandData = data;
        },
        (err) => {
          this.autoLogoutService.autoLogout(err.status, this.router);
        }
      );

  }



/*
  Search1() {

    //alert(this.loginn + '777' + this.nom )
    if(this.loginn != null ||this.loginn != '' && this.nom != null || this.nom != ''){
      this.api.getrecherchenomlogin(this.nom.toUpperCase(), this.loginn).subscribe(
        (data) => {
          this.comptemarchandData = data;
        },
        (err) => {
          this.autoLogoutService.autoLogout(err.status, this.router);
        }
      );
    }
    else{
      if(this.loginn == null || this.loginn == ''){
        this.api.getrecherchenom(this.nom.toUpperCase()).subscribe(
          (data) => {
            this.comptemarchandData = data;
          },
          (err) => {
            this.autoLogoutService.autoLogout(err.status, this.router);
          }
        );
      }
      if(this.nom == null || this.nom == ''){
        this.api.getMachandByLogin(this.loginn).subscribe(
          (data) => {
            this.comptemarchand = data;
          },
          (err) => {
            this.autoLogoutService.autoLogout(err.status, this.router);
          }
        );
      }
    }
    let name  = this.nom;
    //let nom = name.toUpperCase();
    let login = this.loginn;
    console.log(this.nom + this.loginn)
    this.api.getrecherchenomlogin(this.nom.toUpperCase(),this.loginn,).subscribe(
      (data) => {
        this.comptemarchandData = data;
      },
      (err) => {
        this.autoLogoutService.autoLogout(err.status, this.router);
      }
    );
  } */

  disableTextbox = false;

  toggleDisable() {
    this.disableTextbox = !this.disableTextbox;
  }

  Searchlogin(): void {}

  /*Confirmation de  supression*/
  confirmDelate(content: any, row: any) {
    this.rowDelate = row;
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        () => {
          this.deletedcomptemarchant(this.rowDelate);
        },
        (reason) => {}
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  cancelform() {
    this.ngOnInit();
  }
  /* rechercher le compte de façon automatique  */
  searchCompte(client: string): any {
    const controls = this.formValue.controls;
    if (this.formValue.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
      return;
    }

    if (this.formValue.value.client.length != 8) {
      setTimeout(() => {
        this.messError = 2;
        this.abiMessage = 'Le champs doit contenir seulement 8 carateres';
      }, 10000);
    } else {
      client = this.formValue.value.client;
      this.api.detailById(client).subscribe((res) => {
        console.log(JSON.stringify(res) + 'RACINE')
        if (res.client != null) {
          this.isExistClient = true;
        } else {
          this.isExistClient = false;
          this.api.getsignalitique(client).subscribe((res: any) => {
            console.log(JSON.stringify(res) + 'RACINES')

            if (res.client != null && res.client == client) {
              this.messError = 1;
              this.isDisable = false;

              this.comptemarchandObj = res;
              this.listCompteClients= res.comptes;
              var a = moment(res.dateNais, "YYYYMMDD")
              this.comptemarchandObj.dateNais = a.format('DD/MM/YYYY')
            //  alert(a);
              //alert(this.comptemarchandObj.dateNais)
              this.initForm();
            } else {
              this.messError = 3;
              this.isInexistClient = false;
              this.formValue.reset;
            }
          }),
            (err: any) => {
              if (err.status != 401) {
                this.erreur = this.formbuilber.group({
                  httpStatusCode: err.status,
                  methode: 'API T24',
                  login: localStorage.getItem('authlogin'),
                  description: 'Erreur de recuperation du client',
                  message: err.message,
                });

                this.apiError
                  .addErreurGenerer(this.erreur.value)
                  .subscribe((data) => {});
              }
              this.isInexistClient = true;

              this.autoLogoutService.autoLogout(err.status, this.router);
            };
        }
      });
    }
  }
  getColor(): string | any {
    if (this.comptemarchandObj.statut === 1) {
      return '#ffffff !important';
    } else if (this.comptemarchandObj.statut === 0) {
      return '#e9ecef !important';
    }
  }

  openDetails(targetModal: any, cmpt: Comptemarchand) {
    this.modalService.open(targetModal, {
      centered: true,
      backdrop: 'static',
      size: 'xs',
    });
    this.client = document.getElementById('sexe');
    this.client.innerHTML = cmpt.sexe;
  }
  /*--------------------------------------------DEBUT commission-------------------------------------------- */
  getallCommission() {
    this.api.listCommission().subscribe(
      (res) => {
        //this.commissionData = res;
        this.selectcom= res;
        if (this.selectcom.length === 0) {return; }
        // for (const item of this.commissionData) {
        //   this.selectcom.push({label:item.libelle, value: item.idCommission});
        // }
      },
      (err) => {
        this.erreur = this.formbuilber.group({
          httpStatusCode: err.status,
          methode: 'CommissionImpl.listCommissions',
          login: localStorage.getItem('authlogin'),
          description: 'Erreur de recuperation des commissions',
          message: err.message,
        });

        this.apiError
          .addErreurGenerer(this.erreur.value)
          .subscribe((data) => {});

        this.autoLogoutService.autoLogout(err.status, this.router);
      }
    );
  }
  /*--------------------------------------------FIN commission-------------------------------------------- */
  /*--------------------------------------------DEBUT compte-------------------------------------------- */
  getallComptes() {
    this.api.getComptes().subscribe(
      (res) => {
        this.comptesData = res;
      },
      (err) => {
        this.autoLogoutService.autoLogout(err.status, this.router);
      }
    );
  }

  getComptes1(client: string) {
    console.log('okokokokoko')
    this.api.getMachandByRacine(client).subscribe((res: any) => {
      this.comptemarchandObj1 = res;
      console.log('INFO USER' + JSON.stringify(this.comptemarchandObj1))
      console.log('okokokokoko5555555')
      console.log(this.comptemarchandObj1)
      console.log('okokokokoko5555555')
      this.comptesMarch1 = this.comptemarchandObj1.comptes;
      console.log('okokokokoko666666666666')
      console.log(this.comptesMarch1)
      console.log('okokokokoko66666666666')
      this.comptesMarch2 = this.comptesMarch1;
      console.log('okokokokoko77777777777777777777')
      console.log(this.comptesMarch2)
      console.log('okokokokoko77777777777777777777')
    }),
      (error: any) => {
        this.isInexistClient = true;

        this.autoLogoutService.autoLogout(error.status, this.router);
      };
  }

  updateWorkout(event: any) {}
  /*--------------------------------------------------------DEBUT compte------------------------------------------------------------- */
  /**----------------------------------------------Ajouter Personne Moral------------------------------------------------------------ */


}
