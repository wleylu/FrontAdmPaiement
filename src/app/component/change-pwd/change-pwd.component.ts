import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Password } from '../forceMdp';
import { User } from 'src/app/model/user.model';

import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-change-pwd',
  templateUrl: './change-pwd.component.html',
  styleUrls: ['./change-pwd.component.scss'],
})
export class ChangePwdComponent implements OnInit {
  firstConnexionForm!: FormGroup;
  submitted: boolean = false;
  user = new User();
  messageMotPasseFort!: number;
  compteuserObj = new User();
  erreur = 0;
  confirmErreur!: number;
  pwd: any = localStorage.getItem('dwp');
  loginUser: string = JSON.stringify(localStorage.getItem('tentativeLogin'));
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
  constructor(
    private authService: AuthService,
    private formbuilber: FormBuilder,
    private router: Router
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
  console.log("okokok");
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
      console.log("okokok1")
      if (
        this.firstConnexionForm.value.password1 ===
        this.firstConnexionForm.value.confirmPassword
      ) {
        console.log(this.loginUser);
        console.log("okokok2")
        console.log(this.loginUser);
        console.log("okokok2525")
        this.authService.decriptPwd(this.loginUser).subscribe(mdp=>{
          console.log('ok222')
          console.log(mdp);
          console.log('ok222')
      })
      this.compteuserObj.login = this.loginUser;
      console.log("okokok27777725")
        this.compteuserObj.password = this.pwd;
        this.compteuserObj.password1 = this.firstConnexionForm.value.password1;
        this.compteuserObj.mdpOublie = this.compteuserObj.password1;
        console.log("okokok3")
        if (
          this.firstConnexionForm.value.password ===
          localStorage.getItem('confirmation')
        ) {
          console.log("okokok4")
          console.log(this.compteuserObj);
          this.authService.firstconnexion(this.compteuserObj).subscribe(
            (res) => {
              if (res.password !== res.password1) {
                this.router.navigate(['authentication']);
              } else {
                this.router.navigate(['/reinitialiser']);
              }
            },
            (err) => {}
          );
        } else {
        }
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
      } else {
        this.confirmErreur = 1;
      }
    } else {
      this.confirmErreur = 2;
    }
  }
}
