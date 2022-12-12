import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Audit } from '../model/audit.model';

@Injectable({
  providedIn: 'root',
})
export class AuditConnexionService {
  private urlServeurApi = environment.urlFinal + '/efacture';
  constructor(private http: HttpClient) {}

  public getAudit(): Observable<Audit[]> {
    return this.http.get<any>(`${this.urlServeurApi}/audit/userAudit`);
  }
  public getrecherchelogin(login: string): Observable<Audit> {
    return this.http.get<Audit>(
      `${this.urlServeurApi}/audit/rechercheLogin?login=${login}`
    );
  }

  public getrecherchestatut(statut: string): Observable<Audit> {
    return this.http.get<Audit>(
      `${this.urlServeurApi}/audit/rechercheStatut?statut=${statut}`
    );
  }
  public getrechercheAdit(
    firstDate: Date,
    lastDate: Date,
    login: string,
    nom: string,

    statut: string
  ): Observable<Audit> {
    const rechercheAudit = this.http.get<Audit>(
      `${this.urlServeurApi}/audit/rechercheAdit?firstDate=${firstDate}&lastDate=${lastDate}&login=${login}&nom=${nom}&statut=${statut}`
    );
    // if (firstDate == null || lastDate == null) {
    //   return new Observable();
    // } else {
      return rechercheAudit;
    //}
  }
  public rechercheAudit(
    login: string,
    nom: string,
    role: string,
    statut: string
  ): Observable<Audit> {
    const rechercheAudit = this.http.get<Audit>(
      `${this.urlServeurApi}/audit/rechercheAudit?login=${login}&nom=${nom}&role=${role}&statut=${statut}`
    );
    return rechercheAudit;
  }
  public rechercheByDateBetween(
    firstDate: Date,
    lastDate: Date
  ): Observable<Audit> {
    return this.http.get<Audit>(
      `${this.urlServeurApi}/audit/rechercheByDateBetween?firstDate=${firstDate}&lastDate=${lastDate}`
    );
  }

  public rechercheNodate(
    login: string,
    nom: string,
    //role: string,
    statut: string
  ): Observable<Audit> {
    return  this.http.get<Audit>(
      `${this.urlServeurApi}/audit/rechercheNodate?login=${login}&nom=${nom}&statut=${statut}`
    );
  }
}
