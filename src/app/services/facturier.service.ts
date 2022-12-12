import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { Facturier } from '../model/facturier';

@Injectable({
  providedIn: 'root',
})
export class FacturierService {
  private urlServeurApi = environment.urlFinal + '/efacture';
  constructor(private http: HttpClient) {}
  public getFacturier(): Observable<Facturier[]> {
    return this.http.get<any>(`${this.urlServeurApi}/facturier/Allfacturier`);
  }

  public ajouterFacturier(data: Facturier): Observable<Facturier> {
    return this.http.post<any>(
      `${this.urlServeurApi}/facturier/Addfacturier`,
      data
    );
  }
}
