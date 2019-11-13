import { ReportPurchaseDetailComponent } from './report-purchase-detail/report-purchase-detail.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// import { AuthGuardService } from './../../services/auth-guard.service';

import { MainPageComponent } from './main-page/main-page.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AboutComponent } from './about/about.component';
import { LayoutComponent } from './layout/layout.component';
import { UserComponent } from './user/user.component';
import { PreferenceComponent } from './preference/preference.component';
import { RequisitionComponent } from './requisition/requisition.component';
import { StockComponent } from './stock/stock.component';
import { WardComponent } from './ward/ward.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { RequisitionDetailComponent } from './requisition-detail/requisition-detail.component';
import { ReportPurchaseComponent } from './report-purchase/report-purchase.component';

const routes: Routes = [
  {
    path: 'main',
    component: LayoutComponent,
    // canActivate: [AuthGuardService],
    children: [
      { path: '', redirectTo: 'main', pathMatch: 'full' },
      { path: 'main', component: MainPageComponent },
      { path: 'user', component: UserComponent },
      { path: 'preference', component: PreferenceComponent },
      { path: 'about', component: AboutComponent },
      { path: 'requisition', component: RequisitionComponent },
      { path: 'requisition-detail', component: RequisitionDetailComponent },
      { path: 'stock', component: StockComponent },
      { path: 'ward', component: WardComponent },
      { path: 'purchase', component: PurchaseComponent },
      { path: 'report-purchase', component: ReportPurchaseComponent },
      { path: 'report-purchase-detail/:purchaseId', component: ReportPurchaseDetailComponent },
      { path: '**', component: PageNotFoundComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
