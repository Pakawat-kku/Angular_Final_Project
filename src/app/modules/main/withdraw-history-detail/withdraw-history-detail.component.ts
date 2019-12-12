import { RequisitionService } from './../../../services/requisition.service';
import { WithdrawService } from './../../../services/withdraw.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-withdraw-history-detail',
  templateUrl: './withdraw-history-detail.component.html',
  styleUrls: ['./withdraw-history-detail.component.scss']
})
export class WithdrawHistoryDetailComponent implements OnInit {
  withdrawCode: any;
  withdrawList: any;
  date: any;
  modalShow = false;
  rows: any = [];
  reqDetailList: any[];
  constructor(
    private _Activatedroute: ActivatedRoute,
    private _router: Router,
    private withdrawService: WithdrawService,
    private requisitonService: RequisitionService
  ) { }

  ngOnInit() {
    this.withdrawCode = this._Activatedroute.snapshot.paramMap.get('withdrawCode');
    console.log('withdrawCode', this.withdrawCode);
    moment.locale('th');
    this.getWithdraw();
  }

  async getWithdraw() {
    try {
      const result: any = await this.withdrawService.getWithdrawByCode(this.withdrawCode);
      if (result.rows) {
        this.withdrawList = result.rows;
        for (const item of this.withdrawList) {
          item.reqTime = moment(item.reqDate).format('HH:mm');
          item.reqDate = moment(item.reqDate).add(543, 'years').format('DD MMMM YYYY');
        }
        this.date = moment(result.rows[0].withdrawDate).add(543, 'years').format('DD MMMM YYYY');
      }
      console.log(this.withdrawList);

    } catch (error) {
      console.log(error);
    }
  }

  async onShow(code) {
    this.modalShow = true;
    this.rows = code;
    try {
      const result: any = await this.requisitonService.showReqWaitDetail(code.Requisition_requisitionCode);
      if (result.rows) {
        this.reqDetailList = result.rows;
      }
    } catch (error) {
      console.log(error);
    }
  }

}
