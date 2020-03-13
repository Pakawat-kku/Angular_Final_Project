import { AlertService } from './../../../services/alert.service';
import { WithdrawService } from './../../../services/withdraw.service';
import { RequisitionService } from './../../../services/requisition.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { Users } from '../register/users';
import * as _ from 'lodash';

import * as jwt_decode from 'jwt-decode';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../../services//Authentication.service';
import { UsersAuthorityService } from 'src/app/services/users-authority.service';
@Component({
  selector: 'app-overview-withdraw-admin-detail',
  templateUrl: './overview-withdraw-admin-detail.component.html',
  styleUrls: ['./overview-withdraw-admin-detail.component.scss']
})
export class OverviewWithdrawAdminDetailComponent implements OnInit {
  withdrawCode: any;
  modalShow = false;
  withdrawList: any[];
  withdrawDetailList: any[];
  withdrawRoundList: any[];
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
  roundList: any = [];
  r: any = '';
  authority: any = [];

  constructor(
    private authenticationService: AuthenticationService,
    private withdrawService: WithdrawService,
    private requisitonService: RequisitionService,
    private alertService: AlertService,
    private _Activatedroute: ActivatedRoute,
    private router: Router,
    private users_authorityService: UsersAuthorityService,


    ) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(users => {
      this.currentUser = users;
      this.decoded = jwt_decode(users.token);
    });
  }

  async ngOnInit() {
    const result: any = await this.users_authorityService.getById(this.decoded.userId);
    // console.log('result.rows' , result);
    for (const item of result.rows) {
      if (item.aId === 1) {
        this.authority.one = 'true';
      } if (item.aId === 2) {
        this.authority.two = 'true';
      } if (item.aId === 3) {
        this.authority.three = 'true';
      } if (item.aId === 4) {
        this.authority.four = 'true';
      } if (item.aId === 5) {
        this.authority.five = 'true';
      } if (item.aId === 6) {
        this.authority.six = 'true';
      } if (item.aId === 7) {
        this.authority.seven = 'true';
      } if (item.aId === 8) {
        this.authority.eigth = 'true';
      } if (item.aId === 9) {
        this.authority.nine = 'true';
      } if (item.aId === 10) {
        this.authority.ten = 'true';
      }
    }
    if (this.authority.seven !== 'true') {
      this.alertService.error();
      this.router.navigate(['main/main']);
    } else {
    moment.locale('th');
    this.withdrawCode = this._Activatedroute.snapshot.paramMap.get('withdrawCode');
    // console.log('withdrawCode', this.withdrawCode);
    this.getWithdraw();
    this.time = moment().add(543, 'years').format('DD MMMM YYYY');
    // console.log(this.decoded.userId);
  }
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
    this.round = this.rows.totalRound;
    try {
      const result: any = await this.requisitonService.showReqWaitDetail(code.Requisition_requisitionCode);
      if (result.rows) {
        this.reqDetailList = result.rows;
        console.log(this.reqDetailList);
        if (this.round > 1) {
          // console.log('round', this.round);
          const result1: any = await this.withdrawService.getDetailById(this.rows.withdrawId, this.round - 1);
          const result2: any = await this.withdrawService.getDetailRound(this.rows.withdrawId);
          if (result2.rows) {
            this.withdrawRoundList = result2.rows;
            // console.log(this.withdrawRoundList);
          }
          if (result1.rows) {
            this.withdrawDetailList = result1.rows;
            for (let i = 0; i < this.reqDetailList.length; i++) {
              for (let j = 0; j < this.withdrawDetailList.length; j++) {
                if (this.reqDetailList[i].Cloth_clothId === this.withdrawDetailList[j].Cloth_clothId) {
                  // console.log(this.reqDetailList[i].Cloth_clothId);
                  this.reqDetailList[i].remains = this.withdrawDetailList[j].WithdrawDetail_remain;
                  this.reqDetailList[i].export = this.reqDetailList[i].amountClothReal - this.withdrawDetailList[j].WithdrawDetail_remain;
                }
              }
            }
          }
          for (let i = 0; i < this.reqDetailList.length; i++) {
            for (let j = 0; j < this.round - 1; j++) {
              this.r = 'round';
              // tslint:disable-next-line: max-line-length
              const result4: any = await this.withdrawService.getDetailByCloth(this.rows.withdrawId, this.reqDetailList[i].Cloth_clothId, j + 1);
              // console.log('1', result4.rows[0]);
              this.r = this.r + j;
              // console.log(i, j);
              const obj = {
                clothName: this.reqDetailList[i].clothName,
                round: j,
                amountCloth: result4.rows[0].amountCloth
              };
              // console.log(obj);
              this.roundList[i] = obj;
            }
          }
          // console.log('list', this.lists);
          // console.log('tezt', this.roundList);
        } else {
          for (const item of this.reqDetailList) {
            item.remains = item.amountClothReal;
            item.export = 0;
          }
        }
        // console.log('reqDetailList ', this.reqDetailList);
        // console.log('withDetailList ', this.withdrawDetailList);
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
      this.remain = false;
      let num = 0;
      // console.log('list', this.reqDetailList);
      for (const row of this.reqDetailList) {
        row.remain = 0;
        num++;
        // console.log('num', num);
        if (row.amountClothWithdraw === '' || row.amountClothWithdraw === undefined) {
          row.amountClothWithdraw = 0;
        } else if (row.amountClothWithdraw < 0) {
          this.alertService.error('จำนวน ' + ' ' + row.clothName + 'ผิดพลาด');
        } else {
          row.remain = row.remains - row.amountClothWithdraw;
          // console.log(row.remain, '=', row.remains, '-', row.amountClothWithdraw);
          // console.log(row.remain);
          // ค้างส่ง
          if (row.remain > 0) {
            row.statusRemain = 1;
            if (this.uncomplete === 0) {
              this.clothRemain = this.clothRemain + row.clothName;
            } else {
              this.clothRemain = this.clothRemain + ', ' + row.clothName;
            }
            this.uncomplete += 1;
            // ส่งครบ
          } else if (row.remain === 0) {
            row.statusRemain = 2;
            this.remain = true;
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
      }
      if (this.over > 0) {
        const decision2: any = await this.alertService.error('จำนวน' + this.clothOver + 'เกินจำนวนที่เบิก');
      } else if (this.uncomplete > 0) {
        const decision2: any = await this.alertService.confirm('จำนวน' + this.clothRemain + 'ไม่ครบตามจำนวนที่เบิก');
        if (decision2.value) {
          this.remain = true;
        }
      }
      // console.log(this.remain, this.over);
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
        // console.log(data);
        try {
          const result: any = await this.withdrawService.saveWithdrawDetail(data);
          const result3: any = await this.withdrawService.updateRound(this.round, this.rows.withdrawId);
          if (result.statusCode === 200) {
            await this.alertService.success();
            this.modalShow = false;
            await this.getWithdraw();
            let val = 0;
            console.log(val);
            for (const row of this.reqDetailList) {
              if (row.statusRemain === 2) {
                // tslint:disable-next-line: max-line-length
                const result1: any = await this.requisitonService.statusWithdrawSuccess(this.rows.Requisition_requisitionCode);
                const result6: any = await this.requisitonService.statusDetailWithdrawSuccess(row.id);
                val++;
                console.log(val);
                if (val === this.reqDetailList.length) {
                  const result2: any = await this.withdrawService.statusWithdraw(this.rows.withdrawId);
                }
              }
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
  }
}
