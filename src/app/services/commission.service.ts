import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Commission } from '../model/commission.model';

@Injectable({
  providedIn: 'root',
})
export class CommissionService {
  private urlServeurApi = environment.urlFinal + '/efacture';
  constructor(private http: HttpClient) {}

  public postCommission(data: Commission): Observable<any> {
    return this.http.post<any>(
      `${this.urlServeurApi}/commission/addCommission`,
      data
    );
  }

  public getCommission(): Observable<Commission[]> {
    return this.http.get<any>(`${this.urlServeurApi}/commission/list`);
  }

  public updateCommission(data: Commission): Observable<Commission> {
    return this.http.put<Commission>(
      `${this.urlServeurApi}/commission/modifier`,
      data
    );
  }
  public detailCommission(id: string): Observable<Commission> {
    return this.http.get<Commission>(
      `${this.urlServeurApi}/commission/detailUser/${id}`
    );
  }
  public getCommissionById(id: number): Observable<Commission> {
    return this.http.get<Commission>(
      `${this.urlServeurApi}/commission/detailUser/${id}`
    );
  }
  public deleteCommission(id: number): Observable<Commission> {
    return this.http.delete<Commission>(
      `${this.urlServeurApi}/commission/supprimer/${id}`
    );
  }
  public getrecherchecommission(
    facturier: string,
    libelle: string
  ): Observable<Commission> {
    return this.http.get<Commission>(
      `${this.urlServeurApi}/commission/consulteCommission?facturier=${facturier}&libelle=${libelle}`
    );
  }
}
