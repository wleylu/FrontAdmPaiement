import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  nomProfil: any =
    localStorage.getItem('authnom') + ' ' + localStorage.getItem('authprenom');
  constructor(private router: Router, public authService: AuthService) {}

  ngOnInit(): void {}

  onlogout() {
    this.authService.logout();
  }

  modif() {
    this.router.navigate(['modificationpassword']);
  }
  nomProfils() {
    this.nomProfil = localStorage.getItem('authnom');
  }
  logoutUser() {
    this.authService
      .auditLogout(localStorage.getItem('authlogin'))
      .subscribe((res) => {});
    sessionStorage.clear();
    localStorage.clear();
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
    localStorage.removeItem('token');
    localStorage.removeItem('mdpConnect');
    localStorage.removeItem('tentativeLogin');
    this.router.navigate(['/authentication']);
  }
  /* modif(){
  this.authService.mpasse();
  } */

  /*
  deconnection()
  { this.router.navigate(['/connection'])}   */
}
