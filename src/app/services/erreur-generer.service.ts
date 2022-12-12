import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { erreur } from '../model/erreur_genere.model';

@Injectable({
  providedIn: 'root',
})
export class ErreurGenererService {
  private urlServeurApi = environment.urlFinal + '/efacture';

  constructor(private http: HttpClient) {}

  public getErreurGenerer(): Observable<erreur[]> {
    return this.http.get<any>(`${this.urlServeurApi}/erreurs/list`);
  }
  public addErreurGenerer(data: object): Observable<any> {
    return this.http.post<any>(
      `${this.urlServeurApi}/erreurs/addErreurs`,
      data
    );
  }

  public rechercheErreur(
    firstDate: Date,
    lastDate: Date,
    login: string,
    methode: string
  ): Observable<erreur> {
    const rechercheErreur = this.http.get<erreur>(
      `${this.urlServeurApi}/erreurs/rechercheErreur?firstDate=${firstDate}&lastDate=${lastDate}&login=${login}&methode=${methode}`
    );
    if (firstDate == null || lastDate == null) {
      return new Observable();
    } else {
      return rechercheErreur;
    }
  }

  public rechercheByDateBetween(
    firstDate: string,
    lastDate: string
  ): Observable<erreur> {
    return this.http.get<erreur>(
      `${this.urlServeurApi}/erreurs/rechercheByPeriode?firstDate=${firstDate}&lastDate=${lastDate}`
    );
  }
  public rechercheLoginMethode(
    login: string,
    methode: string
  ): Observable<erreur> {
    return this.http.get<erreur>(
      `${this.urlServeurApi}/erreurs/rechercheLoginMethode?login=${login}&methode=${methode}`
    );
  }
}
