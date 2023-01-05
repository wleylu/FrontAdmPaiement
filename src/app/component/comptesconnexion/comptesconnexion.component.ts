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
import { Console } from 'console';

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
       // console.log(res);
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
            this.loginConnect = localStorage.getItem('authlogin');
            this.checkProfil();
            this.agence();

           this.Search();

           //this.liens();
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

    this.initFormSearch();
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
    //console.log(this.userhabilitation + typeof this.userhabilitation);
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

/*   onCommissionFilter(e:any){

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

  } */

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
            this.comptemarchandObj.id=+this.messageRetour.idMaj;
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

     this.comptemarchandObj.agence= this.formValue.value.backagence;
    this.comptemarchandObj.refTransaction= this.formValue.value.refTransaction;
    this.comptemarchandObj.codeTransaction=this.formValue.value.codeTransaction;
    this.comptemarchandObj.nom = this.formValue.value.nom;
    this.comptemarchandObj.prenom = this.formValue.value.prenom;
    this.comptemarchandObj.login = this.formValue.value.refTransaction;
    this.comptemarchandObj.client = this.formValue.value.refTransaction;
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
 /*  actif1(row: any) {
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
  } */
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

  onEdit(idBenef: number) {
    let march: Comptemarchand= new Comptemarchand();
    this.showAdd = false;
    this.apii.getMarchand(idBenef).subscribe({
      next:(data:Comptemarchand) => {
        march = data;
        this.comptemarchandObj.id=idBenef;
       this.formValue.controls['pieceId'].setValue(march.pieceId);
      this.formValue.controls['montant'].setValue(march.montant);
        this.formValue.controls['refTransaction'].setValue(march.refTransaction);
        this.formValue.controls['codeTransaction'].setValue(march.codeTransaction);
        if (march.agence== null) {this.formValue.controls['backagence'].setValue(march.agence);}
          else{this.formValue.controls['backagence'].setValue(march.agence.id);}
          this.formValue.controls['nom'].setValue(march.nom);
          this.formValue.controls['prenom'].setValue(march.prenom);
          this.formValue.controls['email'].setValue(march.email);
          this.formValue.controls['tel'].setValue(march.tel);

      },
      error:(err)=>{
        console.log("Une erreur  s'est produite");
      }
    });

  }



  /*cette methode nous permet d'affiche le detail des comptes marchand et le reinitialiser après enregistrement*/
  /* choisir aussi le compte */

  updateComptemarchanddetails(){
    this.isExistClient=false;
    this.formAjoutMarchand(1);
    this.modifier = true;

    //console.log("Le marchand en modification : "+JSON.stringify(this.comptemarchandObj));

    //this.modifier = false;

    this.api.updateComptemarchand(this.comptemarchandObj).subscribe(
      (res) => {
        this.messageRetour = res;

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



  /*Pour faire la recherche dans un champs et appele la fonction a l'aide d'un clique*/

  Search() {

      this.api.getrecherchenomlogin(this.loginn,this.nom.toUpperCase(),this.loginConnect).subscribe(
        (data) => {
         // console.log("Machands liste : "+JSON.stringify(data));
          this.comptemarchandData = data;
        },
        (err) => {
          this.autoLogoutService.autoLogout(err.status, this.router);
        }
      );

  }

  disableTextbox = false;

  toggleDisable() {
    this.disableTextbox = !this.disableTextbox;
  }


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

  /*--------------------------------------------FIN commission-------------------------------------------- */
  /*--------------------------------------------DEBUT compte-------------------------------------------- */
  /* getallComptes() {
    this.api.getComptes().subscribe(
      (res) => {
        this.comptesData = res;
      },
      (err) => {
        this.autoLogoutService.autoLogout(err.status, this.router);
      }
    );
  } */




}
