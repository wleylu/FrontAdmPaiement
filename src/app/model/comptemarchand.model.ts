import { Comptes } from "./comptes.model";
import { Commission } from './commission.model';
import { Agence } from "./agence.model";


export class Comptemarchand {

      id!:number;
      refTransaction!: string;
      codeTransaction!: string;
      valide!: string;
      etatoper!: string;
      client: string = '';
      sexe: string = '';
      nomPrenom: string = '';
      nom: string ='';
      prenom: string = '';
      dateNais: string = '';

      statut!: number;
      typeCpt: string ='';
      numCpt: string ='';
      numCptContribuable: string ='';
      regCrc: string ='';
     // regCrc!: Date;
     // activer!: boolean;
      optionCm!: string;
      montant!: number;


     raisonSocial!: string;
     agec!: string;
     tel!: string;
     autreContact!:string;
     pieceId!: string;
     dateExpir!: string;
     dateDelivr!: string;
     email!:string;
     login!: string;
    // compteChoose!:number;
     adCm!: string;
     dateModification!: Date;
     loginModification!:string;
     dateDesactivation!: Date;
     loginDesactivation!: string;
    dateCreation! : Date;
    comptes!: Comptes[];
    comptesInactif!: Comptes[];
    commission!: any[];
    loginAdd!: string;
    loginMaj!: string;
    agence! : Agence;
    //Idcommission!: number;
    //commission!: number;
     /* int_fact":"CIE",
      */
}
export class City  {
  name: string|any;
  code: string|any
}
// export class Comptemarchand {

//   id!: number;
//   nomCm: string = '';
//   prenomCm: string = '';
//   raison_social: string = '';
//   tel2Cm: string ='';
//   intCe: string = '';
//   tel1Cm: string = '';

//   typeComCm!: number;
//   numCptCm: string ='';
//   numCptComCm: string ='';
//   numCptContCm: string ='';
//   regcrc: string ='';
//   dateCreation!: Date;
//  // activer!: boolean;
//   autre_contact!: string;



//   status!: boolean;
//   login!: string;
//   client!: string;
//   sexe!:string;
//   nomPrenom!: string;
//   nom!: string;
//   prenom!: string;
//   dateNais!:Date;
//   agec!: number;
//   tel!:number;
//   pieceId!: string;
//   dateExpir!: Date;
//   dateDelivr!:Date;
//   email!: string;
//   comptes!: Array<comptes>;
//   compteChoose!: string;
//   adCm : string ='';
//  /* int_fact":"CIE",
//   */
// }
