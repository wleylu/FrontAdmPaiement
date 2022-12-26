import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Agence } from '../model/agence.model';
import { Comptemarchand } from '../model/comptemarchand.model';
import { Filiale } from '../model/filiale.model';
import { Mail } from '../model/mail.model';
import { User } from '../model/user.model';

@Injectable({
  providedIn: 'root',
})
export class CreationcompteService {
  private urlServeurApi = environment.urlFinal + '/efacture';
  private urlServeurApiuser = environment.urlFinal;
  private urlMail = environment.urlFinal + '/efacture/mails/email';
 private smsUrl = 'https://10.181.100.117:8443/AMobile/';
  constructor(private http: HttpClient) {}

  /*
  public getCompteuser():Observable<User[]> {
    return this.http.get<any>(`${this.springServeurApi}/utilisateur/liste`);
}

public postCompteuser(data:User):Observable<User> {
  return this.http.post<User>(`${this.springServeurApi}/utilisateur/ajouter`,data)
}

public updateCompteuser(data:User, id:number):Observable<User> {
  return this.http.post<User>(`${this.springServeurApi}/utilisateur/modifier/${id}`,data)
}

public deletedCompteuser(id:number):Observable<void> {
  return this.http.delete<void>(`${this.springServeurApi}/utilisateur/supprimer/${id}`)
} */

  public getsignaletiqueUser(client: string): Observable<User> {
    return this.http.get<User>(
      `${this.urlServeurApi}/cm/admin/marchand/${client}`
    );
  }

  public getMarchand(idBenef: number): Observable<Comptemarchand> {
    return this.http.get<Comptemarchand>(
      `${this.urlServeurApi}/cm/admin/marchand/${idBenef}`
    );
  }

  public detailUser(login: string): Observable<User> {
    return this.http.get<User>(`${this.urlServeurApi}/detailUser/${login}`);
  }
  public getUserByMail(email: string): Observable<User> {
    return this.http.get<User>(
      `${this.urlServeurApi}/rechercheUserEmail/${email}`
    );
  }
  public getUserByTel(tel: string): Observable<User> {
    return this.http.get<User>(
      `${this.urlServeurApi}/user/rechercheUserTel/${tel}`
    );
  }
  public getUtilisateurByMail(email: string): Observable<User> {
    return this.http.get<User>(
      `${this.urlServeurApi}/user/getByUserByMail/${email}`
    );
  }
  public getsignaletiqueMarchand(client: string): Observable<Comptemarchand> {
    return this.http.get<Comptemarchand>(
      `${this.urlServeurApi}/user/admin/marchand/${client}`
    );
  }

  public getCompteuser(): Observable<User[]> {
    return this.http.get<any>(`${this.urlServeurApi}/user/utilisateur/liste`);
  }


/*   public listeUserByProfilMarchand(agenceId : number,login: string): Observable<User[]> {
    return this.http.get<any>(
      `${this.urlServeurApi}/user/listeValidationBack/${agenceId}/${login}`
    );
  } */


  public listeUserByProfilMarchand(): Observable<User[]> {
    return this.http.get<any>(
      `${this.urlServeurApi}/user/listeValidationBack`
    );
  }

  // public listeUserByProfilMarchand(login: string): Observable<User[]> {
  //   return this.http.get<any>(
  //     `${this.urlServeurApi}/user/utilisateur/listeUserByProfilMarchand/${login}`
  //   );
  // }

  public listeUserByProfilBackOffice(): Observable<User[]> {
    return this.http.get<any>(
      `${this.urlServeurApi}/user/utilisateur/listeUserProfilBackOffice`
    );
  }
  public postCompteuser(data: User): Observable<any> {
    return this.http.post<any>(
      `${this.urlServeurApi}/user/admin/utilisateur/ajouter`,
      data
    );
  }
  public postRegister(data: User): Observable<any> {
    return this.http.post<any>(`${this.urlServeurApiuser}/user/register`, data);
  }
  public updateCompteuser(data: User): Observable<User> {
    return this.http.put<User>(
      `${this.urlServeurApi}/user/admin/utilisateur/modifier`,
      data
    );
  }

  public deletedCompteuser(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.urlServeurApi}/user/utilisateur/supprimer/${id}`
    );
  }

  public getrecherche(nom: string): Observable<User> {
    return this.http.get<User>(
      `${this.urlServeurApi}/user/rechercheUserNom/?nom=${nom}`
    );
  }

  public getrecherchelogin(login: string): Observable<User> {
    return this.http.get<User>(
      `${this.urlServeurApi}/user/rechercheLogin/?login=${login}`
    );
  }


  public getrecherchenomlogin(
   nom: string, login: string
  ): Observable<any> {
    return this.http.get<any>(
      `${this.urlServeurApi}/user/rechercheUserNomLogin?nom=${nom}&login=${login}`
    );
  }

  public mails(data: Mail): Observable<Mail> {
    return this.http.post<any>('10.100.10.12:1999/ModuleEmail/api/mails', data);
  }

  EnvoiMail(info: Object): Observable<Object> {
    return this.http.post(`${this.urlMail}`, info);
  }

  public getAgence(): Observable<Agence[]> {
    return this.http.get<any>(`${this.urlServeurApi}/agence/listAgence`);
  }

  public getFiliale(): Observable<Filiale[]> {
    return this.http.get<any>(`${this.urlServeurApi}/filiale/listFiliale`);
  }

  public smsSend(to : any, content: any) : Observable<any>{
    return this.http.get<any>(
      `${this.smsUrl}send?username=adminanet&password=admanet321&from=BACI-SMS&to=${to}&content=${content}&filiale=BACI`)
  }

  public testSms(numero :string, message : string){
    return this.http.get<any>(
      `${this.urlServeurApiuser}/Api/envoisms?numero=${numero}&message=${message}`
    );
  }

  public decriptPwd(login:any): Observable<any>{
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    const requestOptions: Object = {
      headers: headers,
      responseType: 'text'
    }
    return this.http.get<any>( `${this.urlServeurApi}/chiffreStringg/${login}`, requestOptions);
  }


  public generatePwd(): Observable<any>{
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    const requestOptions: Object = {
      headers: headers,
      responseType: 'text'
    }
    return this.http.get<any>( `${this.urlServeurApi}/generermdp`, requestOptions);
  }

  public decrypt(pass : any): Observable<any>{
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    const requestOptions: Object = {
      headers: headers,
      responseType: 'text'
    }
    return this.http.get<any>( `${this.urlServeurApi}/decrypter?pass=${pass}`, requestOptions);
  }

  public AgenceId(id : any):Observable<any>{
    return this.http.get<any>( `${this.urlServeurApi}/agence/recherche/${id}`);
  }
}
