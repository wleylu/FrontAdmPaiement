import { Comptes } from 'src/app/model/comptes.model';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Comptemarchand } from '../model/comptemarchand.model';

import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RechercheByNom } from '../model/recherche.model';
import { Commission } from '../model/commission.model';
import { User } from '../model/user.model';
import { MessageStatut } from '../model/messageStatut.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private urlServeurApi = environment.urlFinal + '/efacture';

  private urlServeurSignaletique =
    environment.urlFinal + '/template/signalitique';
    // private urlServeurSignaletique =
    // environment.urlFinalsignal + '/signalitique';

  constructor(private http: HttpClient) {}

  public getsignalitique(client: string): Observable<Comptemarchand> {
    return this.http.get<Comptemarchand>(
      `${this.urlServeurSignaletique}/${client}`
    );
  }

  public getMachandByRacine(racine: string): Observable<Comptemarchand> {
    return this.http.get<any>(
      `${this.urlServeurApi}/cm/admin/marchand/${racine}`
    );
  }
  public getMachandByLogin(login: string): Observable<Comptemarchand> {
    return this.http.get<any>(
      `${this.urlServeurApi}/cm/admin/marchandByLogin?login=${login}`
    );
  }
  public getByMarchandByMail(email: string): Observable<string> {
    return this.http.get<any>(
      `${this.urlServeurApi}/cm/admin/getByMarchandByMail/${email}`
    );
  }

  public getrecherchenomlogin(
    refTransaction: string,nom: string,login: string
  ): Observable<any> {
    return this.http.get<any>(
      `${this.urlServeurApi}/cm/admin/consultation?refTransaction=${refTransaction}&nom=${nom}&login=${login}`
    );
  }

  public getrecherchenom(nom: string,
  ): Observable<any> {
    return this.http.get<any>(
      `${this.urlServeurApi}/cm/admin/marchandByNom?nom=${nom}`
    );
  }


  public getCompteMarchand(): Observable<Comptemarchand[]> {
    return this.http.get<any>(`${this.urlServeurApi}/cm/admin/marchands`);
  }
  //---------------------------------- API AJOUTER COMPTEMARCHAND
  public postComptemarchand(data: any): Observable<any> {
    return this.http.post<any>(
      `${this.urlServeurApi}/cm/admin/marchandAdd`,
      data
    );
  }
  //----------------------------------API  COMPTE----------------------------------------------//
  public postCompte(client: string, data: Comptes): Observable<any> {
    return this.http.post<any>(
      `${this.urlServeurApi}/cm/${client}/addCompte`,
      data
    );
  }
  public modifierCompte(data: Comptes): Observable<Comptes> {
    return this.http.put<any>(`${this.urlServeurApi}/cm/updateCompte`, data);
  }
  public getComptes(): Observable<Comptes[]> {
    return this.http.get<any>(`${this.urlServeurApi}/comptes/list`);
  }
  //----------------------------------fin API  COMPTE----------------------------------------------//

  public updateComptemarchand(
    data: Comptemarchand
  ): Observable<MessageStatut> {
    return this.http.put<any>(
      `${this.urlServeurApi}/cm/admin/marchandModif`,
      data
    );
  }
  public detailById(id: string): Observable<Comptemarchand> {
    return this.http.get<Comptemarchand>(
      `${this.urlServeurApi}/cm/admin/marchand/${id}`
    );
  }
  public recherchebyEmail(email: string): Observable<Comptemarchand> {
    return this.http.get<Comptemarchand>(
      `${this.urlServeurApi}/cm/admin/recherchebyEmail/${email}`
    );
  }
  public recherchebyTel(tel: string): Observable<Comptemarchand> {
    return this.http.get<Comptemarchand>(
      `${this.urlServeurApi}/cm/admin/recherchebyTel/${tel}`
    );
  }
  public deletedComptemarchand(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.urlServeurApi}/cm/admin/comptesMarchand${id}`
    );
  }

  public detailUser(login: string): Observable<User> {
    return this.http.get<User>(`${this.urlServeurApi}/detailUser/${login}`);
  }

  public getCommissionByClient(client: string): Observable<Commission[]> {
    return this.http.get<any>(
      `${this.urlServeurApi}/cm/admin/getcommissionbyclient/${client}`
    );
  }

  /*------------------------------------------------- API COMMISSION------------------------------------------------------------- */
  public listCommission(): Observable<Commission[]> {
    return this.http.get<any>(`${this.urlServeurApi}/commission/list`);
  }
  /*-------------------------------------------------FIN API COMMISSION------------------------------------------------------------- */
}
