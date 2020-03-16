import { AuthGuard } from './../../services/auth.guard';
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
import { WarehouseComponent } from './warehouse/warehouse.component';
import { AvailableComponent } from './available/available.component';
import { MoveWarehouseComponent } from './move-warehouse/move-warehouse.component';
import { ManagePorterComponent } from './manage-porter/manage-porter.component';
import { ImportClothAmountComponent } from './import-cloth-amount/import-cloth-amount.component';
import { ImportClothAmountHosComponent } from './import-cloth-amount-hos/import-cloth-amount-hos.component';
import { OverviewDamageComponent } from './overview-damage/overview-damage.component';
import { OverviewDamageDetailComponent } from './overview-damage-detail/overview-damage-detail.component';
import { OverviewWithdrawAdminComponent } from './overview-withdraw-admin/overview-withdraw-admin.component';
import { OverviewWithdrawAdminDetailComponent } from './overview-withdraw-admin-detail/overview-withdraw-admin-detail.component';
import { RepairComponent } from './repair/repair.component';
import { RepairDetailComponent } from './repair-detail/repair-detail.component';
import { AuthorityComponent } from './authority/authority.component';
import { MoveWarehouseDetailComponent } from './move-warehouse-detail/move-warehouse-detail.component';
import { MoveWarehouseBillDetailComponent } from './move-warehouse-bill-detail/move-warehouse-bill-detail.component';


// import { WithdrawService } from 'src/app/services/withdraw.service';


const routes: Routes = [
  {
    path: 'main',
    component: LayoutComponent,
    canActivate: [AuthGuard],
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
      { path: 'authority', component: AuthorityComponent },
      { path: 'ward', component: WardComponent },
      { path: 'repair', component: RepairComponent },
      { path: 'repair-detail/:clothId', component: RepairDetailComponent },
      { path: 'weight', component: WeightComponent },
      { path: 'weight-in-hos/:exportClothCode', component: WeightInHosComponent },
      { path: 'weight-in-company', component: WeightInCompanyComponent },
      { path: 'purchase', component: PurchaseComponent },
      { path: 'report-purchase', component: ReportPurchaseComponent },
      { path: 'overview-withdraw', component: OverviewWithdrawComponent },
      { path: 'overview-withdraw-admin', component: OverviewWithdrawAdminComponent },
      { path: 'overview-withdraw-admin-detail/:withdrawCode', component: OverviewWithdrawAdminDetailComponent },
      { path: 'overview-damage', component: OverviewDamageComponent },
      { path: 'overview-damage-detail/:clothId', component: OverviewDamageDetailComponent },
      { path: 'overview-import-cloth', component: OverviewImportClothComponent },
      { path: 'overview-import-cloth-detail/:importCode', component: OverviewImportClothDetailComponent },
      { path: 'withdraw-history', component: WithdrawHistoryComponent },
      { path: 'overview-withdraw-detail/:withdrawCode', component: OverviewWithdrawDetailComponent },
      { path: 'withdraw-history-detail/:withdrawCode', component: WithdrawHistoryDetailComponent },
      { path: 'report-purchase-detail/:purchaseId', component: ReportPurchaseDetailComponent },
      { path: 'export-cloth', component: ExportClothComponent },
      { path: 'export-cloth-detail', component: ExportClothDetailComponent },
      { path: 'import-cloth-amount/:importClothCode', component: ImportClothAmountComponent },
      { path: 'import-cloth-amount-hos/:importClothCode', component: ImportClothAmountHosComponent },
      { path: 'export-cloth-bill/:exportClothCode', component: ExportClothBillComponent },
      { path: 'warehouse', component: WarehouseComponent },
      { path: 'available', component: AvailableComponent },
      { path: 'move-warehouse', component: MoveWarehouseComponent },
      { path: 'move-warehouse-detail', component: MoveWarehouseDetailComponent },
      { path: 'move-warehouse-bill-detail/:warehouse_export_availableCode', component: MoveWarehouseBillDetailComponent },
      { path: 'manage-porter', component: ManagePorterComponent },
      { path: '**', component: PageNotFoundComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
