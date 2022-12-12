import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { AutoLogoutService } from 'src/app/services/auto-logout.service';
import { ErreurGenererService } from 'src/app/services/erreur-generer.service';

@Component({
  selector: 'app-erreurtransaction',
  templateUrl: './erreurtransaction.component.html',
  styleUrls: ['./erreurtransaction.component.scss'],
  providers: [MessageService],
})
export class ErreurtransactionComponent implements OnInit {
  erreurData: any;
  p: number = 1;
  formRechercheErreurs!: FormGroup;
  erreur!: FormGroup;
  isDisable!: boolean;
  isDisable1!: boolean;
  aut: any = localStorage.getItem('authhabilitation');
  hab: undefined = JSON.parse(this.aut);
  UI: any;
  habb: any;
  remplir! : number
  firstDate!: Date;
    lastDate !: Date;
    login = '';
    methode = '';

  constructor(
    private messageService: MessageService,
    private api: ErreurGenererService,
    private formbuilber: FormBuilder,
    private apiError: ErreurGenererService,
    public authService: AuthService,
    public autoLogoutService: AutoLogoutService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.infoUser(localStorage.getItem('authlogin')).subscribe(
      (res) => {
        console.log(res);
        if (res) {
          this.UI = res;
          this.habb = res.habilitation;
          if (this.habb != 'ROLE_SUPER_ADMIN' && this.habb != 'ROLE_SUPPORT'&& this.habb != 'ROLE_ADMIN') {
            this.autoLogoutService.Logout(this.router);
            this.router.navigate(['/authentication'], {
              queryParams: { returnUrl: this.router.routerState.snapshot.url },
            });
          } else {
            this.getErreurGenerer();
            this.formErreurs();
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

  Search(){
    if(this.firstDate == null || this.lastDate == null){
      this.remplir = 1;
    }
    else{
      this.remplir = 0;
    }



    if (
      this.firstDate != null &&
      this.lastDate != null &&
      this.login != null &&
      this.methode != null
    ) {
      
      this.api.rechercheErreur(this.firstDate, this.lastDate, this.login, this.methode).subscribe(
        (data) => {
          this.erreurData = data;
        },
        (err) => {
          if (this.login != null && this.methode != null) {
            this.api.rechercheLoginMethode(this.login, this.methode).subscribe((res) => {
              this.erreurData = res;
            });
          } else {
            this.getErreurGenerer();
          }

          this.autoLogoutService.autoLogout(err.status, this.router);
        }
      );
    } else {
    }
  }
  formErreurs(): void {
    this.formRechercheErreurs = this.formbuilber.group({
      login: [''],
      methode: [''],
      description: [''],
      firstDate: [''],
      lastDate: [''],
    });
  }
  getErreurGenerer() {
    this.api.getErreurGenerer().subscribe(
      (res) => {
        console.log(res);
        this.erreurData = res;
      },
      (err) => {
        if (err.status != 401) {
          this.erreur = this.formbuilber.group({
            httpStatusCode: err.status,
            methode: 'ErreurGenereImpl.listeErreurGenerer',
            login: localStorage.getItem('authlogin'),
            description: 'Erreur de consultation des Erreurs',
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

  SearchUser1(firstDate: string, lastDate: string): void {
    firstDate = this.formRechercheErreurs.value.firstDate;
    lastDate = this.formRechercheErreurs.value.lastDate;

    this.api.rechercheByDateBetween(firstDate, lastDate).subscribe(
      (data) => {
        this.erreurData = data;
        this.isDisable = true;
      },
      (err) => {
        this.autoLogoutService.autoLogout(err.status, this.router);
      }
    );
  }
  annuler() {
    this.formRechercheErreurs.reset;
    location.reload();
    this.isDisable = false;
    this.isDisable1 = false;
  }
  block() {
    this.isDisable = true;
  }
  block1() {
    this.isDisable1 = true;
  }
}
