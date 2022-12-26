import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  ConfirmationService,
  Message,
  MessageService,
  PrimeNGConfig,
} from 'primeng/api';
import { expirationModel } from 'src/app/model/exp.model';
import { User } from 'src/app/model/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { CreationcompteService } from 'src/app/services/creationcompte.service';
import { ErreurGenererService } from 'src/app/services/erreur-generer.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-authentification',
  templateUrl: './authentification.component.html',
  styleUrls: ['./authentification.component.scss'],
  providers: [ConfirmationService, MessageService],
})
export class AuthentificationComponent implements OnInit {
  erreurs!: FormGroup;
  blockUser!: boolean;
  adresseMail: any;
  invalidLogin = false;
  cptBloque: boolean = false;
  falseLogin!: boolean;
  formValue!: FormGroup;
  formPwdForGot!: FormGroup;
  blockLogin!: any;
  user = new User();
  erreur = 0;
  erreurAuth!: number;
  msgs: Message[] = [];
  position!: string;
  dated: any;
  datef: any;
  nbj: any;
  mdpDate: any;
  myDate = new Date(Date.now());
  expiration: any;
  displayMaximizable!: boolean;
  erreurPrestataire!: boolean;
  MailEnvoi!: FormGroup;
  mailExist!: number;
  passRequirement = {
    passwordMinLowerCase: 1,
    passwordMinNumber: 1,
    passwordMinSymbol: 1,
    passwordMinUpperCase: 1,
    passwordMinCharacters: 8,
  };
  pattern = [
    `(?=([^a-z]*[a-z])\{${this.passRequirement.passwordMinLowerCase},\})`,
    `(?=([^A-Z]*[A-Z])\{${this.passRequirement.passwordMinUpperCase},\})`,
    `(?=([^0-9]*[0-9])\{${this.passRequirement.passwordMinNumber},\})`,
    `(?=(\.\*[\$\@\$\!\%\*\?\&])\{${this.passRequirement.passwordMinSymbol},\})`,
    `[A-Za-z\\d\$\@\$\!\%\*\?\&\.]{${this.passRequirement.passwordMinCharacters},}`,
  ]
    .map((item) => item.toString())
    .join('');
  noagence!: number;
  constructor(
    private datePipe: DatePipe,
    private messageService: MessageService,
    private api: CreationcompteService,
    private authService: AuthService,
    private formbuilber: FormBuilder,
    private router: Router,
    private confirmationService: ConfirmationService,
    private primengConfig: PrimeNGConfig,
    private creationcompteService: CreationcompteService,
    private httpClient: HttpClient,
    private apiError: ErreurGenererService,

  ) {}

  ngOnInit(): void {
    this.formValue = this.formbuilber.group({
      login: [''],
      password1: ['', [Validators.pattern(this.pattern)]],
    });
    this.formPwdForGot = this.formbuilber.group({
      email: [''],
    });
    this.primengConfig.ripple = true;
    this.expirationDate();
  }

  expirationDate() {
    this.httpClient
      .get(environment.urlFinal + '/efacture/pwdParam/allParam')
      .subscribe((res: any) => {
        this.expiration = res[0].nbJours;
        this.adresseMail = res[0].mailEfacture;
        //console.log(res);
      });
  }

  onLoggedin() {
    localStorage.setItem('tentativeLogin', this.formValue.value.login);
    //console.log('okverification');
    //console.log(localStorage.getItem('tentativeLogin'));
    //console.log('okverification');
    this.authService
      .authentification(
        this.formValue.value.login,
        this.formValue.value.password1
      )
      .subscribe(
        (res) => {
          //console.log(this.formValue.value.login + this.formValue.value.password1);
          //console.log(res);
          localStorage.setItem('dwp', res.password);
          this.mdpDate = res.dateMdp;
          //console.log(this.mdpDate);

          var i = new Date(Date.now());
          var p: any = this.datePipe.transform(i, 'yyyy-MM-dd');

          this.dated = new Date(this.mdpDate).getTime();
          this.datef = new Date(p).getTime();
          this.nbj = (this.datef - this.dated) / 86400000;

          //console.log(this.nbj + 'vrai  ' + typeof this.nbj);
          localStorage.setItem('confirmation', this.formValue.value.password1);

          if (this.nbj >= this.expiration) {
            Swal.fire({
              title: 'Mots de passe expiré !',
              text: "Veuillez le mofifier s'il vous plaît...",
              icon: 'warning',
              showCancelButton: false,
              confirmButtonColor: '#00A300',
              cancelButtonColor: '#d33',
              confirmButtonText: 'OK',
            });
            this.router.navigate(['reinitialiser']);
          } else {
            if (res !== null) {
              this.erreurAuth = 3;

              if (
                res !== null &&
                res.status == 1 &&
                res.validation == 1 &&
                res.bloquser == 0
              ) {
                this.erreurAuth = 3;
                if (res.habilitation == 'ROLE_PRESTATAIRE'||
                    res.habilitation == 'ROLE_APPLICATION'
                ) {
                  this.erreurPrestataire = true;
                  this.router.navigate(['/authentication']);
                } else if (
                  res.habilitation != 'ROLE_USER_PERSO' &&
                  res.habilitation != 'ROLE_USER_COM'
                ) {
                  localStorage.setItem(
                    'mdpConnect',
                    this.formValue.value.password1
                  );
                  localStorage.setItem('authisAuth1', JSON.stringify(res));
                  //console.log('testok6')
                  //console.log(localStorage.getItem('authisAuth1'));
                  //console.log('testok6')
                  localStorage.setItem(
                    'authbloquser',
                    JSON.stringify(res.bloquser)
                  );
                  localStorage.setItem(
                    'authclient',
                    JSON.stringify(res.client)
                  );
                  localStorage.setItem(
                    'authdateCreation',
                    JSON.stringify(res.dateCreation)
                  );
                  localStorage.setItem('authemail', res.email);
                  localStorage.setItem(
                    'authhabilitation',
                    JSON.stringify(res.habilitation)
                  );
                  localStorage.setItem('authlogin', res.login);
                  //console.log('testok3')
                  //console.log(localStorage.getItem('authlogin'));
                  //console.log('testok3')
                  //console.log('testok4')
                  //console.log(localStorage.getItem('authlogin'));
                  //console.log('testok4')
                  if(res.agence != null){
                    localStorage.setItem('authagence', JSON.stringify(res.agence.id))
                  }

                  else{
                    this.noagence = 1;
                    this.router.navigate(['/authentication']);
                  }
                  localStorage.setItem('authnom', res.nom);
                  localStorage.setItem('authpassword', res.password);
                  localStorage.setItem('authpassword1', res.password1);
                  localStorage.setItem('authpassword2', res.password2);
                  localStorage.setItem('authprenom', res.prenom);
                  localStorage.setItem(
                    'authstatus',
                    JSON.stringify(res.status)
                  );
                  localStorage.setItem('authtel', JSON.stringify(res.tel));
                  localStorage.setItem(
                    'authtypePlanfond',
                    JSON.stringify(res.typePlafond)
                  );
                  localStorage.setItem(
                    'authvalidation',
                    JSON.stringify(res.validation)
                  );
                  //console.log('testok1')
                  //console.log(localStorage.getItem('authlogin'));
                  //console.log('testok1')
                  let body = { tentative: 0 };
                  this.httpClient
                    .put(
                      environment.urlFinal +
                        '/efacture/tentativeConnect/' +
                        localStorage.getItem('authlogin'),
                      body
                    )
                    .subscribe((res: any) => {
                      //console.log(JSON.stringify(res) + 'NEW');
                    });
                    //console.log('testok2')
                    //console.log(localStorage.getItem('authlogin'));
                    //console.log('testok2')
                  let body2 = { bloquser: 0 };
                  this.httpClient
                    .put(
                      environment.urlFinal +
                        '/efacture/bloqueUser/' +
                        localStorage.getItem('authlogin'),
                      body2
                    )
                    .subscribe((res: any) => {
                      //console.log(JSON.stringify(res) + 'NEW2');
                    });
                  this.router.navigate(['app/accueil']);
                  this.blockLogin = localStorage.getItem('authlogin');
                  this.authService.ValeurStorage(this.blockLogin);
                  this.invalidLogin = false;
                } else {
                  this.falseLogin = false;
                  this.blockUser = true;
                  this.erreurAuth = 2;
                  this.router.navigate(['/authentication']);
                }
              } else {
                this.falseLogin = false;
                this.blockUser = true;
                this.erreurAuth = 2;
                this.router.navigate(['/authentication']);
              }
            } else {
              this.erreurAuth = 1;
              this.router.navigate(['/authentication']);
            }
          }
          //console.log('testok')
          //console.log(localStorage.getItem('authlogin'));
          //console.log('testok')
        },
        (err) => {
          //console.log(err.status)
          if (err.status = 500) {
            this.erreurs = this.formbuilber.group({
              httpStatusCode: err.status,
              methode: 'UserServiceImpl.authentification',
              login: this.formValue.value.login,
              description: 'Erreur lors de l\'authentification, identifiants incorrects',
              message: err.message,
            });

            this.apiError
              .addErreurGenerer(this.erreurs.value)
              .subscribe((data) => {});
          }
          else{
            this.erreurAuth = 99;
            this.erreurs = this.formbuilber.group({
              httpStatusCode: err.status,
              methode: 'UserServiceImpl.authentification',
              login: this.formValue.value.login,
              description: 'Serveur injoignable',
              message: err.message,
            });
            this.apiError
            .addErreurGenerer(this.erreurs.value)
            .subscribe((data) => {});
          }
          //console.log('okverification1');
          //console.log(localStorage.getItem('authlogin'));
          //console.log('okverification1');
          //localStorage.setItem('tentativeLogin', this.formValue.value.login);
          this.erreurAuth = 1;
          this.httpClient
            .get(
              environment.urlFinal +
                '/efacture/detailUser/' +
                localStorage.getItem('authlogin')
            )
            .subscribe((res: any) => {
              if (res != null) {
                let body = { tentative: res.tentative + 1 };
                this.httpClient
                  .put(
                    environment.urlFinal +
                      '/efacture/tentativeConnect/' +
                      localStorage.getItem('authlogin'),
                    body
                  )
                  .subscribe((newUser: any) => {
                    //console.log(JSON.stringify(newUser) + 'NEW');

                    if (newUser.tentative == 5) {
                      this.erreurAuth = 2;
                      let body2 = { bloquser: 1 };
                      this.httpClient
                        .put(
                          environment.urlFinal +
                            '/efacture/bloqueUser/' +
                            localStorage.getItem('authlogin'),
                          body2
                        )
                        .subscribe((user: any) => {});
                    }
                  });
              } else {
              }
            });
          this.falseLogin = true;
          this.blockUser = false;
        }
      );
  }

  onPwdForGot() {
    this.displayMaximizable = true;
  }

  onSendMail() {
    this.creationcompteService
      .getUserByMail(this.formPwdForGot.value.email)
      .subscribe((res) => {
        this.MailEnvoi = this.formbuilber.group({
          expediteur: this.adresseMail,
          destinataire: res.email,
          objet: 'PARAMETRE DE CONNEXION EFACTURE' + ' ',
          message:
            'Salut Mr/Mme' +
            ' ' +
            res.nom +
            '\n' +
            'Votre demande est en cours de traitement',
        });

        if (res.email != null) {
          this.messageService.add({
            severity: 'success',
            summary: 'Succes',
            detail: 'Utilisateur enregistré avec succes',
          });
        /*   this.api.EnvoiMail(this.MailEnvoi.value).subscribe((data) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Succes',
              detail: 'Mail envoyé avec succes',
            });
            this.formValue.reset();
          }); */
        } else {
          this.mailExist = 1;
          this.messageService.add({
            severity: 'info',
            summary: 'Information',
            detail: "Cet mail n'existe pas !",
          });
        }
      });
  }
}
