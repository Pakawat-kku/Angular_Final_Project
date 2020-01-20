import { AlertService } from './../../../services/alert.service';
import { WithdrawService } from './../../../services/withdraw.service';
import { RequisitionService } from './../../../services/requisition.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { Users } from '../register/users';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/services/Authentication.service';
import * as jwt_decode from 'jwt-decode';
import * as _ from 'lodash';

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
  round: any;
  collapsed = true;
  currentUser: Users;
  currentUserSubscription: Subscription;
  decoded: any;
  clothRemain = '';
  uncomplete = 0;
  over = 0;
  clothOver = '';


  constructor(
    private authenticationService: AuthenticationService,
    private withdrawService: WithdrawService,
    private requisitonService: RequisitionService,
    private alertService: AlertService,
    private _Activatedroute: ActivatedRoute,
    private router: Router
  ) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(users => {
      this.currentUser = users;
      this.decoded = jwt_decode(users.token);
    });
  }

  ngOnInit() {
    moment.locale('th');
    this.withdrawCode = this._Activatedroute.snapshot.paramMap.get('withdrawCode');
    // console.log('withdrawCode', this.withdrawCode);
    this.getWithdraw();
    this.time = moment().add(543, 'years').format('DD MMMM YYYY');
    // console.log(this.decoded.userId);
  }

  async getWithdraw() {
    try {
      const result: any = await this.withdrawService.getWithdrawByCode(this.withdrawCode);
      if (result.rows) {
        this.withdrawList = result.rows;
        for (const item of this.withdrawList) {
          item.reqTime = moment(item.reqDate).format('HH:mm');
          item.reqDate = moment(item.reqDate).add(543, 'years').format('DD MMMM YYYY');
          item.totalRound += 1;
          this.round = item.totalRound;
        }
        this.date = moment(result.rows[0].withdrawDate).add(543, 'years').format('DD MMMM YYYY');
      }
      // console.log('withdrawList', this.withdrawList);
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
        console.log('reqDetailList ', this.reqDetailList);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async onSave() {
    const decision: any = await this.alertService.confirm('ยืนยันการทำรายการ ?');
    if (decision.value) {
      const data: any = [];
      this.clothRemain = '';
      this.clothOver = '';
      this.uncomplete = 0;
      this.over = 0;
      console.log('list', this.reqDetailList);
      for (const row of this.reqDetailList) {
        row.remain = row.amountCloth - row.amountClothWithdraw;
        // ค้างส่ง
        if (row.remain > 0) {
          row.statusRemain = '1';
          if (this.uncomplete === 0) {
            this.clothRemain = this.clothRemain + row.clothName;
          } else {
            this.clothRemain = this.clothRemain + ', ' + row.clothName;
          }
          this.uncomplete += 1;
          // ส่งครบ
        } else if (row.remain === 0) {
          row.statusRemain = '0';
          // ส่งเกิน
        } else {
          if (this.over === 0) {
            this.clothOver = this.clothOver + row.clothName;
          } else {
            this.clothOver = this.clothOver + ', ' + row.clothName;
          }
          this.over += 1;
        }
      }
      if (this.over > 0) {
        const decision2: any = await this.alertService.error('จำนวน' + this.clothOver + 'เกินจำนวนที่เบิก');
      } else if (this.uncomplete > 0) {
        const decision2: any = await this.alertService.confirm('จำนวน' + this.clothRemain + 'ไม่ครบตามจำนวนที่เบิก');
        if (decision2.value) {
          this.remain = true;
        }
      }
      if (this.over === 0 && this.remain === true) {
        for (const row of this.reqDetailList) {
          await data.push({
            amountCloth: row.amountClothWithdraw,
            description: this.rows.description,
            Withdraw_withdrawId: this.rows.withdrawId,
            round: this.round,
            Cloth_clothId: row.Cloth_clothId,
            WithdrawDetail_remain: row.remain,
            WithdrawDetail_status_remain: row.statusRemain,
            Users_userId: this.decoded.userId
          });
        }
        try {
          const result: any = await this.withdrawService.saveWithdrawDetail(data);
          const result1: any = await this.requisitonService.statusWithdrawSuccess(this.rows.Requisition_requisitionCode);
          const result2: any = await this.withdrawService.statusWithdraw(this.rows.withdrawId);
          const result3: any = await this.withdrawService.updateRound(this.round, this.rows.withdrawId);
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

