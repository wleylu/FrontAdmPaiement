import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  data! : string;

  constructor() { }

  setData(valeur: string){
    this.data= valeur;
  }

  getData(){
    return this.data
  }
}
