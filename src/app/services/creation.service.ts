import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CreationService {
  comptemarchand: any;

  constructor(private http: HttpClient) {}
}
