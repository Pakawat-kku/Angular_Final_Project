import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { MyDatePickerTHModule } from 'mydatepicker-th';
import { Select2Module } from 'ng2-select2';

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
import { RequisitionDetailComponent } from './requisition-detail/requisition-detail.component';
import { ReportPurchaseComponent } from './report-purchase/report-purchase.component';
import { ReportPurchaseDetailComponent } from './report-purchase-detail/report-purchase-detail.component';
import { OverviewWithdrawComponent } from './overview-withdraw/overview-withdraw.component';
import { OverviewWithdrawDetailComponent } from './overview-withdraw-detail/overview-withdraw-detail.component';
import { RequisitionDetailAdminComponent } from './requisition-detail-admin/requisition-detail-admin.component';
import { RequisitionBillDetailComponent } from './requisition-bill-detail/requisition-bill-detail.component';
import { WithdrawHistoryComponent } from './withdraw-history/withdraw-history.component';
import { WithdrawHistoryDetailComponent } from './withdraw-history-detail/withdraw-history-detail.component';
import { WeightComponent } from './weight/weight.component';
import { WeightInCompanyComponent } from './weight-in-company/weight-in-company.component';
import { WeightInHosComponent } from './weight-in-hos/weight-in-hos.component';
import { OverviewImportClothComponent } from './overview-import-cloth/overview-import-cloth.component';
import { OverviewImportClothDetailComponent } from './overview-import-cloth-detail/overview-import-cloth-detail.component';
import { ExportClothComponent } from './export-cloth/export-cloth.component';
import { ExportClothDetailComponent } from './export-cloth-detail/export-cloth-detail.component';
import { ExportClothBillComponent } from './export-cloth-bill/export-cloth-bill.component';
import { WarehouseComponent } from './warehouse/warehouse.component';
import { AvailableComponent } from './available/available.component';
import { MoveWarehouseComponent } from './move-warehouse/move-warehouse.component';
import { ManagePorterComponent } from './manage-porter/manage-porter.component';
@NgModule({
  declarations: [
    MainPageComponent, PageNotFoundComponent,
    AboutComponent, LayoutComponent,
    UserComponent, PreferenceComponent, RequisitionComponent, StockComponent,
    WardComponent, PurchaseComponent, ReportPurchaseComponent,
    ReportPurchaseDetailComponent, OverviewWithdrawComponent, OverviewWithdrawDetailComponent
   ,RequisitionDetailComponent, RequisitionDetailAdminComponent, RequisitionBillDetailComponent,
    WithdrawHistoryComponent, WithdrawHistoryDetailComponent, WeightComponent,
    WeightInCompanyComponent, WeightInHosComponent, OverviewImportClothComponent, OverviewImportClothDetailComponent,
    ReportPurchaseDetailComponent, OverviewWithdrawComponent, OverviewWithdrawDetailComponent,
    RequisitionDetailComponent, RequisitionDetailAdminComponent, RequisitionBillDetailComponent,
    WithdrawHistoryComponent, WithdrawHistoryDetailComponent, ExportClothComponent, ExportClothDetailComponent, ExportClothBillComponent,
    WarehouseComponent, AvailableComponent, MoveWarehouseComponent, ManagePorterComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ClarityModule,
    HelperModule,
    MainRoutingModule,
    Select2Module,
    ReactiveFormsModule,
    MyDatePickerTHModule,

  ]
})
export class MainModule { }
