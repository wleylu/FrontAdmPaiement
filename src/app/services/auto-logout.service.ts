import { Injectable } from '@angular/core';

import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AutoLogoutService {
  constructor(public authService: AuthService) {}
  public autoLogout(err: any, router: Router) {
    if (err == 401) {
      console.log('ooook');
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
      localStorage.clear();
      setTimeout(() => {
        router.navigate(['/authentication']);
      }, 1000);
    }
  }

  public Logout(router: Router) {
    console.log('ooook');
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
    localStorage.clear();
    setTimeout(() => {
      router.navigate(['/authentication']);
    }, 1000);
  }
}
