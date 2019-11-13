import { PurchaseService } from 'src/app/services/purchase.service';
import { AlertService } from './../../../services/alert.service';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-report-purchase',
  templateUrl: './report-purchase.component.html',
  styleUrls: ['./report-purchase.component.scss']
})
export class ReportPurchaseComponent implements OnInit {
  purchaseList: any[];
  constructor(
    private purchaseService: PurchaseService
  ) { }

  ngOnInit() {
    this.getPurchase();
  }

  async getPurchase() {
    moment.locale('th');
    try {
      const result: any = await this.purchaseService.getAllPurchase();
      if (result.rows) {
        this.purchaseList = result.rows;
        for(let item of this.purchaseList)
        {
          item.date = moment(item.purchaseDate).format('DD');
          item.month = moment(item.purchaseDate).format('MMMM');
          item.year = moment(item.purchaseDate).add(543, 'years').format('YYYY');
        }
      }
      console.log(this.purchaseList);
    } catch (error) {
      console.log(error);

    }
  }
}
