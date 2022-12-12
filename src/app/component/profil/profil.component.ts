import { Password } from './../../mdp';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { User } from 'src/app/model/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { AutoLogoutService } from 'src/app/services/auto-logout.service';
import { CreationcompteService } from 'src/app/services/creationcompte.service';
import { ErreurGenererService } from 'src/app/services/erreur-generer.service';
import { ParametragesService } from 'src/app/services/parametrages.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss'],
  providers: [MessageService],
})
export class ProfilComponent implements OnInit {
  nom = localStorage.getItem('authnom');
  prenom = localStorage.getItem('authprenom');
  email = localStorage.getItem('authemail');
  firstConnexionForm!: FormGroup;
  compteuserObj = new User();
  confirmErreur!: number;
  racine: any;
  nomPrenom: any;
  tel: any;
  login: any;
  UserInfos: any;
  pwd: any;
  emptyField!: boolean;
  mdp!: boolean;
  duo!: boolean;
  messageMotPasseFort!: number;
  value!: any;
  erreur!: FormGroup;

  pwdactu: any;
  loginUser: any = localStorage.getItem('authlogin');
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
    private creationcompteService: CreationcompteService,
    private httpClient: HttpClient
  ) {}

  ngOnInit(): void {
    this.firstConnexionForm = this.formbuilber.group({
      password: ['', Validators.required],
      password1: [
        '',
        [
          Validators.required,
          Password,
          Validators.pattern(
            '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}'
          ),
        ],
      ],
      confirmPassword: [
        '',
        [Validators.required, Password, Validators.minLength(8)],
      ],
    });

    this.UserDetail();
  }
  isControle(controlName: string, validationType: string) {
    const control = this.firstConnexionForm.controls[controlName];
    if (!control) {
      return false;
    }
    const result =
      control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }

  get f(): { [key: string]: AbstractControl } {
    return this.firstConnexionForm.controls;
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
          this.pwdactu = this.UserInfos.password1;

          this.nomPrenom = this.UserInfos.nom + ' ' + this.UserInfos.prenom;
          this.racine = this.UserInfos.login;
          this.tel = this.UserInfos.tel;
          this.login = this.UserInfos.login;
          this.pwd = this.UserInfos.password;
        },
        (err) => {}
      );
  }

  onControleValue(value: any): any {
    if (!value) {
      return null;
    }
    if (value.length < 8) {
      this.messageMotPasseFort = 1;
      return { passwordStrength: 'Au moins 8 Caractères' };
    } else {
      this.messageMotPasseFort = 6;
    }

    let upperCaseCharacters = /[A-Z]+/g;
    if (upperCaseCharacters.test(value) === false) {
      this.messageMotPasseFort = 2;

      return {
        passwordStrength: `Le mot de passe doit contenir au moins une lettre Majuscule`,
      };
    } else {
      this.messageMotPasseFort = 6;
    }

    let lowerCaseCharacters = /[a-z]+/g;
    if (lowerCaseCharacters.test(value) === false) {
      this.messageMotPasseFort = 3;
      return {
        passwordStrength: `Le mot de passe doit contenir au moins une lettre Miniscule, ${value}`,
      };
    } else {
      this.messageMotPasseFort = 6;
    }

    let numberCharacters = /[0-9]+/g;
    if (numberCharacters.test(value) === false) {
      this.messageMotPasseFort = 4;

      return {
        passwordStrength: `Le mot de passe doit contenir au moins un chiffre`,
      };
    } else {
      this.messageMotPasseFort = 6;
    }

    let specialCharacters = /[~!@#$%^&*()_+\-\[\]{};':"\\|,.<>\/?]+/;
    if (specialCharacters.test(value) === false) {
      this.messageMotPasseFort = 5;

      return {
        passwordStrength: `Le mot de passe doit contenir au moins un caractère spécial`,
      };
    } else {
      this.messageMotPasseFort = 6;
    }
  }
  test(){

    console.log('OUI OK');


     // ------------------------------------------//

     if (
      this.firstConnexionForm.value.password1 != null &&
      this.firstConnexionForm.value.password1 != ''
    ) {
      console.log(this.firstConnexionForm.value.password1);
      console.log(this.firstConnexionForm.value.password1 + ' PWD1');
      console.log(this.firstConnexionForm.value.confirmPassword + 'CONFIRM PWD');
      console.log(this.firstConnexionForm.value.password + ' PWD');
      console.log( localStorage.getItem('mdpConnect') + 'LOCAL MDP');

      if (
        this.firstConnexionForm.value.password1 ===
        this.firstConnexionForm.value.confirmPassword
      ) {
        console.log(this.firstConnexionForm.value.password1 + ' PWD');
        console.log(this.firstConnexionForm.value.confirmPassword + 'CONFIRM PWD');

        if (
          this.firstConnexionForm.value.password ===
          localStorage.getItem('mdpConnect')
        ) {
          this.compteuserObj.login = this.loginUser;
          this.compteuserObj.password  = this.firstConnexionForm.value.password;
          this.compteuserObj.password1 = this.firstConnexionForm.value.password1;
          //this.compteuserObj.mdpOublie = this.compteuserObj.password1;
          console.log(JSON.stringify(this.compteuserObj))
          this.authService.modifierMotPasse(this.compteuserObj).subscribe(
            (res) => {
              console.log(JSON.stringify(res))
              console.log(res.password  + '------' + res.password1)
              if (res.password === null || res.password === 'null') {
                this.confirmErreur = 6
              }
               else {
                //this.messageMotPasseFort = 1;
                
                this.messageService.add({
                  severity: 'success',
                  summary: 'Succes',
                  detail: 'Mot de passe modifié avec succès',
                });
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
              }
            },
            (err) => {
              if (err.status != 401) {
                this.erreur = this.formbuilber.group({
                  httpStatusCode: err.status,
                  methode: 'UserServiceImpl.modificationMotPasses',
                  login: localStorage.getItem('authlogin'),
                  description: "Erreur de modification du mot de passe de l'utilisateur",
                  message: err.message,
                });
                this.apiError
                  .addErreurGenerer(this.erreur.value)
                  .subscribe((data) => {});
              }

              this.autoLogoutService.autoLogout(err.status, this.router);
              // this.confirmErreur = 6;
              // this.router.navigate(['/firstconnexion']);
            });
        } else {
          this.confirmErreur = 4;
        }
      } else {
        this.confirmErreur = 1;
      }
    } else {
      this.confirmErreur = 2;
    }
  }

  onLoggedin() {

    const controls = this.firstConnexionForm.controls;
    if (this.firstConnexionForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
      return;
    }
    console.log(this.firstConnexionForm.value.password1);

    if (
      this.firstConnexionForm.value.password1 != null &&
      this.firstConnexionForm.value.password1 != ''
    ) {
      console.log(this.firstConnexionForm.value.password1);
      console.log(this.firstConnexionForm.value.password1 + ' PWD1');
      console.log(this.firstConnexionForm.value.confirmPassword + 'CONFIRM PWD');
      console.log(this.firstConnexionForm.value.password + ' PWD');
      console.log( localStorage.getItem('mdpConnect') + 'LOCAL MDP');

      if (
        this.firstConnexionForm.value.password1 ===
        this.firstConnexionForm.value.confirmPassword
      ) {
        console.log(this.firstConnexionForm.value.password1 + ' PWD');
        console.log(this.firstConnexionForm.value.confirmPassword + 'CONFIRM PWD');

        if (
          this.firstConnexionForm.value.password ===
          localStorage.getItem('mdpConnect')
        ) {
          this.compteuserObj.login = this.login;
          this.compteuserObj.password = this.firstConnexionForm.value.password;
          this.compteuserObj.password1 =
            this.firstConnexionForm.value.password1;

          this.authService.modifierMotPasse(this.compteuserObj).subscribe(
            (res) => {
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
                this.messageMotPasseFort = 1;

                this.router.navigate(['/app/profil']);
              }
            },
            (err) => {
              this.confirmErreur = 6;
              this.router.navigate(['/firstconnexion']);
            }
          );
        } else {
          this.confirmErreur = 4;
        }
      } else {
        this.confirmErreur = 1;
      }
    } else {
      this.confirmErreur = 2;
    }
  }

  onAnnuler() {
    this.firstConnexionForm.reset();
  }
}
