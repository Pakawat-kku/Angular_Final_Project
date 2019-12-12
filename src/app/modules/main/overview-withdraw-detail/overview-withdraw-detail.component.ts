import { AlertService } from './../../../services/alert.service';
import { WithdrawService } from './../../../services/withdraw.service';
import { RequisitionService } from './../../../services/requisition.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';


@Component({
  selector: 'app-overview-withdraw-detail',
  templateUrl: './overview-withdraw-detail.component.html',
  styleUrls: ['./overview-withdraw-detail.component.scss']
})
export class OverviewWithdrawDetailComponent implements OnInit {
  withdrawCode: any;
  modalShow = false;
  withdrawList: any[];
  reqDetailList: any[];
  remain: any;
  statusRemain: any;
  date: string;
  time: any;
  rows: any = [];


  constructor(
    private withdrawService: WithdrawService,
    private requisitonService: RequisitionService,
    private alertService: AlertService,
    private _Activatedroute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    moment.locale('th');
    this.withdrawCode = this._Activatedroute.snapshot.paramMap.get('withdrawCode');
    console.log('withdrawCode', this.withdrawCode);
    this.getWithdraw();
    this.time = moment().add(543, 'years').format('DD MMMM YYYY');
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

  async onSave() {
    const decision: any = await this.alertService.confirm('ยืนยันการทำรายการ ?');
    if (decision.value) {
      const data: any = [];
      console.log('list', this.reqDetailList);
      for (const row of this.reqDetailList) {
        row.remain = row.amountCloth - row.amountClothWithdraw;
        if (row.remain > 0) { row.statusRemain = '1'; }
        if (row.remain === 0) {
          row.statusRemain = '0';
        } else { this.remain = false; }
      }
      if (this.remain === false) {
        const decision2: any = await this.alertService.confirm('มีข้อมูลไม่ถูกต้อง/ยังกรอกไม่ครบ');
        if (decision2.value) {
          for (const row of this.reqDetailList) {
            if (row.remain >= 0) {
              await data.push({
                amountCloth: row.amountClothWithdraw,
                description: this.rows.description,
                Withdraw_withdrawId: this.rows.withdrawId,
                round: this.rows.round,
                Cloth_clothId: row.Cloth_clothId,
                WithdrawDetail_remain: row.remain,
                WithdrawDetail_status_remain: row.statusRemain
              });
            }
          }
          try {
            const result: any = await this.withdrawService.saveWithdrawDetail(data);
            const result1: any = await this.requisitonService.statusWithdrawSuccess(this.rows.Requisition_requisitionCode);
            const result2: any = await this.withdrawService.statusWithdraw(this.rows.withdrawId);
            if (result.statusCode === 200) {
              await this.alertService.success();
              this.modalShow = false;
              await this.getWithdraw();
            }
          } catch (error) {
            console.log(error);
          }
        }
      }
    }
  }


}
