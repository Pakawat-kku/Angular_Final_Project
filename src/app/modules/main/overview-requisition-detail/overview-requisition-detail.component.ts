import { Component, OnInit, Input } from '@angular/core';
import { RequisitionService } from './../../../services/requisition.service';
import { StockService } from './../../../services/stock.service';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-overview-requisition-detail',
  templateUrl: './overview-requisition-detail.component.html',
  styleUrls: ['./overview-requisition-detail.component.scss']
})
export class OverviewRequisitionDetailComponent implements OnInit {
  @Input()
  user: any;
  loading: boolean;
  requisitionList: any;
  clothIdList: any[] = [];
  num = 0;


  constructor(
    private requisitionService: RequisitionService,
    private stockService: StockService,

  ) { }

  async ngOnInit() {
    this.loading = true;
    // Make the server call
    await this.requisitionByWard();
  }

  async requisitionByWard() {
    console.log(this.user);
    try {
      const result: any = await this.requisitionService.searchByWard(this.user.Ward_wardId, this.user.dateSearch3, this.user.dateSearch4);
      if (result.rows) {
        for (const row of result.rows) {
          row.reqDate = moment(row.reqDate).add(543, 'years').format('DD MMMM YYYY');
        }
      }
      console.log('result.rows', result.rows);

      for (const item of result.rows) {

        if (_.findIndex(this.clothIdList, ['clothId', item.Cloth_clothId]) < 0) {
          this.clothIdList.push({
            clothId: item.Cloth_clothId,
            amount: item.amountClothReal,
          });
        } else {
          this.num = _.findIndex(this.clothIdList, ['clothId', item.Cloth_clothId]);
          this.clothIdList[this.num].amount = this.clothIdList[this.num].amount + item.amountClothReal;
        }
      }

      for (const item of this.clothIdList) {
        const result1: any = await this.stockService.getClothById(item.clothId);
        console.log('result1', result1);

        this.num = _.findIndex(this.clothIdList, ['clothId', item.clothId]);
        item.clothName = result1.rows[0].clothName;
      }

      console.log('this.clothIdList', this.clothIdList);


    } catch (err) {
      console.log(err);
    }
  }
}
