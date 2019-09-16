import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';

import { MainRoutingModule } from './main-routing.module';
import { MainPageComponent } from './main-page/main-page.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AboutComponent } from './about/about.component';
import { LayoutComponent } from './layout/layout.component';
import { UserComponent } from './user/user.component';
import { PreferenceComponent } from './preference/preference.component';
import { HelperModule } from 'src/app/pipes/helpers.module';
import { RequisitionComponent } from './requisition/requisition.component';
import { StockComponent } from './stock/stock.component';

@NgModule({
  declarations: [
    MainPageComponent, PageNotFoundComponent,
    AboutComponent, LayoutComponent,
    UserComponent, PreferenceComponent, RequisitionComponent, StockComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ClarityModule,
    HelperModule,
    MainRoutingModule
  ]
})
export class MainModule { }
