import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Consultation } from '../model/consultation';

@Injectable({
  providedIn: 'root',
})
export class ConsultationsServiceService implements OnInit {
  private urlServeurApi = environment.urlFinal + '/efacture';

  constructor(private http: HttpClient) {}
  ngOnInit() {}

  public getConsultation(): Observable<Consultation[]> {
    return this.http.get<any>(`${this.urlServeurApi}/consultation/liste`);
  }
  public getrechercheConsultation(
    firstDate: Date,
    lastDate: Date,
    login: string,
    referenceFt: string,
    facturier: string,
    identifiant: string
  ): Observable<Consultation> {
    const recherche = this.http.get<Consultation>(
      `${this.urlServeurApi}/consultation/consultationPaiement?firstDate=${firstDate}&lastDate=${lastDate}&login=${login}&referenceFt=${referenceFt}&facturier=${facturier}&identifiant=${identifiant}`
    );
    if (firstDate == null || lastDate == null) {
      return new Observable();
    } else {
      return recherche;
    }
  }

  public recherche(
    login: string,
    referenceFt: string,
    facturier: string,
    identifiant: string
  ): Observable<Consultation> {
    const recherche = this.http.get<Consultation>(
      `${this.urlServeurApi}/consultation/recherche?login=${login}&referenceFt=${referenceFt}&facturier=${facturier}&identifiant=${identifiant}`
    );
    return recherche;
  }

  public rechercheByDateBetween(
    firstDate: string,
    lastDate: string
  ): Observable<Consultation> {
    return this.http.get<Consultation>(
      `${this.urlServeurApi}/consultation/rechercheTransPeriode?firstDate=${firstDate}&lastDate=${lastDate}`
    );
  }
}
