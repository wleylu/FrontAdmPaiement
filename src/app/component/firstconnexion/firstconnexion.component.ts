import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { ErreurGenererService } from 'src/app/services/erreur-generer.service';

@Component({
  selector: 'app-firstconnexion',
  templateUrl: './firstconnexion.component.html',
  styleUrls: ['./firstconnexion.component.scss'],
})
export class FirstconnexionComponent implements OnInit {
  firstConnexionForm!: FormGroup;
  submitted: boolean = false;
  user = new User();
  messageMotPasseFort!: number;
  compteuserObj = new User();
  erreur = 0;
  confirmErreur!: number;
  loginUser: any = localStorage.getItem('login');
  passRequirement = {
    passwordMinLowerCase: 1,
    passwordMinNumber: 1,
    passwordMinSymbol: 1,
    passwordMinUpperCase: 1,
    passwordMinCharacters: 8,
  };
  erreurs!: FormGroup;

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
    private authService: AuthService,
    private formbuilber: FormBuilder,
    private router: Router,
    private apiError: ErreurGenererService,

  ) {}

  ngOnInit(): void {
    this.firstConnexionForm = this.formbuilber.group({
      password: ['', Validators.required],
      password1: [
        '',
        Validators.required,
        Validators.pattern(
          '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}'
        ),
      ],
      confirmPassword: ['', Validators.required],
    });
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
      this.onInitErreor();

      if (
        this.firstConnexionForm.value.password1 ===
        this.firstConnexionForm.value.confirmPassword
      ) {
        console.log('ok1')
        this.compteuserObj.login = this.loginUser;
        this.compteuserObj.password = this.firstConnexionForm.value.password;
        this.compteuserObj.password1 = this.firstConnexionForm.value.password1;
        this.compteuserObj.mdpOublie = this.compteuserObj.password1;

        console.log(this.compteuserObj);
        console.log( localStorage.getItem('password'));
        console.log( this.loginUser);
        console.log(localStorage.getItem('login'));
        if (
          this.loginUser
        ) {
          console.log('ok')
          this.authService.firstconnexion(this.compteuserObj).subscribe(
            (res) => {
              if (res.password !== res.password1) {
                localStorage.removeItem('isAuth');
                localStorage.removeItem('bloquser');
                localStorage.removeItem('client');
                localStorage.removeItem('dateCreation');
                localStorage.removeItem('email');
                localStorage.removeItem('habilitation');
                localStorage.removeItem('login');
                localStorage.removeItem('nom');
                localStorage.removeItem('password');
                localStorage.removeItem('password1');
                localStorage.removeItem('password2');
                localStorage.removeItem('prenom');
                localStorage.removeItem('status');
                localStorage.removeItem('tel');
                localStorage.removeItem('typePlanfond');
                localStorage.removeItem('validation');
                this.router.navigate(['authentication']);
              } else {
                this.router.navigate(['/firstconnexion']);
              }
            },
            (err) => {
              console.log(err.status)
              if (err.status = 500) {
                this.erreurs = this.formbuilber.group({
                  httpStatusCode: err.status,
                  methode: 'UserServiceImpl.authentification',
                  login: localStorage.getItem('login'),
                  description: 'Erreur lors de l\'authentification',
                  message: err.message,
                });

                this.apiError
                  .addErreurGenerer(this.erreurs.value)
                  .subscribe((data) => {});
              }
              else{
                this.erreurs = this.formbuilber.group({
                  httpStatusCode: err.status,
                  methode: 'UserServiceImpl.authentification',
                  login: localStorage.getItem('login'),
                  description: 'Serveur injoignable',
                  message: err.message,
                });
                this.apiError
                .addErreurGenerer(this.erreurs.value)
                .subscribe((data) => {});
              }
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
  onInitErreor() {
    this.confirmErreur = 0;
  }
}
