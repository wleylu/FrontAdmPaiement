import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent implements OnInit {
  title = 'E-facture';

  ngOnInit() {
    this.storageChange();
  }

  public storageChange() {
    window.addEventListener('storage', function (e) {
      var r = e.oldValue;
      var n = e.newValue;

      this.localStorage.clear();
    });
  }
}
