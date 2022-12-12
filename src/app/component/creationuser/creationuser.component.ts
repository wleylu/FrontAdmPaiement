import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { Comptemarchand } from 'src/app/model/comptemarchand.model';
import { Mail } from 'src/app/model/mail.model';
import { Plafond, TypePaiement } from 'src/app/model/parametrages';
import { User } from 'src/app/model/user.model';
import { CreationcompteService } from 'src/app/services/creationcompte.service';
import { ParametragesService } from '../../services/parametrages.service';
import { erreur } from '../../model/erreur_genere.model';
import { ErreurGenererService } from 'src/app/services/erreur-generer.service';
import { AuthService } from 'src/app/services/auth.service';
import { AutoLogoutService } from 'src/app/services/auto-logout.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { HttpClient } from '@angular/common/http';
import { Agence } from 'src/app/model/agence.model';
import { Filiale } from 'src/app/model/filiale.model';
@Component({
  selector: 'app-creationuser',
  templateUrl: './creationuser.component.html',
  styleUrls: ['./creationuser.component.scss'],
  providers: [MessageService],
})
export class CreationuserComponent implements OnInit {
  monUser!: User[];
  lienMessageMailMarchand: any;
  lienMessageMailBack: any;
  adresseMail: any;
  formRechercheUser!: FormGroup;
  stat: any;
  formValue!: FormGroup;
  formRechercheLogin!: FormGroup;
  MailEnvoi!: FormGroup;
  compteuserObj: User = new User();
  compteuserObj1: User = new User();
  compteuserObj2: User = new User();
  compteuserObj3: User = new User();
  mailObj: Mail = new Mail();
  compteuserData!: any;
  showAdd!: number;
  showAddBackOffice!: number;
  showAdd1!: Boolean;
  showModal!: number;
  backOfficeData!: any;
  erreur!: FormGroup;
  mailRe! : any;
  loginRe! :any;
  disableModif!: number;
  backObj: User = new User();
  backObj1: User = new User();
  formValueBack!: FormGroup;
  nom = '';
  loginn = '';
  comptemarchandObj: Comptemarchand = new Comptemarchand();

  plafondData!: Plafond[];
  searchTerm!: string;

  user: User[] = [];
  supprimer!: Boolean;
  rowDelate!: any;
  motDepasse! : string;
  isDisable = false;
  checkMe!: number;

  p: number = 1;
  isInexistClient = false;
  listModes!: TypePaiement[];
  formValueM!: FormGroup;
  validMarch: any;
  emailExisteAjouterUser!: number;
  emailExisteModificationUser!: number;
  emailExisteAjouterUserBackOffice!: number;
  existeUserLogin!: number;
  emailExisteModificationUserBackoffice!: number;
  telExisteAjouterUser!: number;
  telExisteModificationUser!: number;
  telExisteAjouterUserBackOffice!: number;
  telExisteModificationUserBackoffice!: number;
  loginConnect: any;
  habili: any = 'ROLE_SUPER_ADMIN';
  valeurHabili: any;
  test!: boolean;
  UserInfos: any;
  test2!: any;
  filiales!: Filiale[];
  agences!: Agence[];

  aut: any = localStorage.getItem('authhabilitation');
  hab: undefined = JSON.parse(this.aut);
  UI: any;
  habb: any;
  agenceActuelle: any;
  agenceClient: any;
  constructor(
    private httpClient: HttpClient,
    private messageService: MessageService,
    private formbuilber: FormBuilder,
    private api: CreationcompteService,
    private modalService: NgbModal,
    private apiParametre: ParametragesService,
    private apiError: ErreurGenererService,
    private router: Router,
    public authService: AuthService,
    public autoLogoutService: AutoLogoutService,
    private apiMachand: ApiService
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
            this.UserDetail();
            console.log(this.habili + 'HABILI');
            this.initForm();
            this.getallCompteuser();
            this.initFormSearchuser();
            this.getallPlafonds();
            this.listmodepaiement();
            this.initFormBack();
            this.loginConnect = localStorage.getItem('authlogin');
            this.filiale();
            this.agence();
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

  filiale() {
    this.api.getFiliale().subscribe(
      (res) => {
        this.filiales = res;
      },
      (err) => {
        if (err.status != 401) {
          this.erreur = this.formbuilber.group({
            httpStatusCode: err.status,
            methode: 'filiale.liste',
            login: localStorage.getItem('authlogin'),
            description: 'Erreur de consultation des filiales',
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

  agence() {
    this.api.getAgence().subscribe(
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

  UserDetail() {
    this.httpClient
      .get(
        environment.urlFinal +
          '/efacture/detailUser/' +
          localStorage.getItem('authlogin')
      )
      .subscribe(
        (infosUser) => {
          console.log(infosUser);
          this.UserInfos = infosUser;
          this.valeurHabili = this.UserInfos.habilitation;
          console.log(this.valeurHabili);
        },
        (err) => {
          if (err.status != 401) {
            this.erreur = this.formbuilber.group({
              httpStatusCode: err.status,
              methode: 'User.Detail',
              login: localStorage.getItem('authlogin'),
              description: 'Erreur lors de la récupération des details de l\'utilisateurs',
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
  initForm(): void {
    console.log(JSON.stringify(this.compteuserObj) + 'OKKKKKKKKKKKKKKK');
    this.formValue = this.formbuilber.group({
      client: [
        this.compteuserObj.client,
        [Validators.required, Validators.minLength(8)],
      ],
      nom: [this.compteuserObj.nom, [Validators.required]],
      adCm: [this.compteuserObj.adCm, [Validators.required]],
      login: [this.compteuserObj.client],
      email: [this.compteuserObj.email, [Validators.required]],
      tel: [this.compteuserObj.tel, [Validators.required]],
      habilitation: [this.compteuserObj.habilitation, [Validators.required]],
      statut: [this.compteuserObj.status],
      reinitialiser: false,
      selectPlafond: [this.compteuserObj.typePlafond, [Validators.required]],
      typeComfirmation: [
        this.compteuserObj.typeComfirmation,
        [Validators.required],
      ],
      backagence: [this.compteuserObj.agence],
      backfiliale: [this.compteuserObj.filiale],
    });
  }
  initForm1(): void {
    this.formValueM = this.formbuilber.group({
      login1: ['', , [Validators.required, Validators.minLength(8)]],
      nom1: ['', []],
      prenom1: [''],
      email1: [''],
      tel1: [''],
      habilitation1: [''],
      statut1: [''],
    });
  }
  initFormSearchuser(): void {
    this.formRechercheUser = this.formbuilber.group({
      insertuser: [''],
      searchLoginuser: [''],
    });
  }
  clickAddcompteuser() {
    this.formValue.reset();
    this.showAdd = 1;
    this.showModal = 1;
  }

  postCompteuserdetails() {
  console.log('ok')
    const controls = this.formValue.controls;
    if (this.formValue.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
      return;
    }
    this.compteuserObj.nom = this.formValue.value.nom;
    this.compteuserObj.adCm = this.formValue.value.adCm;
    this.compteuserObj.login = this.formValue.value.login;
    this.compteuserObj.habilitation = this.formValue.value.habilitation;
    this.compteuserObj.tel = this.formValue.value.tel;
    this.compteuserObj.email = this.formValue.value.email;

    this.compteuserObj.status = this.formValue.value.statut;
    this.compteuserObj.typePlafond = this.formValue.value.selectPlafond;
    this.compteuserObj.typeComfirmation = this.formValue.value.typeComfirmation;
    this.compteuserObj.reinitialiser = this.formValue.value.reinitialiser;
    this.compteuserObj.loginAdd = this.loginConnect;
    this.compteuserObj.loginMaj = this.loginConnect;
    //this.compteuserObj.validation = 1;

    this.api.getUserByMail(this.compteuserObj.email).subscribe((resp) => {
      this.api
        .getUserByTel(this.compteuserObj.tel)
        .subscribe((respTelMarchand) => {
          if (resp != null) {
            this.emailExisteAjouterUser = 0;
            this.telExisteAjouterUser = 1;
          } else if (respTelMarchand != null) {
            this.telExisteAjouterUser = 0;
            this.emailExisteAjouterUser = 1;
          } else {
            this.emailExisteAjouterUser = 1;
            this.telExisteAjouterUser = 1;
            this.api.postCompteuser(this.compteuserObj).subscribe(
              (res) => {
                this.compteuserObj1 = res;
                this.formValue.reset();

                this.MailEnvoi = this.formbuilber.group({
                  expediteur: this.adresseMail,
                  destinataire: this.compteuserObj1.email,
                  objet: 'PARAMETRE DE CONNEXION EFACTURE' + ' ',
                  message:
                    'Salut Mr/Mme' +
                    ' ' +
                    this.compteuserObj1.nom +
                    '\n' +
                    'Votre login est:' +
                    ' ' +
                    this.compteuserObj1.login +
                    '\n' +
                    'Et votre mot de passe est:' +
                    ' ' +
                    this.compteuserObj1.password +
                    '\n' +
                    'Cliquez sur le lien ci-dessous pour vous connecter et modifier votre mot de passe' +
                    '\n' +
                    this.lienMessageMailMarchand +
                    '\n',
                });
                this.api.testSms(this.compteuserObj1.tel,
                  'BONJOUR+' + this.compteuserObj1.nom +'."+' + this.compteuserObj1.login + '"+EST+VOTRE+LOGIN+ET+"'+this.compteuserObj1.password+'"+EST+VOTRE+MOT+DE+PASSE.+LIEN:+\n'+this.lienMessageMailMarchand)
                  .subscribe((retourSms)=>{
                    console.log(retourSms)

                  })

                if (res.login != null) {
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Succes',
                    detail: 'Utilisateur enregistré avec succes',
                  });
                  this.api.EnvoiMail(this.MailEnvoi.value).subscribe((data) => {
                    this.messageService.add({
                      severity: 'success',
                      summary: 'Succes',
                      detail:
                        'Mail de parametre de connexions envoyé avec succes',
                    });
                    this.formValue.reset();
                  },
                  (err) => {
                    if (err.status != 401) {
                  this.erreur = this.formbuilber.group({
                    httpStatusCode: err.status,
                    methode: 'UserServiceImpl.enregistrerUserEntity',
                    login: localStorage.getItem('authlogin'),
                    description: "Erreur de l'envoi du mail des parametres de connexion",
                    message: err.message,
                  });
                  this.apiError
                    .addErreurGenerer(this.erreur.value)
                    .subscribe((data) => {});
                }

                  }
                  );
                } else {
                  this.messageService.add({
                    severity: 'info',
                    summary: 'Information',
                    detail: 'Utilisateur existant !',
                  });
                }

                this.getallCompteuser();
              },
              (err) => {
                if (err.status != 401) {
                  this.erreur = this.formbuilber.group({
                    httpStatusCode: err.status,
                    methode: 'UserServiceImpl.enregistrerUserEntity',
                    login: localStorage.getItem('authlogin'),
                    description: "Erreur de creation de l'utilisateur",
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

  postCompteuserdetails1() {}
  isControle(controlName: string, validationType: string) {
    const control = this.formValue.controls[controlName];
    if (!control) {
      return false;
    }
    const result =
      control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }

  getallCompteuser() {
    this.api.getCompteuser().subscribe(
      (res) => {
        this.compteuserData = res;
      },
      (err) => {
        if (err.status != 401) {
          this.erreur = this.formbuilber.group({
            httpStatusCode: err.status,
            methode: 'UserServiceImpl.listeUserEntity',
            login: localStorage.getItem('authlogin'),
            description: 'Erreur de consultation des utilisateurs',
            message: err.message,
          });

          this.apiError
            .addErreurGenerer(this.erreur.value)
            .subscribe((data) => {});
        }

        //this.autoLogoutService.autoLogout(err.status, this.router);
      }
    );
  }

  deletedcompteuser(row: any) {
    this.api.deletedCompteuser(row.id).subscribe((res) => {
      //alert('compte supprimer');
      this.getallCompteuser();
    });
  }

  onEdit(row: any) {
    this.showAdd = 0;
    this.compteuserObj.id = row.id;
    this.compteuserObj = row;
    this.validMarch = row.validation;

    this.initForm();
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
    this.showAdd = 3;
    this.compteuserObj.id = row.id;
    this.compteuserObj = row;
    this.validMarch = 1;

    this.initForm();
    this.isDisable = true;

    console.log(JSON.stringify(this.compteuserObj.agence))
    if(this.compteuserObj.agence == null){
      this.api.AgenceId(0).subscribe((agc)=>{
        this.agenceClient = agc.libelle
      })
    }
    else{
    this.api.AgenceId(this.compteuserObj.agence.id).subscribe((agc)=>{
      this.agenceClient = agc.libelle
    })
  }

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
  Search() {
    //alert(this.loginn + '777' + this.nom )
    if(this.loginn != null ||this.loginn != '' && this.nom != null || this.nom != ''){
      this.api.getrecherchenomlogin(this.nom.toUpperCase(), this.loginn).subscribe(
        (data) => {
          this.compteuserData = data;
        },
        (err) => {
          this.autoLogoutService.autoLogout(err.status, this.router);
        }
      );
    }
    else{
      if(this.loginn == null || this.loginn == ''){
        this.api.getrecherche(this.nom.toUpperCase()).subscribe(
          (data) => {
            this.compteuserData = data;
          },
          (err) => {
            this.autoLogoutService.autoLogout(err.status, this.router);
          }
        );
      }
      if(this.nom == null || this.nom == ''){
        this.api.getrecherchelogin(this.loginn).subscribe(
          (data) => {
            this.compteuserData = data;
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
    // this.api.getrecherchenomlogin(this.loginn, this.nom.toUpperCase()).subscribe(
    //   (data) => {
    //     this.compteuserData = data;
    //   },
    //   (err) => {
    //     this.autoLogoutService.autoLogout(err.status, this.router);
    //   }
    // );
  }
  /*******************************************************************************************************************************
  *****************************************************Modifier utilisateur client************************************************
  ******************************************************************************************************************************/
  updateCompteuserdetails() {
    this.compteuserObj.nom = this.formValue.value.nom;
    this.compteuserObj.adCm = this.formValue.value.adCm;
    this.compteuserObj.login = this.formValue.value.login;
    this.compteuserObj.habilitation = this.formValue.value.habilitation;
    this.compteuserObj.tel = this.formValue.value.tel;
    this.compteuserObj.email = this.formValue.value.email;

    this.compteuserObj.status = this.formValue.value.statut;
    this.compteuserObj.typePlafond = this.formValue.value.selectPlafond;
    this.compteuserObj.typeComfirmation = this.formValue.value.typeComfirmation;
    this.compteuserObj.reinitialiser = this.formValue.value.reinitialiser;
    this.compteuserObj.loginMaj = this.loginConnect;
    /*******************************************************************************************************************************
  *****************************************************Reinitialisation Utilisateur************************************************
  ******************************************************************************************************************************/
    if( this.compteuserObj.reinitialiser == true){
      let generatePwd : string;
      this.api.generatePwd().subscribe((mdp)=>{
        generatePwd = mdp
        this.compteuserObj.password = generatePwd;
      })
      this.api.getUserByMail(this.compteuserObj.email).subscribe((resp) => {
        this.api
          .getUserByTel(this.compteuserObj.tel)
          .subscribe((respUpdateMarchandTel) => {
            if (
              resp != null &&
              resp.login != this.compteuserObj.login &&
              resp.email == this.compteuserObj.email
            ) {
              this.emailExisteModificationUser = 0;
              this.telExisteModificationUser = 1;
            } else if (
              respUpdateMarchandTel != null &&
              respUpdateMarchandTel.login != this.compteuserObj.login &&
              respUpdateMarchandTel.tel == this.compteuserObj.tel
            ) {
              this.telExisteModificationUser = 0;
              this.emailExisteModificationUser = 1;
            } else {
              this.emailExisteModificationUser = 1;
              this.telExisteModificationUser = 1;
              console.log(JSON.stringify(this.compteuserObj) + 'CO');
             // alert('OKOK')
              this.api.updateCompteuser(this.compteuserObj).subscribe(
                (res) => {
                  let mdp : string;
                  if(res.login != null){
                    this.api.decriptPwd(res.login).subscribe((pwd : string)=>{
                      console.log(pwd);
                      mdp = pwd;
                      this.MailEnvoi = this.formbuilber.group({
                        // expediteur: this.adresseMail,
                        destinataire: this.mailRe,
                        objet: 'PARAMETRE DE CONNEXION EFACTURE' + ' ',
                        message:
                          'Salut' +
                          ' ' +
                          res.nom +
                          '\n' +
                          'Votre login est:' +
                          ' ' +
                          res.login+
                          '\n' +
                          'Et votre mot de passe est:' +
                          ' ' + mdp
                           +
                          '\n' +
                          'Cliquez sur le lien ci-dessous pour vous connecter et modifier votre mot de passe' +
                          '\n' +
                          this.lienMessageMailMarchand +
                          '\n',
                      });
                      this.api.testSms(res.tel,
                        'BONJOUR+' + res.nom +'.+"' + res.login + '"+EST+VOTRE+LOGIN+ET+"'+mdp+'"+EST+VOTRE+MOT+DE+PASSE.+LIEN:+\n'+this.lienMessageMailMarchand)
                        .subscribe((retourSms)=>{
                          console.log(retourSms);
                        })
                      console.log(JSON.stringify(this.MailEnvoi.value));
                      this.api
                        .EnvoiMail(this.MailEnvoi.value)
                        .subscribe((data) => {
                          console.log(data);
                          if(data){
                            this.messageService.add({
                              severity: 'success',
                              summary: 'Succes',
                              detail:
                                'Mail de parametre de connexion envoyé avec succès',
                            });
                          }
                        },(err)=>{
                          console.log(err)
                          if (err.status != 401) {
                            this.erreur = this.formbuilber.group({
                              httpStatusCode: err.status,
                              methode: 'Reinitialisation mot de passe',
                              login: localStorage.getItem('authlogin'),
                              description: 'Erreur lors de l\envoi des paramètres de connexion',
                              message: err.message,
                            });

                            this.apiError
                              .addErreurGenerer(this.erreur.value)
                              .subscribe((data) => {});
                          }

                         this.autoLogoutService.autoLogout(err.status, this.router);
                        });
                    });
                  }
                  console.log(JSON.stringify(res)+ 'NEW MP');
                 // alert('OK')
                  this.comptemarchandObj.statut = res.status;
                  this.mailRe = res.email;
                  this.loginRe = res.login;
                  console.log(JSON.stringify(res) + 'MES INFOS')
                  this.apiMachand.detailById(res.login).subscribe((data) => {
                    data.statut = res.status;

                    this.apiMachand
                      .updateComptemarchand(data)
                      .subscribe((datas) => {});
                  });

                  this.messageService.add({
                    severity: 'success',
                    summary: 'Succes',
                    detail: 'Utilisateur modifié avec succes',
                  });
                  console.log('ok5');
                  let ref = document.getElementById('cancel');
                  ref?.click();
                  this.formValue.reset();
                  console.log('ok5');
                  this.getallCompteuser();
                },
                (err) => {
                  if (err.status != 401) {
                    this.erreur = this.formbuilber.group({
                      httpStatusCode: err.status,
                      methode: 'UserServiceImpl.modifierUserEntity',
                      login: localStorage.getItem('authlogin'),
                      description: 'Erreur de consultation des utilisateurs',
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
    /*******************************************************************************************************************************
  *****************************************************Modifier utilisateur************************************************
  ******************************************************************************************************************************/
    else{
      this.api.getUserByMail(this.compteuserObj.email).subscribe((resp) => {
        this.api
          .getUserByTel(this.compteuserObj.tel)
          .subscribe((respUpdateMarchandTel) => {
            if (
              resp != null &&
              resp.login != this.compteuserObj.login &&
              resp.email == this.compteuserObj.email
            ) {
              this.emailExisteModificationUser = 0;
              this.telExisteModificationUser = 1;
            } else if (
              respUpdateMarchandTel != null &&
              respUpdateMarchandTel.login != this.compteuserObj.login &&
              respUpdateMarchandTel.tel == this.compteuserObj.tel
            ) {
              this.telExisteModificationUser = 0;
              this.emailExisteModificationUser = 1;
            } else {
              this.emailExisteModificationUser = 1;
              this.telExisteModificationUser = 1;
              console.log(JSON.stringify(this.compteuserObj) + 'CO');
             // alert('OKOK')
              this.api.updateCompteuser(this.compteuserObj).subscribe(
                (res) => {
                  let mdp : string;
                  if(res.login != null){
                    this.comptemarchandObj.statut = res.status;
                    this.mailRe = res.email;
                    this.loginRe = res.login;
                    console.log(JSON.stringify(res) + 'MES INFOS')
                    this.apiMachand.detailById(res.login).subscribe((data) => {
                      data.statut = res.status;

                      this.apiMachand
                        .updateComptemarchand(data)
                        .subscribe((datas) => {
                          if(datas){
                            this.messageService.add({
                              severity: 'success',
                              summary: 'Succes',
                              detail: 'Utilisateur modifié avec succes',
                            });
                          }
                          else{
                            this.messageService.add({
                              severity: 'error',
                              summary: 'Echec',
                              detail: 'Utilisateur non modifié',
                            });
                          }
                        },(err) => {
                          if (err.status != 401) {
                            this.erreur = this.formbuilber.group({
                              httpStatusCode: err.status,
                              methode: 'UserServiceImpl.modifierUserEntity',
                              login: localStorage.getItem('authlogin'),
                              description: 'Erreur de la modification du compte marchand',
                              message: err.message,
                            });

                            this.apiError
                              .addErreurGenerer(this.erreur.value)
                              .subscribe((data) => {});
                          }

                          this.autoLogoutService.autoLogout(err.status, this.router);
                        });
                    });
                  }
                  else {
                    this.messageService.add({
                      severity: 'info',
                      summary: 'Information',
                      detail: 'Utilisateur existant !',
                    });
                  }
                  console.log('ok5');
                  let ref = document.getElementById('cancel');
                  ref?.click();
                  this.formValue.reset();
                  console.log('ok5');
                  this.getallCompteuser();
                },
                (err) => {
                  if (err.status != 401) {
                    this.erreur = this.formbuilber.group({
                      httpStatusCode: err.status,
                      methode: 'UserServiceImpl.modifierUserEntity',
                      login: localStorage.getItem('authlogin'),
                      description: 'Erreur de la modification de utilisateurs',
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
   //alert("OK")

    // this.api.getUserByMail(this.compteuserObj.email).subscribe((resp) => {
    //   this.api
    //     .getUserByTel(this.compteuserObj.tel)
    //     .subscribe((respUpdateMarchandTel) => {
    //       if (
    //         resp != null &&
    //         resp.login != this.compteuserObj.login &&
    //         resp.email == this.compteuserObj.email
    //       ) {
    //         this.emailExisteModificationUser = 0;
    //         this.telExisteModificationUser = 1;
    //       } else if (
    //         respUpdateMarchandTel != null &&
    //         respUpdateMarchandTel.login != this.compteuserObj.login &&
    //         respUpdateMarchandTel.tel == this.compteuserObj.tel
    //       ) {
    //         this.telExisteModificationUser = 0;
    //         this.emailExisteModificationUser = 1;
    //       } else {
    //         this.emailExisteModificationUser = 1;
    //         this.telExisteModificationUser = 1;
    //         console.log(JSON.stringify(this.compteuserObj + 'CO'));
    //         alert('OKOK')
    //         this.api.updateCompteuser(this.compteuserObj).subscribe(
    //           (res) => {
    //             console.log(JSON.stringify(res));
    //             alert('OK')
    //             this.comptemarchandObj.statut = res.status;
    //             this.mailRe = res.email;
    //             this.loginRe = res.login;
    //             console.log(JSON.stringify(res) + 'MES INFOS')
    //             this.apiMachand.detailById(res.login).subscribe((data) => {
    //               data.statut = res.status;

    //               this.apiMachand
    //                 .updateComptemarchand(data)
    //                 .subscribe((datas) => {});
    //             });

    //             this.messageService.add({
    //               severity: 'success',
    //               summary: 'Succes',
    //               detail: 'Utilisateur modifié avec succes',
    //             });


    //             if (res.reinitialiser == true) {

    //               let mdp : string;

    //               this.api.updateCompteuser(res).subscribe((data) => {
    //                 console.log(JSON.stringify(data) + 'MES INFOS 2')
    //                 if(data.login != null){
    //                   this.api.decriptPwd(data.login).subscribe((pwd : string)=>{
    //                     console.log(pwd);
    //                     mdp = pwd;
    //                     this.MailEnvoi = this.formbuilber.group({
    //                       // expediteur: this.adresseMail,
    //                       destinataire: this.mailRe,
    //                       objet: 'PARAMETRE DE CONNEXION EFACTURE' + ' ',
    //                       message:
    //                         'Salut' +
    //                         ' ' +
    //                         data.nom +
    //                         '\n' +
    //                         'Votre login est:' +
    //                         ' ' +
    //                         this.loginRe+
    //                         '\n' +
    //                         'Et votre mot de passe est:' +
    //                         ' ' + mdp
    //                          +
    //                         '\n' +
    //                         'Cliquez sur le lien ci-dessous pour vous connecter et modifier votre mot de passe' +
    //                         '\n' +
    //                         this.lienMessageMailMarchand +
    //                         '\n',
    //                     });
    //                     console.log(JSON.stringify(this.MailEnvoi.value));
    //                     this.api
    //                       .EnvoiMail(this.MailEnvoi.value)
    //                       .subscribe((data) => {
    //                         console.log(data);
    //                         if(data){
    //                           this.messageService.add({
    //                             severity: 'success',
    //                             summary: 'Succes',
    //                             detail:
    //                               'Mail de parametre de connexion envoyé avec succès',
    //                           });
    //                         }

    //                       },(err)=>{
    //                         console.log(err)
    //                         if (err.status != 401) {
    //                           this.erreur = this.formbuilber.group({
    //                             httpStatusCode: err.status,
    //                             methode: 'Reinitialisation mot de passe',
    //                             login: localStorage.getItem('authlogin'),
    //                             description: 'Erreur lors de l\envoi des paramètres de connexion',
    //                             message: err.message,
    //                           });

    //                           this.apiError
    //                             .addErreurGenerer(this.erreur.value)
    //                             .subscribe((data) => {});
    //                         }

    //                        this.autoLogoutService.autoLogout(err.status, this.router);
    //                       });
    //                   });
    //                 }

    //                  else {
    //                   this.messageService.add({
    //                     severity: 'info',
    //                     summary: 'Information',
    //                     detail: 'Utilisateur existant !',
    //                   });
    //                 }
    //               });
    //             }
    //             // let ref = document.getElementById('cancel');
    //             // ref?.click();
    //             this.formValue.reset();

    //             this.getallCompteuser();
    //           },
    //           (err) => {
    //             if (err.status != 401) {
    //               this.erreur = this.formbuilber.group({
    //                 httpStatusCode: err.status,
    //                 methode: 'UserServiceImpl.modifierUserEntity',
    //                 login: localStorage.getItem('authlogin'),
    //                 description: 'Erreur de consultation des utilisateurs',
    //                 message: err.message,
    //               });

    //               this.apiError
    //                 .addErreurGenerer(this.erreur.value)
    //                 .subscribe((data) => {});
    //             }

    //             this.autoLogoutService.autoLogout(err.status, this.router);
    //           }
    //         );
    //       }
    //     });
    // });
  }



  updateCompteuserdetails1() {
    this.compteuserObj.nom = this.formValue.value.nom;
    this.compteuserObj.adCm = this.formValue.value.adCm;
    this.compteuserObj.login = this.formValue.value.login;
    this.compteuserObj.habilitation = this.formValue.value.habilitation;
    this.compteuserObj.tel = this.formValue.value.tel;
    this.compteuserObj.email = this.formValue.value.email;

    this.compteuserObj.status = this.formValue.value.statut;
    this.compteuserObj.typePlafond = this.formValue.value.selectPlafond;
    this.compteuserObj.typeComfirmation = this.formValue.value.typeComfirmation;
    this.compteuserObj.loginMaj = this.loginConnect;

    this.api.updateCompteuser(this.compteuserObj).subscribe(
      (res) => {
        this.comptemarchandObj.statut = res.status;

        this.messageService.add({
          severity: 'success',
          summary: 'Succes',
          detail: 'Utilisateur modifié avec succes',
        });

        let ref = document.getElementById('cancel');
        ref?.click();
        this.formValue.reset();
        this.getallCompteuser();
      },
      (err) => {
        if (err.status != 401) {
          this.erreur = this.formbuilber.group({
            httpStatusCode: err.status,
            methode: 'UserServiceImpl.modifierUserEntity',
            login: localStorage.getItem('authlogin'),
            description: 'Erreur de consultation des utilisateurs',
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

  SearchUser1(): void {
    if (this.formRechercheUser.value.insertuser) {
      this.api.getrecherche(this.formRechercheUser.value.insertuser).subscribe(
        (res) => {
          this.compteuserData = res;
        },
        (err) => {
          if (err.status != 401) {
            this.erreur = this.formbuilber.group({
              httpStatusCode: err.status,
              methode: 'UserServiceImpl.rechercheByLogin',
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
    } else if (this.formRechercheUser.value.searchLogin) {
      this.api
        .getrecherchelogin(this.formRechercheUser.value.searchLogin)
        .subscribe(
          (data) => {
            this.compteuserData = data;
          },
          (err) => {
            if (err.status != 401) {
              this.erreur = this.formbuilber.group({
                httpStatusCode: err.status,
                methode: 'UserServiceImpl.rechercheByLogin',
                login: localStorage.getItem('authlogin'),
                description:
                  'Erreur de consultation des resultats utilisateurs',
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
  }
  SearchUser2(): void {
    if (this.formRechercheUser.value.insertuser) {
      this.api.getrecherche(this.formRechercheUser.value.insertuser).subscribe(
        (res) => {
          this.compteuserData = res;
        },
        (err) => {
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

          this.autoLogoutService.autoLogout(err.status, this.router);
        }
      );
    } else if (this.formRechercheUser.value.searchLogin) {
      this.api
        .getrecherchelogin(this.formRechercheUser.value.searchLogin)
        .subscribe(
          (data) => {
            this.compteuserData = data;
          },
          (err) => {
            if (err.status != 401) {
              this.erreur = this.formbuilber.group({
                httpStatusCode: err.status,
                methode: 'UserServiceImpl.rechercheByNomAndLogin',
                login: localStorage.getItem('authlogin'),
                description:
                  'Erreur de consultation des resultats utilisateurs',
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
  }
  SearchUser(nom: string, login: string): void {
    nom = this.formRechercheUser.value.insertuser;
    login = this.formRechercheUser.value.searchLoginuser;

    this.api.getrecherchenomlogin(nom, login).subscribe(
      (data) => {
        this.compteuserData = data;
      },
      (err) => {
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

        this.autoLogoutService.autoLogout(err.status, this.router);
      }
    );
  }
  /* confirmation de  supression  */
  confirmDelate(content: any, row: any) {
    this.rowDelate = row;
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        () => {
          this.deletedcompteuser(this.rowDelate);
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

  searchclient(client: string): any {
    if (client.length >= 8) {
      this.api.getsignaletiqueUser(client).subscribe((res: any) => {
        this.isDisable = false;
        this.isInexistClient = false;
        this.compteuserObj = res;
        this.initForm();
      }),
        (err: any) => {
          this.isInexistClient = true;
          if (err.status != 401) {
            this.erreur = this.formbuilber.group({
              httpStatusCode: err.status,
              methode: 'UserServiceImpl.getUser',
              login: localStorage.getItem('authlogin'),
              description: "Erreur de recuperation de l'utilisateurs",
              message: err.message,
            });
            this.apiError
              .addErreurGenerer(this.erreur.value)
              .subscribe((data) => {});
          }

          this.autoLogoutService.autoLogout(err.status, this.router);
        };
    }
  }
  getallPlafonds() {
    this.apiParametre.getPlafond().subscribe(
      (res) => {
        this.plafondData = res;
      },
      (err) => {
        if (err.status != 401) {
          this.erreur = this.formbuilber.group({
            httpStatusCode: err.status,
            methode: 'PlafondImp.plafond',
            login: localStorage.getItem('authlogin'),
            description: 'Erreur de consultation des plafonds',
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
  listmodepaiement() {
    this.apiParametre.getTypePaie().subscribe(
      (res) => {
        this.listModes = res;
      },
      (err) => {
        if (err.status != 401) {
          this.erreur = this.formbuilber.group({
            httpStatusCode: err.status,
            methode: 'TypePaieImp.TypePaie',
            login: localStorage.getItem('authlogin'),
            description: 'Erreur de consultation des confirmation de paiement',
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
  /*************************************************BACKOFFICE************************************************************ */
  initFormBack(): void {
    if (this.habili == this.valeurHabili) {
      console.log('raouf');
    }
    if (localStorage.getItem('authhabilitation') == this.habili) {
      console.log('2222222222');
    }
    this.formValueBack = this.formbuilber.group({
      backlogin: [this.backObj1.login, [Validators.required]],
      backnom: [this.backObj1.nom, []],
      backprenom: [this.backObj1.prenom, []],
      backadCm: [this.backObj1.adCm],
      backemail: [this.backObj1.email, [Validators.required]],
      backtel: [this.backObj1.tel, [Validators.required]],
      backhabilitation: [this.backObj1.habilitation],
      backstatut: [this.backObj1.status],
      backreinitialiser: false,
      backagence: [],
      backfiliale: [this.backObj1.filiale],
    });
  }

  clickAddback() {
    this.showAddBackOffice = 1;
    this.disableModif = 2;
    console.log(this.formValueBack.value);
    console.log(this.formValue.value)

  }
  ajoutBackoffice() {
    console.log("ok")
    this.backObj.nom = this.formValueBack.value.backnom;
    this.backObj.prenom = this.formValueBack.value.backprenom;
    this.backObj.adCm = this.formValueBack.value.backadCm;
    this.backObj.login = this.formValueBack.value.backlogin;
    this.backObj.habilitation = this.formValueBack.value.backhabilitation;
    this.backObj.tel = this.formValueBack.value.backtel;
    this.backObj.email = this.formValueBack.value.backemail;

    this.backObj.status = 1;
    this.backObj.reinitialiser = this.formValueBack.value.reinitialiser;
    this.backObj.loginAdd = this.loginConnect;
    this.backObj.loginMaj = this.loginConnect;
    this.backObj.agence = this.formValueBack.value.backagence;
    this.backObj.filiale = this.formValueBack.value.backfiliale;
    this.backObj.validation = 1;
    /*  */
    console.log( this.backObj);
    this.api.getUserByMail(this.backObj.email).subscribe((resp) => {
      this.api.getUserByTel(this.backObj.tel).subscribe((respBackofficeTel) => {
        if (resp != null) {
          if (this.formValueBack.value.backhabilitation=='ROLE_USER' && resp.habilitation != 'ROLE_USER') {
            console.log("ok5")


            this.api.postCompteuser(this.backObj).subscribe(
              (res) => {
                if(res){
                  this.backObj1 = res;

                  this.api.decrypt(res.password).subscribe((result)=>{
                    //alert(result)
                    let mdp : string

                        mdp = result;
                        console.log(mdp);
                    this.MailEnvoi = this.formbuilber.group({
                      expediteur: this.adresseMail,
                      destinataire: this.backObj1.email,
                      objet: 'PARAMETRE DE CONNEXION EFACTURE' + ' ',
                      message:
                        'Salut Mr/Mme' +
                        ' ' +
                        this.backObj1.nom +
                        '\n' +
                        'Votre login est:' +
                        ' ' +
                        this.backObj1.login +
                        '\n' +
                        'Et votre mot de passe est:' +
                        ' ' +mdp
                        +
                        '\n' +
                        'Cliquez sur le lien ci-dessous pour vous connecter et modifier votre mot de passe' +
                        '\n' +
                        this.lienMessageMailBack +
                        '\n',
                    });
                    this.api.testSms(this.backObj1.tel,
                      'BONJOUR+' + this.backObj1.nom +'.+"' + this.backObj1.login + '"+EST+VOTRE+LOGIN+ET+"'+mdp+'"+EST+VOTRE+MOT+DE+PASSE.+LIEN:+\n'+this.lienMessageMailBack)
                      .subscribe((retourSms)=>{
                        console.log(retourSms)

                      })

                if (this.backObj1.login != null) {
                  this.existeUserLogin = 1;
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Succes',
                    detail: 'Utilisateur enregistré avec succes',
                  });
                  this.api.EnvoiMail(this.MailEnvoi.value).subscribe((data) => {
                    this.messageService.add({
                      severity: 'success',
                      summary: 'Succes',
                      detail:
                        'Mail de parametre de connexions envoyé avec succes',
                    });
                  });
                  this.formValueBack.reset();
                } else {
                  this.existeUserLogin = 0;
                }
                  },
                  (err) => {
                    if (err.status != 401) {
                      this.erreur = this.formbuilber.group({
                        httpStatusCode: err.status,
                        methode: 'UserServiceImpl.enregistrerUserEntity',
                        login: localStorage.getItem('authlogin'),
                        description: "Erreur de generation du mot de passe",
                        message: err.message,
                      });
                      this.apiError
                        .addErreurGenerer(this.erreur.value)
                        .subscribe((data) => {});
                    }

                    this.autoLogoutService.autoLogout(err.status, this.router);
                  })
                }



                this.getallCompteuser();
              },
              (err) => {
                if (err.status != 401) {
                  this.erreur = this.formbuilber.group({
                    httpStatusCode: err.status,
                    methode: 'UserServiceImpl.enregistrerUserEntity',
                    login: localStorage.getItem('authlogin'),
                    description: "Erreur de creation de l'utilisateur",
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
          else if(this.formValueBack.value.backhabilitation !='ROLE_USER' && resp.habilitation == 'ROLE_USER'){

            console.log("ok4")
            this.api.postCompteuser(this.backObj).subscribe(
              (res) => {
                if(res){
                  this.backObj1 = res;

                  this.api.decrypt(res.password).subscribe((result)=>{
                    //alert(result)
                    let mdp : string

                        mdp = result;
                        console.log(mdp);
                    this.MailEnvoi = this.formbuilber.group({
                      expediteur: this.adresseMail,
                      destinataire: this.backObj1.email,
                      objet: 'PARAMETRE DE CONNEXION EFACTURE' + ' ',
                      message:
                        'Salut Mr/Mme' +
                        ' ' +
                        this.backObj1.nom +
                        '\n' +
                        'Votre login est:' +
                        ' ' +
                        this.backObj1.login +
                        '\n' +
                        'Et votre mot de passe est:' +
                        ' ' +mdp
                        +
                        '\n' +
                        'Cliquez sur le lien ci-dessous pour vous connecter et modifier votre mot de passe' +
                        '\n' +
                        this.lienMessageMailBack +
                        '\n',
                    });
                    this.api.testSms(this.backObj1.tel,
                      'BONJOUR+' + this.backObj1.nom +'.+"' + this.backObj1.login + '"+EST+VOTRE+LOGIN+ET+"'+mdp+'"+EST+VOTRE+MOT+DE+PASSE.+LIEN:+\n'+this.lienMessageMailBack)
                      .subscribe((retourSms)=>{
                        console.log(retourSms)

                      })

                if (this.backObj1.login != null) {
                  this.existeUserLogin = 1;
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Succes',
                    detail: 'Utilisateur enregistré avec succes',
                  });
                  this.api.EnvoiMail(this.MailEnvoi.value).subscribe((data) => {
                    this.messageService.add({
                      severity: 'success',
                      summary: 'Succes',
                      detail:
                        'Mail de parametre de connexions envoyé avec succes',
                    });
                  });
                  this.formValueBack.reset();
                } else {
                  this.existeUserLogin = 0;
                }
                  },
                  (err) => {
                    if (err.status != 401) {
                      this.erreur = this.formbuilber.group({
                        httpStatusCode: err.status,
                        methode: 'UserServiceImpl.enregistrerUserEntity',
                        login: localStorage.getItem('authlogin'),
                        description: "Erreur de generation du mot de passe",
                        message: err.message,
                      });
                      this.apiError
                        .addErreurGenerer(this.erreur.value)
                        .subscribe((data) => {});
                    }

                    this.autoLogoutService.autoLogout(err.status, this.router);
                  })
                }



                this.getallCompteuser();
              },
              (err) => {
                if (err.status != 401) {
                  this.erreur = this.formbuilber.group({
                    httpStatusCode: err.status,
                    methode: 'UserServiceImpl.enregistrerUserEntity',
                    login: localStorage.getItem('authlogin'),
                    description: "Erreur de creation de l'utilisateur",
                    message: err.message,
                  });
                  this.apiError
                    .addErreurGenerer(this.erreur.value)
                    .subscribe((data) => {});
                }

                this.autoLogoutService.autoLogout(err.status, this.router);
              }
            );


          }else if(this.formValueBack.value.backhabilitation !='ROLE_USER' && resp.habilitation != 'ROLE_USER'){
            this.emailExisteAjouterUserBackOffice = 0;
            this.telExisteAjouterUserBackOffice != 1;
          }

        } else if (respBackofficeTel != null) {
          if (this.formValueBack.value.backhabilitation=='ROLE_USER' && respBackofficeTel.habilitation != 'ROLE_USER') {
            console.log("ok")

            this.api.postCompteuser(this.backObj).subscribe(
              (res) => {
                if(res){
                  this.backObj1 = res;

                  this.api.decrypt(res.password).subscribe((result)=>{
                    //alert(result)
                    let mdp : string

                        mdp = result;
                        console.log(mdp);
                    this.MailEnvoi = this.formbuilber.group({
                      expediteur: this.adresseMail,
                      destinataire: this.backObj1.email,
                      objet: 'PARAMETRE DE CONNEXION EFACTURE' + ' ',
                      message:
                        'Salut Mr/Mme' +
                        ' ' +
                        this.backObj1.nom +
                        '\n' +
                        'Votre login est:' +
                        ' ' +
                        this.backObj1.login +
                        '\n' +
                        'Et votre mot de passe est:' +
                        ' ' +mdp
                        +
                        '\n' +
                        'Cliquez sur le lien ci-dessous pour vous connecter et modifier votre mot de passe' +
                        '\n' +
                        this.lienMessageMailBack +
                        '\n',
                    });
                    this.api.testSms(this.backObj1.tel,
                      'BONJOUR+' + this.backObj1.nom +'.+"' + this.backObj1.login + '"+EST+VOTRE+LOGIN+ET+"'+mdp+'"+EST+VOTRE+MOT+DE+PASSE.+LIEN:+\n'+this.lienMessageMailBack)
                      .subscribe((retourSms)=>{
                        console.log(retourSms)

                      })

                if (this.backObj1.login != null) {
                  this.existeUserLogin = 1;
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Succes',
                    detail: 'Utilisateur enregistré avec succes',
                  });
                  this.api.EnvoiMail(this.MailEnvoi.value).subscribe((data) => {
                    this.messageService.add({
                      severity: 'success',
                      summary: 'Succes',
                      detail:
                        'Mail de parametre de connexions envoyé avec succes',
                    });
                  });
                  this.formValueBack.reset();
                } else {
                  this.existeUserLogin = 0;
                }
                  },
                  (err) => {
                    if (err.status != 401) {
                      this.erreur = this.formbuilber.group({
                        httpStatusCode: err.status,
                        methode: 'UserServiceImpl.enregistrerUserEntity',
                        login: localStorage.getItem('authlogin'),
                        description: "Erreur de generation du mot de passe",
                        message: err.message,
                      });
                      this.apiError
                        .addErreurGenerer(this.erreur.value)
                        .subscribe((data) => {});
                    }

                    this.autoLogoutService.autoLogout(err.status, this.router);
                  })
                }



                this.getallCompteuser();
              },
              (err) => {
                if (err.status != 401) {
                  this.erreur = this.formbuilber.group({
                    httpStatusCode: err.status,
                    methode: 'UserServiceImpl.enregistrerUserEntity',
                    login: localStorage.getItem('authlogin'),
                    description: "Erreur de creation de l'utilisateur",
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
          else if(this.formValueBack.value.backhabilitation !='ROLE_USER' && respBackofficeTel.habilitation == 'ROLE_USER'){

            console.log("ok1")
            this.api.postCompteuser(this.backObj).subscribe(
              (res) => {
                if(res){
                  this.backObj1 = res;

                  this.api.decrypt(res.password).subscribe((result)=>{
                    //alert(result)
                    let mdp : string

                        mdp = result;
                        console.log(mdp);
                    this.MailEnvoi = this.formbuilber.group({
                      expediteur: this.adresseMail,
                      destinataire: this.backObj1.email,
                      objet: 'PARAMETRE DE CONNEXION EFACTURE' + ' ',
                      message:
                        'Salut Mr/Mme' +
                        ' ' +
                        this.backObj1.nom +
                        '\n' +
                        'Votre login est:' +
                        ' ' +
                        this.backObj1.login +
                        '\n' +
                        'Et votre mot de passe est:' +
                        ' ' +mdp
                        +
                        '\n' +
                        'Cliquez sur le lien ci-dessous pour vous connecter et modifier votre mot de passe' +
                        '\n' +
                        this.lienMessageMailBack +
                        '\n',
                    });
                    this.api.testSms(this.backObj1.tel,
                      'BONJOUR+' + this.backObj1.nom +'.+"' + this.backObj1.login + '"+EST+VOTRE+LOGIN+ET+"'+mdp+'"+EST+VOTRE+MOT+DE+PASSE.+LIEN:+\n'+this.lienMessageMailBack)
                      .subscribe((retourSms)=>{
                        console.log(retourSms)

                      })

                if (this.backObj1.login != null) {
                  this.existeUserLogin = 1;
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Succes',
                    detail: 'Utilisateur enregistré avec succes',
                  });
                  this.api.EnvoiMail(this.MailEnvoi.value).subscribe((data) => {
                    this.messageService.add({
                      severity: 'success',
                      summary: 'Succes',
                      detail:
                        'Mail de parametre de connexions envoyé avec succes',
                    });
                  });
                  this.formValueBack.reset();
                } else {
                  this.existeUserLogin = 0;
                }
                  },
                  (err) => {
                    if (err.status != 401) {
                      this.erreur = this.formbuilber.group({
                        httpStatusCode: err.status,
                        methode: 'UserServiceImpl.enregistrerUserEntity',
                        login: localStorage.getItem('authlogin'),
                        description: "Erreur de generation du mot de passe",
                        message: err.message,
                      });
                      this.apiError
                        .addErreurGenerer(this.erreur.value)
                        .subscribe((data) => {});
                    }

                    this.autoLogoutService.autoLogout(err.status, this.router);
                  })
                }



                this.getallCompteuser();
              },
              (err) => {
                if (err.status != 401) {
                  this.erreur = this.formbuilber.group({
                    httpStatusCode: err.status,
                    methode: 'UserServiceImpl.enregistrerUserEntity',
                    login: localStorage.getItem('authlogin'),
                    description: "Erreur de creation de l'utilisateur",
                    message: err.message,
                  });
                  this.apiError
                    .addErreurGenerer(this.erreur.value)
                    .subscribe((data) => {});
                }

                this.autoLogoutService.autoLogout(err.status, this.router);
              }
            );



          }else if(this.formValueBack.value.backhabilitation !='ROLE_USER' && respBackofficeTel.habilitation != 'ROLE_USER'){
            this.telExisteAjouterUserBackOffice != 0;
            this.emailExisteAjouterUserBackOffice = 1;
          }

        } else {


          this.api.postCompteuser(this.backObj).subscribe(
            (res) => {
              if(res){
                this.backObj1 = res;

                this.api.decrypt(res.password).subscribe((result)=>{
                  //alert(result)
                  let mdp : string

                      mdp = result;
                      console.log(mdp);
                  this.MailEnvoi = this.formbuilber.group({
                    expediteur: this.adresseMail,
                    destinataire: this.backObj1.email,
                    objet: 'PARAMETRE DE CONNEXION EFACTURE' + ' ',
                    message:
                      'Salut Mr/Mme' +
                      ' ' +
                      this.backObj1.nom +
                      '\n' +
                      'Votre login est:' +
                      ' ' +
                      this.backObj1.login +
                      '\n' +
                      'Et votre mot de passe est:' +
                      ' ' +mdp
                      +
                      '\n' +
                      'Cliquez sur le lien ci-dessous pour vous connecter et modifier votre mot de passe' +
                      '\n' +
                      this.lienMessageMailBack +
                      '\n',
                  });
                  this.api.testSms(this.backObj1.tel,
                    'BONJOUR+' + this.backObj1.nom +'.+"' + this.backObj1.login + '"+EST+VOTRE+LOGIN+ET+"'+mdp+'"+EST+VOTRE+MOT+DE+PASSE.+LIEN:+\n'+this.lienMessageMailBack)
                    .subscribe((retourSms)=>{
                      console.log(retourSms)

                    })

              if (this.backObj1.login != null) {
                this.existeUserLogin = 1;
                this.messageService.add({
                  severity: 'success',
                  summary: 'Succes',
                  detail: 'Utilisateur enregistré avec succes',
                });
                this.api.EnvoiMail(this.MailEnvoi.value).subscribe((data) => {
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Succes',
                    detail:
                      'Mail de parametre de connexions envoyé avec succes',
                  });
                });
                this.formValueBack.reset();
              } else {
                this.existeUserLogin = 0;
              }
                },
                (err) => {
                  if (err.status != 401) {
                    this.erreur = this.formbuilber.group({
                      httpStatusCode: err.status,
                      methode: 'UserServiceImpl.enregistrerUserEntity',
                      login: localStorage.getItem('authlogin'),
                      description: "Erreur de generation du mot de passe",
                      message: err.message,
                    });
                    this.apiError
                      .addErreurGenerer(this.erreur.value)
                      .subscribe((data) => {});
                  }

                  this.autoLogoutService.autoLogout(err.status, this.router);
                })
              }



              this.getallCompteuser();
            },
            (err) => {
              if (err.status != 401) {
                this.erreur = this.formbuilber.group({
                  httpStatusCode: err.status,
                  methode: 'UserServiceImpl.enregistrerUserEntity',
                  login: localStorage.getItem('authlogin'),
                  description: "Erreur de creation de l'utilisateur",
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
  onModifBackoffice(row: User) {
    this.showAddBackOffice = 0;
    console.log('okkkkkkkkkkkktest1');
    console.log(row);
    console.log(this.formValueBack);
    console.log('okkkkkkkkkkkktest2');

    this.backObj1.login = row.login;
    this.backObj1 = row;
    this.formValueBack.controls['backlogin'].setValue(row.login);
    this.formValueBack.controls['backhabilitation'].setValue(row.habilitation);
    this.formValueBack.controls['backnom'].setValue(row.nom);
    this.formValueBack.controls['backprenom'].setValue(row.prenom);
    this.formValueBack.controls['backtel'].setValue(row.tel);
    this.formValueBack.controls['backemail'].setValue(row.email);
    this.formValueBack.controls['backadCm'].setValue(row.adCm);
    this.formValueBack.controls['backstatut'].setValue(row.status);
    if (row.agence== null) {
      this.formValueBack.controls['backagence'].setValue(row.agence);
    }else {
      this.formValueBack.controls['backagence'].setValue(row.agence.id);
    }


    console.log(this.backObj1.habilitation + 'mo');
    if (
      this.habili == this.valeurHabili &&
      this.backObj1.habilitation == this.habili
    ) {
      this.test = false;
      console.log('test1okkkkkkkkkkkktest1');
    }
    if (
      this.habili == this.valeurHabili &&
      this.backObj1.habilitation !== this.habili
    ) {
      this.test = true;
      console.log('test5okkkkkkkkkkkktest5');
    }

    //this.initFormBack();
    console.log(JSON.stringify(this.backObj1) + 'okkkkkkkkkkkk');
    this.isDisable = false;
    this.disableModif = 1;
    this.stat = row.validation;


    if(this.backObj1.agence == null){
      this.api.AgenceId(0).subscribe((libAgence)=>{
        this.agenceActuelle = libAgence.libelle
      })
    }
    else{
      this.api.AgenceId(this.backObj1.agence.id).subscribe((libAgence)=>{
        this.agenceActuelle = libAgence.libelle
      })
    }

    // this.api.AgenceId(this.backObj1.agence.id).subscribe((libAgence)=>{
    //   this.agenceActuelle = libAgence.libelle
    // })

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

  /********************************************************************************************************************************
  ********************************************* MODIFICATION BACKOFFICE **********************************************************
  ********************************************************************************************************************************/


  updateCompteBackdetails() {
    this.backObj1.nom = this.formValueBack.value.backnom;
    this.backObj1.prenom = this.formValueBack.value.backprenom;
    this.backObj1.adCm = this.formValueBack.value.backadCm;
    this.backObj1.login = this.formValueBack.value.backlogin;
    this.backObj1.habilitation = this.formValueBack.value.backhabilitation;
    this.backObj1.tel = this.formValueBack.value.backtel;
    this.backObj1.email = this.formValueBack.value.backemail;

    this.backObj1.status = this.formValueBack.value.backstatut;
    this.backObj1.reinitialiser = this.formValueBack.value.backreinitialiser;
    this.backObj1.loginMaj = this.loginConnect;
    this.backObj1.agence = this.formValueBack.value.backagence;
    this.backObj1.filiale = this.formValueBack.value.backfiliale;

    if( this.backObj1.reinitialiser == true){
          let generatePwd : string;
          this.api.generatePwd().subscribe((mdp)=>{
            generatePwd = mdp
            this.backObj1.agence = this.formValueBack.value.backagence;
            this.backObj1.password = generatePwd;
          });

      this.api.getUserByMail(this.backObj1.email).subscribe((resp) => {
      console.log("ok6")
      console.log(resp);
      console.log("ok6")
        this.api
          .getUserByTel(this.backObj1.tel)
          .subscribe((respUpdateMarchandTel) => {
            if (
              resp != null &&
              resp.login != this.backObj1.login &&
              resp.email == this.backObj1.email
            ) {
              this.emailExisteModificationUser = 0;
              this.telExisteModificationUser = 1;
            } else if (
              respUpdateMarchandTel != null &&
              respUpdateMarchandTel.login != this.backObj1.login &&
              respUpdateMarchandTel.tel == this.backObj1.tel
            ) {
              this.telExisteModificationUser = 0;
              this.emailExisteModificationUser = 1;
            } else {
              this.emailExisteModificationUser = 1;
              this.telExisteModificationUser = 1;
              console.log(JSON.stringify(this.backObj1) + 'CO');
             // alert('OKOK')
              this.api.updateCompteuser(this.backObj1).subscribe(
                (res) => {
                  let mdp : string;
                  if(res.login != null){
                    this.api.decriptPwd(res.login).subscribe((pwd : string)=>{
                      console.log(pwd);
                      mdp = pwd;
                      this.MailEnvoi = this.formbuilber.group({
                        // expediteur: this.adresseMail,
                        destinataire: this.mailRe,
                        objet: 'PARAMETRE DE CONNEXION EFACTURE' + ' ',
                        message:
                          'Salut' +
                          ' ' +
                          res.nom +
                          '\n' +
                          'Votre login est:' +
                          ' ' +
                          res.login+
                          '\n' +
                          'Et votre mot de passe est:' +
                          ' ' + mdp
                           +
                          '\n' +
                          'Cliquez sur le lien ci-dessous pour vous connecter et modifier votre mot de passe' +
                          '\n' +
                          this.lienMessageMailBack +
                          '\n',
                      });
                      this.api.testSms(res.tel,
                        'BONJOUR+' + res.nom +'.+\n+"' + res.login + '"+EST+VOTRE+LOGIN+ET+"'+mdp+'"+EST+VOTRE+MOT+DE+PASSE.+LIEN:+\n'+this.lienMessageMailBack+'/#/connection')
                        .subscribe((retourSms)=>{
                          console.log(retourSms)
                        })
                      console.log(JSON.stringify(this.MailEnvoi.value));
                      this.api
                        .EnvoiMail(this.MailEnvoi.value)
                        .subscribe((data) => {
                          console.log(data);
                          if(data){
                            this.messageService.add({
                              severity: 'success',
                              summary: 'Succes',
                              detail:
                                'Mail de parametre de connexion envoyé avec succès',
                            });
                          }

                        },(err)=>{
                          console.log(err)
                          if (err.status != 401) {
                            this.erreur = this.formbuilber.group({
                              httpStatusCode: err.status,
                              methode: 'Reinitialisation mot de passe',
                              login: localStorage.getItem('authlogin'),
                              description: 'Erreur lors de l\envoi des paramètres de connexion',
                              message: err.message,
                            });

                            this.apiError
                              .addErreurGenerer(this.erreur.value)
                              .subscribe((data) => {});
                          }

                         this.autoLogoutService.autoLogout(err.status, this.router);
                        });
                    });
                  }
                  console.log(JSON.stringify(res)+ 'NEW MP');
                  //alert('OK')
                  this.comptemarchandObj.statut = res.status;
                  this.mailRe = res.email;
                  this.loginRe = res.login;
                  console.log(JSON.stringify(res) + 'MES INFOS')
                  this.apiMachand.detailById(res.login).subscribe((data) => {
                    data.statut = res.status;

                    this.apiMachand
                      .updateComptemarchand(data)
                      .subscribe((datas) => {});
                  });
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Succes',
                    detail: 'Utilisateur modifié avec succes',
                  });
                  let ref = document.getElementById('cancel1');
                  ref?.click();
                  this.formValueBack.reset();
                  this.getallCompteuser();
                },
                (err) => {
                  if (err.status != 401) {
                    this.erreur = this.formbuilber.group({
                      httpStatusCode: err.status,
                      methode: 'UserServiceImpl.modifierUserEntity',
                      login: localStorage.getItem('authlogin'),
                      description: 'Erreur de consultation des utilisateurs',
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
    ///fin envoie de mail
    else{
      this.api.getUserByMail(this.backObj1.email).subscribe((resp) => {
        this.api
          .getUserByTel(this.backObj1.tel)
          .subscribe((respUpdateMarchandTel) => {
            if (
              resp != null &&
              resp.login != this.backObj1.login &&
              resp.email == this.backObj1.email
            ) {
              this.emailExisteModificationUser = 0;
              this.telExisteModificationUser = 1;
            } else if (
              respUpdateMarchandTel != null &&
              respUpdateMarchandTel.login != this.backObj1.login &&
              respUpdateMarchandTel.tel == this.backObj1.tel
            ) {
              this.telExisteModificationUser = 0;
              this.emailExisteModificationUser = 1;
            } else {
              this.emailExisteModificationUser = 1;
              this.telExisteModificationUser = 1;
              console.log(JSON.stringify(this.backObj1) + 'CO');
             // alert('OKOK')
              this.api.updateCompteuser(this.backObj1).subscribe(
                (res) => {
                  let mdp : string;
                  if(res.login != null){
                    this.comptemarchandObj.statut = res.status;
                    this.mailRe = res.email;
                    this.loginRe = res.login;
                    console.log(JSON.stringify(res) + 'MES INFOS')
                    this.monUser = this.compteuserData;
                    let index =  this.monUser.find(u=>u.login === this.backObj1.login );
                    console.log("KONE YACOUBA : "+JSON.stringify(index));

                    this.messageService.add({
                      severity: 'success',
                      summary: 'Succes',
                      detail: 'Utilisateur modifié avec succes',
                    });

                   /*  this.apiMachand.detailById(res.login).subscribe((data) => {
                      data.statut = res.status;

                      //this.compteuserData =

                       this.apiMachand
                        .updateComptemarchand(data)
                        .subscribe((datas) => {
                          if(datas){
                            this.messageService.add({
                              severity: 'success',
                              summary: 'Succes',
                              detail: 'Utilisateur modifié avec succes',
                            });
                          }
                          else{
                            this.messageService.add({
                              severity: 'error',
                              summary: 'Echec',
                              detail: 'Utilisateur non modifié',
                            });
                          }
                        },(err) => {
                          if (err.status != 401) {
                            this.erreur = this.formbuilber.group({
                              httpStatusCode: err.status,
                              methode: 'UserServiceImpl.modifierUserEntity',
                              login: localStorage.getItem('authlogin'),
                              description: 'Erreur de la modification du compte marchand',
                              message: err.message,
                            });

                            this.apiError
                              .addErreurGenerer(this.erreur.value)
                              .subscribe((data) => {});
                          }

                          this.autoLogoutService.autoLogout(err.status, this.router);
                        });
                    }); */
                  }
                  else {
                    this.messageService.add({
                      severity: 'info',
                      summary: 'Information',
                      detail: 'Utilisateur existant !',
                    });
                  }
                  let ref = document.getElementById('cancel1');
                  ref?.click();
                  this.formValueBack.reset();

                 // this.getallCompteuser();
                },
                (err) => {
                  if (err.status != 401) {
                    this.erreur = this.formbuilber.group({
                      httpStatusCode: err.status,
                      methode: 'UserServiceImpl.modifierUserEntity',
                      login: localStorage.getItem('authlogin'),
                      description: 'Erreur de la modification de utilisateurs',
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

  }






  ///fin modification


  updateCompteBackdetails1() {
    this.backObj1.nom = this.formValueBack.value.backnom;
    this.backObj1.prenom = this.formValueBack.value.backprenom;
    this.backObj1.adCm = this.formValueBack.value.backadCm;
    this.backObj1.login = this.formValueBack.value.backlogin;
    this.backObj1.habilitation = this.formValueBack.value.backhabilitation;
    this.backObj1.tel = this.formValueBack.value.backtel;
    this.backObj1.email = this.formValueBack.value.backemail;

    this.backObj1.status = this.formValueBack.value.backstatut;
    this.backObj1.reinitialiser = this.formValueBack.value.backreinitialiser;
    this.backObj1.loginMaj = this.loginConnect;
    this.backObj1.agence = this.formValueBack.value.backagence;
    this.backObj1.filiale = this.formValueBack.value.backfiliale;

    if( this.backObj1.reinitialiser == true){
      let generatePwd : string;
      this.api.generatePwd().subscribe((mdp)=>{
        generatePwd = mdp
    this.backObj1.agence = this.formValueBack.value.backagence;
        this.backObj1.password = generatePwd;
      })

      this.api.getUserByMail(this.backObj1.email).subscribe((resp) => {
      console.log("ok6")
      console.log(resp);
      console.log("ok6")
        this.api
          .getUserByTel(this.backObj1.tel)
          .subscribe((respUpdateMarchandTel) => {
            if (
              resp != null &&
              resp.login != this.backObj1.login &&
              resp.email == this.backObj1.email
            ) {
              this.emailExisteModificationUser = 0;
              this.telExisteModificationUser = 1;
            } else if (
              respUpdateMarchandTel != null &&
              respUpdateMarchandTel.login != this.backObj1.login &&
              respUpdateMarchandTel.tel == this.backObj1.tel
            ) {
              this.telExisteModificationUser = 0;
              this.emailExisteModificationUser = 1;
            } else {
              this.emailExisteModificationUser = 1;
              this.telExisteModificationUser = 1;
              console.log(JSON.stringify(this.backObj1) + 'CO');
             // alert('OKOK')
              this.api.updateCompteuser(this.backObj1).subscribe(
                (res) => {
                  let mdp : string;
                  if(res.login != null){
                    this.api.decriptPwd(res.login).subscribe((pwd : string)=>{
                      console.log(pwd);
                      mdp = pwd;
                      this.MailEnvoi = this.formbuilber.group({
                        // expediteur: this.adresseMail,
                        destinataire: this.mailRe,
                        objet: 'PARAMETRE DE CONNEXION EFACTURE' + ' ',
                        message:
                          'Salut' +
                          ' ' +
                          res.nom +
                          '\n' +
                          'Votre login est:' +
                          ' ' +
                          res.login+
                          '\n' +
                          'Et votre mot de passe est:' +
                          ' ' + mdp
                           +
                          '\n' +
                          'Cliquez sur le lien ci-dessous pour vous connecter et modifier votre mot de passe' +
                          '\n' +
                          this.lienMessageMailBack +
                          '\n',
                      });
                      this.api.testSms(res.tel,
                        'BONJOUR+' + res.nom +'.+\n+"' + res.login + '"+EST+VOTRE+LOGIN+ET+"'+mdp+'"+EST+VOTRE+MOT+DE+PASSE.+LIEN:+\n'+this.lienMessageMailBack+'/#/connection')
                        .subscribe((retourSms)=>{
                          console.log(retourSms)
                        })
                      console.log(JSON.stringify(this.MailEnvoi.value));
                      this.api
                        .EnvoiMail(this.MailEnvoi.value)
                        .subscribe((data) => {
                          console.log(data);
                          if(data){
                            this.messageService.add({
                              severity: 'success',
                              summary: 'Succes',
                              detail:
                                'Mail de parametre de connexion envoyé avec succès',
                            });
                          }

                        },(err)=>{
                          console.log(err)
                          if (err.status != 401) {
                            this.erreur = this.formbuilber.group({
                              httpStatusCode: err.status,
                              methode: 'Reinitialisation mot de passe',
                              login: localStorage.getItem('authlogin'),
                              description: 'Erreur lors de l\envoi des paramètres de connexion',
                              message: err.message,
                            });

                            this.apiError
                              .addErreurGenerer(this.erreur.value)
                              .subscribe((data) => {});
                          }

                         this.autoLogoutService.autoLogout(err.status, this.router);
                        });
                    });
                  }
                  console.log(JSON.stringify(res)+ 'NEW MP');
                  //alert('OK')
                  this.comptemarchandObj.statut = res.status;
                  this.mailRe = res.email;
                  this.loginRe = res.login;
                  console.log(JSON.stringify(res) + 'MES INFOS')
                  this.apiMachand.detailById(res.login).subscribe((data) => {
                    data.statut = res.status;

                    this.apiMachand
                      .updateComptemarchand(data)
                      .subscribe((datas) => {});
                  });
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Succes',
                    detail: 'Utilisateur modifié avec succes',
                  });
                  let ref = document.getElementById('cancel1');
                  ref?.click();
                  this.formValueBack.reset();
                  this.getallCompteuser();
                },
                (err) => {
                  if (err.status != 401) {
                    this.erreur = this.formbuilber.group({
                      httpStatusCode: err.status,
                      methode: 'UserServiceImpl.modifierUserEntity',
                      login: localStorage.getItem('authlogin'),
                      description: 'Erreur de consultation des utilisateurs',
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
    else{
      this.api.getUserByMail(this.backObj1.email).subscribe((resp) => {
        this.api
          .getUserByTel(this.backObj1.tel)
          .subscribe((respUpdateMarchandTel) => {
            if (
              resp != null &&
              resp.login != this.backObj1.login &&
              resp.email == this.backObj1.email
            ) {
              this.emailExisteModificationUser = 0;
              this.telExisteModificationUser = 1;
            } else if (
              respUpdateMarchandTel != null &&
              respUpdateMarchandTel.login != this.backObj1.login &&
              respUpdateMarchandTel.tel == this.backObj1.tel
            ) {
              this.telExisteModificationUser = 0;
              this.emailExisteModificationUser = 1;
            } else {
              this.emailExisteModificationUser = 1;
              this.telExisteModificationUser = 1;
              console.log(JSON.stringify(this.backObj1) + 'CO');
             // alert('OKOK')
              this.api.updateCompteuser(this.backObj1).subscribe(
                (res) => {
                  let mdp : string;
                  if(res.login != null){
                    this.comptemarchandObj.statut = res.status;
                    this.mailRe = res.email;
                    this.loginRe = res.login;
                    console.log(JSON.stringify(res) + 'MES INFOS')
                    this.apiMachand.detailById(res.login).subscribe((data) => {
                      data.statut = res.status;

                      this.apiMachand
                        .updateComptemarchand(data)
                        .subscribe((datas) => {
                          if(datas){
                            this.messageService.add({
                              severity: 'success',
                              summary: 'Succes',
                              detail: 'Utilisateur modifié avec succes',
                            });
                          }
                          else{
                            this.messageService.add({
                              severity: 'error',
                              summary: 'Echec',
                              detail: 'Utilisateur non modifié',
                            });
                          }
                        },(err) => {
                          if (err.status != 401) {
                            this.erreur = this.formbuilber.group({
                              httpStatusCode: err.status,
                              methode: 'UserServiceImpl.modifierUserEntity',
                              login: localStorage.getItem('authlogin'),
                              description: 'Erreur de la modification du compte marchand',
                              message: err.message,
                            });

                            this.apiError
                              .addErreurGenerer(this.erreur.value)
                              .subscribe((data) => {});
                          }

                          this.autoLogoutService.autoLogout(err.status, this.router);
                        });
                    });
                  }
                  else {
                    this.messageService.add({
                      severity: 'info',
                      summary: 'Information',
                      detail: 'Utilisateur existant !',
                    });
                  }
                  let ref = document.getElementById('cancel1');
                  ref?.click();
                  this.formValueBack.reset();

                  this.getallCompteuser();
                },
                (err) => {
                  if (err.status != 401) {
                    this.erreur = this.formbuilber.group({
                      httpStatusCode: err.status,
                      methode: 'UserServiceImpl.modifierUserEntity',
                      login: localStorage.getItem('authlogin'),
                      description: 'Erreur de la modification de utilisateurs',
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

  }

  updateBackOffice() {
    this.backObj1.nom = this.formValueBack.value.backnom;
    this.backObj1.prenom = this.formValueBack.value.backprenom;
    this.backObj1.adCm = this.formValueBack.value.backadCm;
    this.backObj1.login = this.formValueBack.value.backlogin;
    this.backObj1.habilitation = this.formValueBack.value.backhabilitation;
    this.backObj1.tel = this.formValueBack.value.backtel;
    this.backObj1.email = this.formValueBack.value.backemail;

    this.backObj1.status = this.formValueBack.value.backstatut;
    this.backObj1.reinitialiser = this.formValueBack.value.backreinitialiser;
    this.backObj1.loginMaj = this.loginConnect;
    this.backObj1.agence = this.formValueBack.value.backagence;
    this.backObj1.filiale = this.formValueBack.value.backfiliale;

    this.api.getUserByMail(this.backObj1.email).subscribe((resp) => {
      this.api
        .getUserByTel(this.backObj1.tel)
        .subscribe((respUpdateBackTel) => {
          if (
            resp != null &&
            resp.login != this.backObj1.login &&
            resp.email == this.backObj1.email
          ) {
            this.telExisteModificationUserBackoffice = 1;
            this.emailExisteModificationUserBackoffice = 0;
          } else if (
            respUpdateBackTel != null &&
            respUpdateBackTel.login != this.backObj1.login &&
            respUpdateBackTel.tel == this.backObj1.tel
          ) {
            this.telExisteModificationUserBackoffice = 0;
            this.emailExisteModificationUserBackoffice = 1;
          } else {
            this.emailExisteModificationUserBackoffice = 1;
            this.telExisteModificationUserBackoffice = 1;
            this.api.updateCompteuser(this.backObj1).subscribe(
              (res) => {
                this.apiMachand.detailById(res.login).subscribe((resp) => {
                  this.comptemarchandObj = resp;
                  this.comptemarchandObj.statut = res.status;

                  this.apiMachand
                    .updateComptemarchand(this.comptemarchandObj)
                    .subscribe((data) => {});
                });

                this.messageService.add({
                  severity: 'success',
                  summary: 'Succes',
                  detail: 'Utilisateur modifié avec succes',
                });

                //let ref = document.getElementById('cancel1');
               // ref?.click();
                if (res.reinitialiser == true) {
                  this.api.updateCompteuser(res).subscribe((data) => {
                    console.log(data + 'MODIFICATION');
                    //alert(JSON.stringify(data))
                    this.MailEnvoi = this.formbuilber.group({
                      expediteur: this.adresseMail,
                      destinataire: data.email,
                      objet: 'PARAMETRE DE CONNEXION EFACTURE' + ' ',
                      message:
                        'Salut Mr/Mme' +
                        ' ' +
                        data.nom +
                        '\n' +
                        'Votre login est:' +
                        ' ' +
                        data.login +
                        '\n' +
                        'Et votre mot de passe est:' +
                        ' ' +
                        data.password +
                        '\n' +
                        'Cliquez sur le lien ci-dessous pour vous connecter et modifier votre mot de passe' +
                        '\n' +
                        this.lienMessageMailBack +
                        '\n',
                    });
                   this.api.smsSend(data.tel,
                    'PARAMETRE+DE+CONNEXION+EFACTURE').subscribe((smsReturn)=>{
                         // alert(smsReturn)
                          if(smsReturn){
                            this.messageService.add({
                              severity: 'success',
                              summary: 'Succes',
                              detail:
                                'Parametres de connexions envoyé avec succes',
                            });
                          }
                        }, (err) => {
                          if (err.status != 401) {
                            this.erreur = this.formbuilber.group({
                              httpStatusCode: err.status,
                              methode: 'UserServiceImpl.modifierUserEntity',
                              login: localStorage.getItem('authlogin'),
                              description: 'Erreur lors de l\'envoi du SMS',
                              message: err.message,
                            });

                            this.apiError
                              .addErreurGenerer(this.erreur.value)
                              .subscribe((data) => {});
                          }

                        });

                    if (data.login != null) {
                      this.api
                        .EnvoiMail(this.MailEnvoi.value)
                        .subscribe((data) => {
                          this.messageService.add({
                            severity: 'success',
                            summary: 'Succes',
                            detail:
                              'Parametres de connexions envoyé avec succes',
                          });
                          //this.formValue.reset();
                        });
                    } else {
                      this.messageService.add({
                        severity: 'info',
                        summary: 'Information',
                        detail: 'Utilisateur existant !',
                      });
                    }
                  });
                }

                //this.formValueBack.reset();
                //this.getallCompteuser();
              },
              (err) => {
                if (err.status != 401) {
                  this.erreur = this.formbuilber.group({
                    httpStatusCode: err.status,
                    methode: 'UserServiceImpl.modifierUserEntity',
                    login: localStorage.getItem('authlogin'),
                    description: 'Erreur de consultation des utilisateurs',
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
  onEditBackoffice(row: any) {
    console.log("row999999999999999999999999999999999999999")
    console.log(row);
    console.log("row999999999999999999999999999999999999999")
    this.backObj1.id = row.id;
    this.backObj1 = row;
    //this.initFormBack();
    this.isDisable = true;
    this.disableModif = 3;
    this.showAddBackOffice = 3;
    this.test = false;
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
  onCancel() {
    location.href;
  }

  sms(){
    this.api.smsSend('2250171398804',
      'PARAMETRE+DE+CONNEXION+EFACTURE').subscribe((smsReturn)=>{
            //alert(smsReturn)
            if(smsReturn){
              this.messageService.add({
                severity: 'success',
                summary: 'Succes',
                detail:
                  'Parametres de connexions envoyé avec succes',
              });
            }
          }, (err) => {
            if (err.status != 401) {
              this.erreur = this.formbuilber.group({
                httpStatusCode: err.status,
                methode: 'UserServiceImpl.modifierUserEntity',
                login: localStorage.getItem('authlogin'),
                description: 'Erreur lors de l\'envoi du SMS',
                message: err.message,
              });

              this.apiError
                .addErreurGenerer(this.erreur.value)
                .subscribe((data) => {});
            }

          });
  }


}
