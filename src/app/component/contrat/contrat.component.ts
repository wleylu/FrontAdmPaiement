import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as html2pdf from 'html2pdf.js';
import { ApiService } from 'src/app/services/api.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-contrat',
  templateUrl: './contrat.component.html',
  styleUrls: ['./contrat.component.scss'],
})
export class ContratComponent implements OnInit {
  c: any;
  mydate = Date.now();
  UserLogin : any;
  infoMarchand : any;
  comptes: any;
  constructor(private router: Router,
    private shared : SharedService,
    private api: ApiService) {}

  ngOnInit(): void {

    this.UserLogin = this.shared.getData();
    //alert(this.UserLogin);
    if(this.UserLogin == null || this.UserLogin == undefined || this.UserLogin == ''){
      this.router.navigate(['/app/compteconnexion']);
    }
    this.DetailMarchand();
  }


  DetailMarchand(){
    this.api.detailById(this.shared.getData()).subscribe((marchand)=>{
      this.infoMarchand =  marchand;
      console.log(JSON.stringify(this.infoMarchand))

      var c;
      this.comptes = this.infoMarchand.comptes;
      console.log(this.comptes)
      for(c in this.infoMarchand){
        console.log(this.comptes[c].compte)
      }

    })
  }

  exportPdf() {
    const options = {
      filename: 'CONTRAT_EFACTURE' + this.UserLogin,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {scale : 2},
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    };
    const content = document.getElementById('export');

    if (html2pdf().from(content).set(options).save()) {
      this.router.navigate(['/app/compteconnexion']);
    }
  }
}
