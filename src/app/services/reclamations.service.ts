import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Reclamations } from '../model/reclamations';

@Injectable({
  providedIn: 'root',
})
export class ReclamationsService {
  private urlServeurApi = environment.urlFinal + '/efacture';
  constructor(private http: HttpClient) {}

  public listeReclamation(): Observable<Reclamations[]> {
    return this.http.get<any>(
      `${this.urlServeurApi}/reclamation/listeReclamantion`
    );
  }
  public rechercheReclamation(
    firstDate: Date,
    lastDate: Date,
    login: string,
    nom: string,
    facturier: string,
    reference: string
  ): Observable<Reclamations> {
    const rechercheReclamations = this.http.get<Reclamations>(
      `${this.urlServeurApi}/reclamation/rechercheReclamation?firstDate=${firstDate}&lastDate=${lastDate}&login=${login}&nom=${nom}&facturier=${facturier}&reference=${reference}`
    );
    if (firstDate == null || lastDate == null) {
      return new Observable();
    } else {
      return rechercheReclamations;
    }
  }
  public getReclamation(
    login: string,
    nom: string,
    facturier: string,
    reference: string
  ): Observable<Reclamations> {
    const rechercheReclamations = this.http.get<Reclamations>(
      `${this.urlServeurApi}/reclamation/getReclamation?login=${login}&nom=${nom}&facturier=${facturier}&reference=${reference}`
    );
    return rechercheReclamations;
  }

  public infoUser(login: any): Observable<any> {
    return this.http.get<any>(`${this.urlServeurApi}/detailUser/${login}`);
  }
}
