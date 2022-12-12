import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonComponent } from './common/common.component';
import { BlankComponent } from './blank/blank.component';
import { RouterModule } from '@angular/router';
import { ComponentModule } from '../component/component.module';
import {
  HashLocationStrategy,
  Location,
  LocationStrategy,
} from '@angular/common';

@NgModule({
  declarations: [CommonComponent, BlankComponent],

  exports: [CommonComponent, BlankComponent],

  imports: [CommonModule, RouterModule, ComponentModule],
  providers: [
    Location,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
})
export class LayoutModule {}
