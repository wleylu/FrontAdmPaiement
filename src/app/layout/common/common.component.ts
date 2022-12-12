import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-common',
  templateUrl: './common.component.html',
  styleUrls: ['./common.component.scss'],
})
export class CommonComponent implements OnInit {
  nom!: string | any;
  prenom!: string;
  nomProfil: any = localStorage.getItem('authhabilitation');
  prod: undefined = JSON.parse(this.nomProfil);
  menuItems: any[] | undefined;
  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.ngLoadMenu();
  }
  ngLoadMenu() {
    if (this.prod === 'ROLE_ADMIN' || this.prod === 'ROLE_SUPER_ADMIN') {
      this.menuItems = [
        {
          titre: 'Clients',
          icon: 'fa fa-address-card-o',
          url: '/app/compteconnexion',
          submenu: [],
        },
        {
          titre: 'Utilisateurs',
          icon: 'fa fa-users',
          url: '/app/createuser',
          submenu: [],
        },

        // {
        //   titre: 'Validation BackOffice',
        //   icon: 'fa fa-check-circle-o',
        //   url: '/app/validationBackOffice',
        //   submenu: [],
        // },
        {
          titre: 'Audits',
          icon: 'fa fa-eye',
          url: '/app/auditconnexion',
          submenu: [],
        },
       /*  {
          titre: 'Erreurs',
          icon: 'fa fa-bug',
          url: '/app/erreur',
          submenu: [],
        },
        {
          titre: 'Commissions',
          icon: 'fa fa-money',
          url: '/app/commissions',
          submenu: [],
        },
*/
        {
          titre: 'Consultations',
          icon: 'fa fa-list',
          url: '/app/Consultation',
          submenu: [],
        },
        {
          titre: 'Réclamations',
          icon: 'fa fa-commenting',
          url: '/app/reclamations',
          submenu: [],
        },
      ];
    }
    if (this.prod === 'ROLE_AUDIT') {
      this.menuItems = [
        {
          titre: 'Audits',
          icon: 'fa fa-eye',
          url: '/app/auditconnexion',
          submenu: [],
        },
        {
          titre: 'Consultations',
          icon: 'fa fa-list',
          url: '/app/Consultation',
          submenu: [],
        },
      ];
    }
    if (this.prod === 'ROLE_HELPDESK') {
      this.menuItems = [
        {
          titre: 'Clients',
          icon: 'fa fa-address-card-o',
          url: '/app/compteconnexion',
          submenu: [],
        },

        {
          titre: 'Validation Client',
          icon: 'fa fa-check-circle-o',
          url: '/app/validation',
          submenu: [],
        },

        {
          titre: 'Consultations',
          icon: 'fa fa-list',
          url: '/app/Consultation',
          submenu: [],
        },
      ];
    }
    if (this.prod === 'ROLE_MONETIQUE') {
      this.menuItems = [
        {
          titre: 'Consultations',
          icon: 'fa fa-list',
          url: '/app/Consultation',
          submenu: [],
        },
      ];
    }
    if (this.prod === 'ROLE_SUPPORT') {
      this.menuItems = [
        {
          titre: 'Consultations',
          icon: 'fa fa-list',
          url: '/app/Consultation',
          submenu: [],
        },
        {
          titre: 'Erreurs',
          icon: 'fa fa-bug',
          url: '/app/erreur',
          submenu: [],
        },
      ];
    }
    if (this.prod === 'ROLE_USER_COM') {
      this.menuItems = [
        {
          titre: 'Consultations',
          icon: 'fa fa-list',
          url: '/app/Consultation',
          submenu: [],
        },
        /* {
          titre: 'Commissions',
          icon: 'fa fa-money',
          url: '/app/commissions',
          submenu: [],
        }, */
      ];
    }
    if (this.prod === 'ROLE_COMPTABILITE') {
      this.menuItems = [
        {
          titre: 'Consultations',
          icon: 'fa fa-list',
          url: '/app/Consultation',
          submenu: [],
        },
        /* {
          titre: 'Commissions',
          icon: 'fa fa-money',
          url: '/app/commissions',
          submenu: [],
        }, */
      ];
    }
    if (this.prod === 'ROLE_SUPERVISEUR') {
      this.menuItems = [
        {
          titre: 'Clients',
          icon: 'fa fa-address-card-o',
          url: '/app/compteconnexion',
          submenu: [],
        },
        {
          titre: 'Validation Client',
          icon: 'fa fa-check-circle-o',
          url: '/app/validation',
          submenu: [],
        },

        {
          titre: 'Consultations',
          icon: 'fa fa-list',
          url: '/app/Consultation',
          submenu: [],
        },
      ];
    }
    if (this.prod === 'ROLE_USER') {
      this.menuItems = [
        {
          titre: 'Clients',
          icon: 'fa fa-address-card-o',
          url: '/app/compteconnexion',
          submenu: [],
        },

        {
          titre: 'Consultations',
          icon: 'fa fa-list',
          url: '/app/Consultation',
          submenu: [],
        },
      ];
    }
  }

  logoutUser() {
    this.authService
      .auditLogout(localStorage.getItem('authlogin'))
      .subscribe((res) => {
        console.log(res);
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

    this.router.navigate(['/marchands']);
  }
}
