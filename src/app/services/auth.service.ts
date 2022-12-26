import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../model/user.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Mail } from '../model/mail.model';
import { map } from 'rxjs/operators';
import { User_login } from '../model/user_login.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  header!: HttpHeaders;
  headeroff!: HttpHeaders;
  redirectUrl!: string;
  private urlServeurApi = environment.urlFinal + '/efacture';
  private urlServeurApiuser = environment.urlFinal;
  loggedUser!: string;
  users: User_login;
  constructor(private router: Router, private http: HttpClient) {
    this.users = new User_login();
  }

  public login(login: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.urlServeurApi}/login`, {
      login: login,
      password: password,
    });
  }

  authentification(login: any, password1: string) {
    const UserData = login + ':' + password1;
    this.header = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      Authorization: 'Basic ' + btoa(UserData),
    });

    this.header.append(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE'
    );
    this.header.append(
      'Access-Control-Allow-Headers',
      'Content-Type, application/x-www-form-urlencoded, X-Requested-With'
    );
    this.header.append('Status Code', '200');
    return this.http
      .post<any>(this.urlServeurApiuser + '/authenticate', { login, password1 })
      .pipe(
        map((userData) => {
          let tokenStr = 'Bearer ' + userData.token;
          localStorage.setItem('token', tokenStr);

          //console.log(userData + 'USER DATA');
        //  console.log(tokenStr + 'TOKEN');

          return userData;
        })
      );
  }
  isUserLoggedIn() {
    let user = localStorage.getItem('login');

    return !(user === null);
  }
  public emails(data: Mail): Observable<Mail> {
    return this.http.post<any>(`urlMail`, data);
  }
  logout() {}
  mpasse() {
    this.router.navigate(['app/modificationpassword']);
  }
  public firstconnexion(data: User): Observable<User> {
    return this.http.put<any>(`${this.urlServeurApi}/firstLogin`, data);
  }
  public modifierMotPasse(data: User): Observable<User> {
    return this.http.put<any>(
      `${this.urlServeurApi}/user/modifierMotPasse`,data);
  }

  public auditLogout(login: any): Observable<any> {
    return this.http.get<any>(`${this.urlServeurApi}/deconnexion/${login}`);
  }
  ValeurStorage(client: string): void {
    sessionStorage.setItem('client', client);
    this.loggedUser = client;
  }

  public infoUser(login: any): Observable<any> {
    return this.http.get<any>(`${this.urlServeurApi}/detailUser/${login}`);
  }
  public decriptPwd(login:String): Observable<String>{
    return this.http.get<String>(`${this.urlServeurApi}/chiffreStringg/${login}`);
    //return this.http.get<any>( environment.urlFinal +'efacture/chiffreStringg/' +login);
  }
}
