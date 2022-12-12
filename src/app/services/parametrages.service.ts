import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Plafond, TypePaiement } from '../model/parametrages';

@Injectable({
  providedIn: 'root',
})
export class ParametragesService {
  private urlServeurApi = environment.urlFinal + '/efacture';
  constructor(private http: HttpClient) {}

  public postPlafond(data: Plafond): Observable<Plafond> {
    return this.http.post<any>(
      `${this.urlServeurApi}/plafond/plafondAdd`,
      data
    );
  }

  public getPlafond(): Observable<Plafond[]> {
    return this.http.get<any>(`${this.urlServeurApi}/plafond/list`);
  }

  public plafondUpdate(data: Plafond): Observable<Plafond> {
    return this.http.put<Plafond>(
      `${this.urlServeurApi}/plafond/plafondUpdate`,
      data
    );
  }
  public detailplafond(id: number): Observable<Plafond> {
    return this.http.get<Plafond>(`${this.urlServeurApi}/plafond/${id}`);
  }

  public postTypePaie(data: TypePaiement): Observable<any> {
    return this.http.post<any>(`${this.urlServeurApi}/typePaieAdd`, data);
  }

  public getTypePaie(): Observable<TypePaiement[]> {
    return this.http.get<any>(`${this.urlServeurApi}/type/typePaie`);
  }

  public modifiertypePaie(data: TypePaiement): Observable<TypePaiement> {
    return this.http.put<TypePaiement>(
      `${this.urlServeurApi}/type/updatetypePaie`,
      data
    );
  }
  public detailtypePaie(id: number): Observable<TypePaiement> {
    return this.http.get<TypePaiement>(
      `${this.urlServeurApi}/type/typePaie/${id}`
    );
  }
  public plafondType(id: number): Observable<TypePaiement> {
    return this.http.get<TypePaiement>(
      `${this.urlServeurApi}/type/plafondType/${id}`
    );
  }
  public getTypePaye(type: number): Observable<TypePaiement[]> {
    return this.http.get<any>(
      `${this.urlServeurApi}/type/rechercheType/${type}`
    );
  }
}
