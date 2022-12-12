import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user.model';
import { AuthService } from 'src/app/services/auth.service';

import { NgForm, FormBuilder, FormGroup } from '@angular/forms';
import { ErreurGenererService } from 'src/app/services/erreur-generer.service';
import { CreationcompteService } from 'src/app/services/creationcompte.service';

@Component({
  selector: 'app-pagedeconnection',
  templateUrl: './pagedeconnection.component.html',
  styleUrls: ['./pagedeconnection.component.scss'],
})
export class PagedeconnectionComponent implements OnInit {
  formValue!: FormGroup;
  user = new User();
  erreur = 0;
  erreurs!: FormGroup;
  erreurAuth!: number;
  aut: any = localStorage.getItem('authhabilitation');
  hab: undefined = JSON.parse(this.aut);
  UI: any;
  habb: any;
  constructor(
    private authService: AuthService,
    private formbuilber: FormBuilder,
    private router: Router,
    private apiError: ErreurGenererService,
    private api: CreationcompteService,


  ) {}

  ngOnInit(): void {
    this.formValue = this.formbuilber.group({
      login: [''],
      password: [''],
    });
  }

  onLoggedin() {

    this.authService
      .login(this.formValue.value.login, this.formValue.value.password)
      .subscribe(
        (res) => {

          let mdp : string;
          let formpwd : string;
          formpwd = this.formValue.value.password;
          if(res != null){
            this.api.decriptPwd(res.login).subscribe((pwd : string)=>{
              mdp = pwd;
              console.log("ici "+mdp+"   "+formpwd);
              if(mdp === formpwd){

                  //this.erreurAuth = 3;
                  if (
                    //res !== null &&
                    res.status == 1 &&
                    res.validation == 1 &&
                    res.bloquser == 0
                  ) {
                    //this.erreurAuth = 3;

                    localStorage.setItem('isAuth', JSON.stringify(res));
                    localStorage.setItem('bloquser', JSON.stringify(res.bloquser));
                    localStorage.setItem('client', JSON.stringify(res.client));
                    localStorage.setItem(
                      'dateCreation',
                      JSON.stringify(res.dateCreation)
                    );
                    localStorage.setItem('email', JSON.stringify(res.email));
                    localStorage.setItem(
                      'habilitation',
                      JSON.stringify(res.habilitation)
                    );
                    localStorage.setItem('login', res.login);
                    localStorage.setItem('nom', res.nom);
                    localStorage.setItem('password', mdp);
                    localStorage.setItem('password1', res.password1);
                    localStorage.setItem('password2', res.password2);
                    localStorage.setItem('prenom', JSON.stringify(res.prenom));
                    localStorage.setItem('status', JSON.stringify(res.status));
                    localStorage.setItem('tel', JSON.stringify(res.tel));
                    localStorage.setItem(
                      'typePlanfond',
                      JSON.stringify(res.typePlafond)
                    );
                    localStorage.setItem(
                      'validation',
                      JSON.stringify(res.validation)
                    );
                    this.router.navigate(['/firstconnexion']);
                  } else {
                    this.erreurAuth = 2;
                    this.router.navigate(['/connection']);
                  }
                //
              }
              else if(res.login!=this.formValue.value.login || res.password != this.formValue.value.password) {
                   this.erreurAuth = 1;
                   this.router.navigate(['/connection']);
                 }
             else if(res.habilitation=='ROLE_APPLICATION') {
                this.erreurAuth = 3;
                this.router.navigate(['/connection']);
              } else{
                this.erreurAuth = 4;
                this.router.navigate(['/connection']);
              }

            });



         // console.log(res);


          }else{
            this.erreurAuth = 1
          }

        },
        (err) => {
          console.log(err.status)
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
        }
      );

    /* authentification()
    { this.router.navigate(['/app/accueil'])} */
  }
}
