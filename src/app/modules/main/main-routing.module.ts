import { WeightInHosComponent } from './weight-in-hos/weight-in-hos.component';
import { WeightComponent } from './weight/weight.component';
import { WithdrawHistoryDetailComponent } from './withdraw-history-detail/withdraw-history-detail.component';
import { OverviewWithdrawComponent } from './overview-withdraw/overview-withdraw.component';
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
import { RequisitionDetailAdminComponent } from './requisition-detail-admin/requisition-detail-admin.component';
import { RequisitionBillDetailComponent } from './requisition-bill-detail/requisition-bill-detail.component';
import { OverviewWithdrawDetailComponent } from './overview-withdraw-detail/overview-withdraw-detail.component';
import { WithdrawHistoryComponent } from './withdraw-history/withdraw-history.component';
import { WeightInCompanyComponent } from './weight-in-company/weight-in-company.component';
import { OverviewImportClothComponent } from './overview-import-cloth/overview-import-cloth.component';
import { OverviewImportClothDetailComponent } from './overview-import-cloth-detail/overview-import-cloth-detail.component';
import { ExportClothComponent } from './export-cloth/export-cloth.component';
import { ExportClothDetailComponent } from './export-cloth-detail/export-cloth-detail.component';
import { ExportClothBillComponent } from './export-cloth-bill/export-cloth-bill.component';
import { WithdrawService } from 'src/app/services/withdraw.service';



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
      { path: 'requisition-bill-detail/:requisitionCode', component: RequisitionBillDetailComponent },
      { path: 'requisition-detail-admin', component: RequisitionDetailAdminComponent },
      { path: 'stock', component: StockComponent },
      { path: 'ward', component: WardComponent },
      { path: 'weight', component: WeightComponent },
      { path: 'weight-in-hos/:exportClothCode', component: WeightInHosComponent },
      { path: 'weight-in-company', component: WeightInCompanyComponent },
      { path: 'purchase', component: PurchaseComponent },
      { path: 'report-purchase', component: ReportPurchaseComponent },
      { path: 'overview-withdraw', component: OverviewWithdrawComponent },
      { path: 'overview-import-cloth', component: OverviewImportClothComponent },
      { path: 'overview-import-cloth-detail/:importCode', component: OverviewImportClothDetailComponent },
      { path: 'withdraw-history', component: WithdrawHistoryComponent },
      { path: 'overview-withdraw-detail/:withdrawCode', component: OverviewWithdrawDetailComponent },
      { path: 'withdraw-history-detail/:withdrawCode', component: WithdrawHistoryDetailComponent },
      { path: 'report-purchase-detail/:purchaseId', component: ReportPurchaseDetailComponent },
      { path: 'export-cloth', component: ExportClothComponent },
      { path: 'export-cloth-detail', component: ExportClothDetailComponent },
      { path: 'export-cloth-bill/:exportClothCode', component: ExportClothBillComponent },
      { path: '**', component: PageNotFoundComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
