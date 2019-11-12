import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { ReactiveFormsModule } from '@angular/forms';

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
import { WardComponent } from './ward/ward.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { Select2Module } from 'ng2-select2';
import { RequisitionDetailComponent } from './requisition-detail/requisition-detail.component';
import { ReportPurchaseComponent } from './report-purchase/report-purchase.component';

@NgModule({
  declarations: [
    MainPageComponent, PageNotFoundComponent,
    AboutComponent, LayoutComponent,
    UserComponent, PreferenceComponent,
    RequisitionComponent,
    StockComponent, WardComponent,
    PurchaseComponent, ReportPurchaseComponent,
    RequisitionDetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ClarityModule,
    HelperModule,
    MainRoutingModule,
    Select2Module,
    ReactiveFormsModule,

  ]
})
export class MainModule { }
