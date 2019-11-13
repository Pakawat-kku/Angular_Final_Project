import { PurchaseService } from 'src/app/services/purchase.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-report-purchase-detail',
  templateUrl: './report-purchase-detail.component.html',
  styleUrls: ['./report-purchase-detail.component.scss']
})
export class ReportPurchaseDetailComponent implements OnInit {
  purchaseId: any;
  date: string;
  month: string;
  year: string;
  purchaseDetailList: any[];
  constructor(
    private _Activatedroute: ActivatedRoute,
    private _router: Router,
    private purchaseService: PurchaseService) { }

  ngOnInit() {
    moment.locale('th');
    this.purchaseId = this._Activatedroute.snapshot.paramMap.get('purchaseId');
    console.log('id-pass', this.purchaseId);
    this.getPurchaseDetail();
  }

  async getPurchaseDetail() {
    try {
      const purchase: any = await this.purchaseService.getPurchaseById(this.purchaseId);
      if (purchase.rows) {
        this.date = moment(purchase.rows[0].purchaseDate).format('DD');
        this.month = moment(purchase.rows[0].purchaseDate).format('MMMM');
        this.year = moment(purchase.rows[0].purchaseDate).add(543, 'years').format('YYYY');
        console.log('date', this.date, this.month, this.year);
      }
      const result: any = await this.purchaseService.getPurchaseDetailById(this.purchaseId);
      if (result.rows) {
        this.purchaseDetailList = result.rows;
        console.log('list', this.purchaseDetailList);
      }
    } catch (error) {
      console.log(error);
    }
  }

}
