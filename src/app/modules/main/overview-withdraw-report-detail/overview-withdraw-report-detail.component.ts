import { StockService } from 'src/app/services/stock.service';
import { WithdrawService } from 'src/app/services/withdraw.service';
import { Component, OnInit, Input } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-overview-withdraw-report-detail',
  templateUrl: './overview-withdraw-report-detail.component.html',
  styleUrls: ['./overview-withdraw-report-detail.component.scss']
})
export class OverviewWithdrawReportDetailComponent implements OnInit {
  @Input()
  row: any;
  detailList: any = [];
  constructor(
    private withdrawService: WithdrawService,
    private alertService: AlertService,
    private stockService: StockService
  ) { }

  async ngOnInit() {
    await this.getDetail();
  }

  async getDetail() {
    this.detailList = [];
    try {
      const result: any = await this.withdrawService.searchByDateDetail(this.row.Ward_wardId);
      console.log(result.rows);
      if (result.rows) {
        let num = 0;
        for (const item of result.rows) {
          // console.log(item.amountCloth);
          // item.amountCloth += 0;
          if (item.amountCloth) {
            console.log('k');
            if (_.findIndex(this.detailList, ['Cloth_clothId', item.Cloth_clothId]) < 0) {
              this.detailList.push({
                Cloth_clothId: item.Cloth_clothId,
                amountCloth: item.amountCloth
              });
            } else {
              num = _.findIndex(this.detailList, ['Cloth_clothId', item.Cloth_clothId]);
              this.detailList[num].amountCloth = this.detailList[num].amountCloth + item.amountCloth;
            }
          } else {
            console.log('p');
            
          }
        }
        num = 0;
        for (const item of this.detailList) {
            const result1: any = await this.stockService.getClothById(item.Cloth_clothId);
            num = _.findIndex(this.detailList, ['Cloth_clothId', item.Cloth_clothId]);
            item.clothName = result1.rows[0].clothName;
        }
        console.log(this.detailList);
      }
    } catch (error) {
      console.log(error);
    }
  }

}
