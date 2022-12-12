import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';
import { CreationService } from 'src/app/services/creation.service';
import { CreationcompteService } from 'src/app/services/creationcompte.service';
import { ErreurGenererService } from 'src/app/services/erreur-generer.service';
import { ParametragesService } from 'src/app/services/parametrages.service';
import { User } from 'src/app/model/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-creationmarchand',
  templateUrl: './creationmarchand.component.html',
  styleUrls: ['./creationmarchand.component.scss'],
  providers: [MessageService],
})
export class CreationmarchandComponent implements OnInit {
  lienMessageMailMarchand: any;
  lienMessageMailBack: any;
  adresseMail: any;
  loginConnect: any;
  getComptemarchand: any;
  backOfficeData!: any;
  erreur!: FormGroup;
  showAdd!: number;
  disableModif!: number;
  backObj: User = new User();
  backObj1: User = new User();
  formValueBack!: FormGroup;
  isDisable!: boolean;
  formValueM!: FormGroup;
  MailEnvoi!: FormGroup;
  aut: any = localStorage.getItem('authhabilitation');
  hab: undefined = JSON.parse(this.aut);
  UI: any;
  habb: any;
  constructor(
    private httpClient: HttpClient,
    private messageService: MessageService,
    private formbuilber: FormBuilder,
    private api: CreationcompteService,
    private modalService: NgbModal,
    private apiParametre: ParametragesService,
    private apiError: ErreurGenererService
  ) {}
  ngOnInit(): void {
    this.getallBackOffice();
    this.initFormBack();
    this.loginConnect = localStorage.getItem('authlogin');
    this.liens();
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
  initFormBack(): void {
    this.formValueBack = this.formbuilber.group({
      backlogin: [
        this.backObj1.login,
        [Validators.required, Validators.minLength(8)],
      ],
      backnom: [this.backObj1.nom, []],
      backprenom: [this.backObj1.prenom],
      backemail: [this.backObj1.email],
      backtel: [this.backObj1.tel],
      backhabilitation: [this.backObj1.habilitation],
      backstatut: [this.backObj1.status],
    });
  }
  getallBackOffice() {
    this.api.getCompteuser().subscribe(
      (res) => {
        this.backOfficeData = res;
        this.messageService.add({
          severity: 'success',
          summary: 'Succes',
          detail: 'Liste des Utilisateurs',
        });
      },
      (err) => {
        this.erreur = this.formbuilber.group({
          httpStatusCode: err.status,
          methode: 'UserServiceImpl.listeUserEntity',
          login: localStorage.getItem('authlogin'),
          description: 'Erreur de consultation des utilisateurs',
          message: err.message,
        });
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: this.erreur.value.description,
        });
        this.apiError
          .addErreurGenerer(this.erreur.value)
          .subscribe((data) => {});
      }
    );
  }
  clickAddcompteuser() {
    this.showAdd = 3;
    this.disableModif = 2;
  }
  ajoutBackoffice() {
    this.backObj.nom = this.formValueBack.value.backnom;
    this.backObj.prenom = this.formValueBack.value.backprenom;
    this.backObj.login = this.formValueBack.value.backlogin;
    this.backObj.habilitation = this.formValueBack.value.backhabilitation;
    this.backObj.tel = this.formValueBack.value.backtel;
    this.backObj.email = this.formValueBack.value.backemail;
    this.backObj.password = this.formValueBack.value.backpassword;
    this.backObj.status = this.formValueBack.value.backstatut;
    this.backObj.loginAdd = this.loginConnect;
    this.backObj.loginMaj = this.loginConnect;

    this.api.postCompteuser(this.backObj).subscribe(
      (res) => {
        this.backObj1 = res;
        this.formValueBack.reset();

        this.MailEnvoi = this.formbuilber.group({
          expediteur: this.adresseMail,
          destinataire: this.backObj1.email,
          objet: 'PARAMETRE DE CONNEXION EFACTURE' + ' ',
          message:
            'Salut' +
            ' ' +
            this.backObj1.nom +
            '\n' +
            'Votre login est:' +
            ' ' +
            this.backObj1.login +
            '\n' +
            'Et votre mot de passe est:' +
            ' ' +
            this.backObj1.password +
            '\n' +
            'Cliquez sur le lien ci-dessous pour vous connecter et modifier votre mot de passe' +
            '\n' +
            this.lienMessageMailBack +
            '\n',
        });

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
              detail: 'Mail de parametre de connexions envoyé avec succes',
            });
            this.formValueBack.reset();
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Utilisateur existant !',
          });
        }

        this.getallBackOffice();
      },
      (err) => {
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
    );
  }
  onModifBackoffice(row: any) {
    this.showAdd = 0;
    this.backObj1.id = row.id;
    this.backObj1 = row;
    this.initFormBack();
    this.isDisable = false;
    this.disableModif = 1;

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
  updateBackOffice() {
    this.backObj.nom = this.formValueBack.value.backnom;
    this.backObj.prenom = this.formValueBack.value.backprenom;
    this.backObj.login = this.formValueBack.value.backlogin;
    this.backObj.habilitation = this.formValueBack.value.backhabilitation;
    this.backObj.tel = this.formValueBack.value.backtel;
    this.backObj.email = this.formValueBack.value.backemail;
    this.backObj.password = this.formValueBack.value.backpassword;
    this.backObj.status = this.formValueBack.value.backstatut;
    this.backObj.loginMaj = this.loginConnect;

    this.api.updateCompteuser(this.backObj).subscribe(
      (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Succes',
          detail: 'Utilisateur modifié avec succes',
        });

        let ref = document.getElementById('cancel');
        ref?.click();
        this.formValueBack.reset();
        this.getallBackOffice();
      },
      (err) => {
        this.erreur = this.formbuilber.group({
          httpStatusCode: err.status,
          methode: 'UserServiceImpl.modifierUserEntity',
          login: localStorage.getItem('authlogin'),
          description: 'Erreur de consultation des utilisateurs',
          message: err.message,
        });
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: this.erreur.value.description,
        });
        this.apiError
          .addErreurGenerer(this.erreur.value)
          .subscribe((data) => {});
      }
    );
  }
  onEditBackoffice(row: any) {
    this.backObj1.id = row.id;
    this.backObj1 = row;
    this.initFormBack();
    this.isDisable = true;
    this.disableModif = 3;

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
}
