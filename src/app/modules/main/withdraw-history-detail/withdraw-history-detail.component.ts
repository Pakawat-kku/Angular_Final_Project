import { RequisitionService } from './../../../services/requisition.service';
import { WithdrawService } from './../../../services/withdraw.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import * as jwt_decode from 'jwt-decode';
import { WardService } from 'src/app/services/ward.service';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/services/Authentication.service';
import * as _ from 'lodash';
import { AlertService } from 'src/app/services/alert.service';
import { UsersAuthorityService } from 'src/app/services/users-authority.service';
@Component({
  selector: 'app-withdraw-history-detail',
  templateUrl: './withdraw-history-detail.component.html',
  styleUrls: ['./withdraw-history-detail.component.scss']
})
export class WithdrawHistoryDetailComponent implements OnInit {
  withdrawCode: any;
  withdrawList: any;
  date: any;
  round: any;
  modalShow = false;
  rows: any = [];
  reqDetailList: any[];
  collapsed = true;
  currentUser: any;
  currentUserSubscription: Subscription;
  decoded: any;
  wardCheck = false;
  withdrawRoundList: any[];
  withdrawDetailList: any[];
  r: any = '';
  roundList: any = [];
  authority: any = [];

  constructor(
    private _Activatedroute: ActivatedRoute,
    private _router: Router,
    private authenticationService: AuthenticationService,
    private withdrawService: WithdrawService,
    private wardService: WardService,
    private requisitonService: RequisitionService,
    private reqService: RequisitionService,
    private router: Router,
    private users_authorityService: UsersAuthorityService,
    private alertService: AlertService,
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
    if (this.authority.one !== 'true') {
      this.alertService.error();
      this.router.navigate(['main/main']);
    } else {
      this.withdrawCode = this._Activatedroute.snapshot.paramMap.get('withdrawCode');
      // console.log('withdrawCode', this.withdrawCode);
      moment.locale('th');
      this.getWithdraw();
    }
  }

  async getWithdraw() {
    try {
      const result2: any = await this.wardService.getPorter(this.decoded.userId);
      if (result2.rows) {
        for (const row of result2.rows) {
          if (row.wardName === 'ผ้าเช็ดมือ') {
            this.wardCheck = true;
          }
        }
      }
      // console.log(this.wardCheck);
      if (this.wardCheck === true) {
        const result: any = await this.withdrawService.getWithdrawByCodeNapkin(this.withdrawCode);
        if (result.rows) {
          this.withdrawList = result.rows;
          for (const item of this.withdrawList) {
            const code = item.Requisition_requisitionCode;
            // console.log(code.substring(2));
            const result3: any = await this.reqService.getReqNapkin(code.substring(2));
            // console.log(result3.rows[0]);
            if (result3.rows) {
              item.reqTime = moment(result3.rows[0].reqDate).format('HH:mm');
              item.reqDate = moment(result3.rows[0].reqDate).add(543, 'years').format('DD MMMM YYYY');
              item.reqId = result3.rows[0].reqId;
              item.requisitionCode = result3.rows[0].requisitionCode;
              item.status = result3.rows[0].status;
              item.status_withdraw = result3.rows[0].status_withdraw;
            }
          }
          this.date = moment(result.rows[0].withdrawDate).add(543, 'years').format('DD MMMM YYYY');
        }
        // console.log(this.withdrawList);
      } else {
        const result: any = await this.withdrawService.getWithdrawByCode(this.withdrawCode);
        if (result.rows) {
          this.withdrawList = result.rows;
          for (const item of this.withdrawList) {
            item.reqTime = moment(item.reqDate).format('HH:mm');
            item.reqDate = moment(item.reqDate).add(543, 'years').format('DD MMMM YYYY');
          }
          this.date = moment(result.rows[0].withdrawDate).add(543, 'years').format('DD MMMM YYYY');
        }
        // console.log(this.withdrawList);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async onShow(code) {
    this.modalShow = true;
    this.rows = code;
    this.round = this.rows.totalRound + 1;
    // console.log(code);
    try {
      const results: any = await this.requisitonService.showReqWaitDetail(code.Requisition_requisitionCode);
      // console.log(results.rows);

      if (results.rows) {
        for (let row of results.rows) {
          row.amountClothWithdraw = 0;
        }
        this.reqDetailList = results.rows;
        // console.log('round', this.round);
        if (this.round > 1) {
          console.log('k');

          const result1: any = await this.withdrawService.getDetailById(this.rows.withdrawCode, this.round - 1);
          const result2: any = await this.withdrawService.getDetailRound(this.rows.withdrawCode);
          console.log(result1, result2);
          if (result2.rows) {
            this.withdrawRoundList = result2.rows;
          }
          if (result1.rows) {
            this.withdrawDetailList = result1.rows;
            console.log(this.reqDetailList, this.withdrawRoundList, this.withdrawDetailList);
            for (let i = 0; i < this.reqDetailList.length; i++) {
              this.reqDetailList[i].check = false;
              for (let j = 0; j < this.withdrawDetailList.length; j++) {
                if (this.reqDetailList[i].Cloth_clothId === this.withdrawDetailList[j].Cloth_clothId) {
                  // console.log('id', this.reqDetailList[i].Cloth_clothId, this.withdrawDetailList[j].Cloth_clothId);
                  this.reqDetailList[i].remains = this.withdrawDetailList[j].WithdrawDetail_remain;
                  this.reqDetailList[i].export =
                    this.reqDetailList[i].amountClothReal - this.withdrawDetailList[j].WithdrawDetail_remain;
                  this.reqDetailList[i].check = true;
                }
              }
              // console.log(i, this.reqDetailList[i].check);
            }
          }
          if (this.wardCheck === true) {
            // console.log('detail', this.reqDetailList);
            // console.log(_.dropWhile(this.reqDetailList, ['check', false]));
            this.reqDetailList = await _.dropWhile(this.reqDetailList, ['check', false]);
          } else {
            // console.log('detail', this.reqDetailList);
            // console.log(_.takeWhile(this.reqDetailList, ['check', true]));
            this.reqDetailList = await _.takeWhile(this.reqDetailList, ['check', true]);
          }
          // console.log('wth', this.withdrawDetailList);
          // console.log('ro', this.withdrawRoundList);
          // console.log('round', this.round);

          for (let i = 0; i < this.reqDetailList.length; i++) {
            for (let j = 0; j < this.round - 1; j++) {
              this.r = 'round';
              // tslint:disable-next-line: max-line-length
              const result4: any = await this.withdrawService.getDetailByCloth(this.rows.withdrawCode, this.reqDetailList[i].Cloth_clothId, j + 1);
              // console.log('1', result4.rows);
              this.r = this.r + j;
              // console.log(j);
              const obj = {
                clothName: this.reqDetailList[i].clothName,
                round: j,
                amountCloth: result4.rows[0].amountCloth
              };
              // console.log(obj);
              this.roundList[i] = obj;
            }
          }
          // console.log('detail', this.reqDetailList);
          // console.log('list', this.lists);
          // console.log('tezt', this.roundList);
        } else {
          // console.log('p');
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

}
