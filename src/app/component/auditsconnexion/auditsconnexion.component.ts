import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuditConnexionService } from 'src/app/services/audit-connexion.service';
import { MessageService } from 'primeng/api';
import { ErreurGenererService } from 'src/app/services/erreur-generer.service';
import { ExcelService } from 'src/app/services/excel.service';
import { AuthService } from 'src/app/services/auth.service';
import { AutoLogoutService } from 'src/app/services/auto-logout.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-auditsconnexion',
  templateUrl: './auditsconnexion.component.html',
  styleUrls: ['./auditsconnexion.component.scss'],
  providers: [MessageService],
})
export class AuditsconnexionComponent implements OnInit {
  auditData!: any;
  p: number = 1;
  formRechercheAudit!: FormGroup;
  erreur!: FormGroup;
  isDisable!: boolean;
  isDisable1!: boolean;
  aut: any = localStorage.getItem('authhabilitation');
  hab: undefined = JSON.parse(this.aut);
  UI: any;
  habb: any;

  firstDate! : Date;
  lastDate! : Date;
  login= ''
  nom= ''
  role= ''
  statut= ''
  remplir!: number;
  constructor(
    private messageService: MessageService,
    private formbuilber: FormBuilder,
    private api: AuditConnexionService,
    private apiError: ErreurGenererService,
    private excelService: ExcelService,
    public authService: AuthService,
    public autoLogoutService: AutoLogoutService,
    private router: Router
  ) {}

  ngOnInit(): void {
    let num : string ='14010010'
   // alert(num.slice(2,7))
    this.authService.infoUser(localStorage.getItem('authlogin')).subscribe(
      (res) => {
        console.log(res);
        if (res) {
          this.UI = res;
          this.habb = res.habilitation;
          if (
            this.habb != 'ROLE_SUPER_ADMIN' &&
            this.habb != 'ROLE_ADMIN' &&
            this.habb != 'ROLE_AUDIT'
          ) {
            this.autoLogoutService.Logout(this.router);
            this.router.navigate(['/authentication'], {
              queryParams: { returnUrl: this.router.routerState.snapshot.url },
            });
          } else {
            this.getallAudit();
            this.formRechercheAudits();
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

  SearchUser() {

    // if(this.firstDate == null && this.lastDate && this.login == null &&
    //   this.nom == null &&
    //   this.role == null &&
    //   this.statut == null){
    //     this.remplir = 1;

    // }
    // this.login = this.formRechercheAudit.value.login;
    // this.nom = this.formRechercheAudit.value.nom;
    // //this.role = this.formRechercheAudit.value.role;
    // this.statut = this.formRechercheAudit.value.statut;
    // this.firstDate = this.formRechercheAudit.value.firstDate;
    // this.lastDate = this.formRechercheAudit.value.lastDate;
    if(this.firstDate == null || this.lastDate  == null){
      if(this.login == '' &&
        this.nom == '' &&
       // this.role == null &&
        this.statut == ''){
          //alert('VIDE 1')
        this.remplir = 1;
        }else{
          if(this.statut=='' && this.nom == ''){
           // alert('VIDE 2')
            this.api.getrecherchelogin(this.login).subscribe((logg)=>{
              this.auditData = logg;
            })
          }
          else if(this.login == '' && this.nom == ''){
            //alert('VIDE 3')
            this.api.getrecherchestatut(this.statut).subscribe((stat)=>{
              this.auditData = stat
            })
          }
          else {
           // alert('NO VIDE')
          this.api
          .rechercheNodate(this.login, this.nom.toUpperCase(), this.statut)
          .subscribe((resp) => {
            this.auditData = resp;
          });
        }
        }


     // this.remplir = 1;
    }
    else{
      if(this.login == '' &&
        this.nom == '' &&
        // this.role == '' &&
        this.statut == ''){
         // alert('DATE')

          this.api.rechercheByDateBetween(this.firstDate,this.lastDate).subscribe((dateReponse)=>{
            this.auditData=dateReponse
         })
        }
        else{

         // alert('ALL')

          this.api

          .getrechercheAdit(this.firstDate, this.lastDate, this.login, this.nom.toUpperCase(), this.statut)
          .subscribe(
            (data) => {
              this.auditData = data;
            })
        }
      //  this.api.rechercheByDateBetween(this.firstDate,this.lastDate).subscribe((dateReponse)=>{
      //     this.auditData=dateReponse
      //  })
     // this.remplir = 0;
      }


    // this.api
    //   .getrechercheAdit(this.firstDate, this.lastDate, this.login, this.nom.toUpperCase(), this.role, this.statut)
    //   .subscribe(
    //     (data) => {
    //       this.auditData = data;
    //     },
    //     (err) => {
    //       if (err.status != 401) {
    //         if (
    //           this.login != null &&
    //           this.nom != null &&
    //           this.role != null &&
    //           this.statut != null
    //         ) {
    //           this.api
    //             .rechercheAudit(this.login, this.nom.toUpperCase(), this.role, this.statut)
    //             .subscribe((resp) => {
    //               this.auditData = resp;
    //             });
    //         } else {
    //           this.getallAudit();
    //         }

    //         this.erreur = this.formbuilber.group({
    //           httpStatusCode: err.status,
    //           methode: 'Recherche des audits',
    //           login: localStorage.getItem('authlogin'),
    //           description: "Erreur d'affichage des resultats des recherches",
    //           message: err.message,
    //         });
    //       }
    //       this.apiError
    //         .addErreurGenerer(this.erreur.value)
    //         .subscribe((data) => {});

    //       this.autoLogoutService.autoLogout(err.status, this.router);
    //     }
    //   );

  }
  formRechercheAudits(): void {
    this.formRechercheAudit = this.formbuilber.group({
      nom: [''],
      login: [''],
      role: [''],
      statut: [''],
      firstDate: [''],
      lastDate: [''],
    });
  }
  getallAudit() {
    this.api.getAudit().subscribe(
      (res:any) => {
        console.log(res);
        if(res.prenom == '' || res.prenom == null){
          res.prenom = 'Non Renseigné'
        }
        this.auditData = res;


      },
      (err) => {
        this.erreur = this.formbuilber.group({
          httpStatusCode: err.status,
          methode: 'UserAuditeImpl.listAudit',
          login: localStorage.getItem('authlogin'),
          description: 'Erreur de consultation des audites',
          message: err.message,
        });

        this.apiError
          .addErreurGenerer(this.erreur.value)
          .subscribe((data) => {});
        this.autoLogoutService.autoLogout(err.status, this.router);
      }
    );
  }

  // SearchUser1(firstDate: string, lastDate: string): void {
  //   firstDate = this.formRechercheAudit.value.firstDate;
  //   lastDate = this.formRechercheAudit.value.lastDate;

  //   this.api.rechercheByDateBetween(firstDate, lastDate).subscribe(
  //     (data) => {
  //       this.auditData = data;
  //       this.isDisable = true;
  //     },
  //     (err) => {
  //       this.autoLogoutService.autoLogout(err.status, this.router);
  //     }
  //   );
  // }
  exportAsXLSX(): void {
    this.excelService.exportAsExcelFile(this.auditData, 'Audit');
  }

  annuler() {
    this.formRechercheAudit.reset;
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
