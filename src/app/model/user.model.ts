import { Agence } from "./agence.model";
import { Filiale } from "./filiale.model";

/* import { role } from "./roles.model"; */
export class User{

  id!: number;
  login!: string;
  password!: string;
  password1!: string;
  password2!: string;
  nom!:string;
  prenom!:string;
  email!:string;
  tel!:string;
  habilitation!: string;
  validation!:number;
  status!: number;
  bloquser!:number;
  dateCreation!:Date;
  client!: string;
  adCm!: string;

  mdpOublie!: string;
  typePlafond!:number;
  typeComfirmation!:number;
  reinitialiser!:boolean;
  tentative!:number;
  loginAdd ! : string;
  loginMaj ! :string;
  filiale ! : Filiale;
  agence! : Agence;
  dateMdp! : Date;
//   visibilite!: boolean;


}
