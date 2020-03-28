import { WithdrawService } from 'src/app/services/withdraw.service';
import { WardService } from './../../../services/ward.service';
import { AlertService } from './../../../services/alert.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { InputArray } from '../requisition/inputArray';
import * as jwt_decode from 'jwt-decode';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../../services//Authentication.service';
import { UsersAuthorityService } from 'src/app/services/users-authority.service';
import { Router, ActivatedRoute } from '@angular/router';
import { RequisitionService } from 'src/app/services/requisition.service';

@Component({
  selector: 'app-overview-withdraw-admin',
  templateUrl: './overview-withdraw-admin.component.html',
  styleUrls: ['./overview-withdraw-admin.component.scss']
})
export class OverviewWithdrawAdminComponent implements OnInit {
  wardList: any;
  sum: any;
  wardId: any;
  warning: any;
  onProcess: any[] = [];
  withdrawList: any = [];
  dateSearch1: any;
  dateSearch2: any;
  dateSearch3: any;
  dateSearch4: any;
  currentUser: any;
  currentUserSubscription: Subscription;
  decoded: any;
  authority: any = [];
  round: any;
  modalShow = false;
  rows: any = [];
  reqDetailList: any[];
  withdrawRoundList: any[];
  withdrawDetailList: any[];
  r: any = '';
  roundList: any = [];
  wardCheck = false;

  constructor(
    private alertService: AlertService,
    private wardService: WardService,
    private withdrawService: WithdrawService,
    private authenticationService: AuthenticationService,
    private users_authorityService: UsersAuthorityService,
    private router: Router,
    private requisitonService: RequisitionService,

  ) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(users => {
      this.currentUser = users;
      this.decoded = jwt_decode(users.token);
    });
  }

  async ngOnInit() {
    // this.getWithdraw();
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
      this.getWard();
      moment.locale('th');
      this.wardId = 0;
      this.dateSearch3 = {
        date: {
          // tslint:disable-next-line: radix
          year: parseInt(moment().format('YYYY')),
          // tslint:disable-next-line: radix
          month: parseInt(moment().format('MM')),
          // tslint:disable-next-line: radix
          day: parseInt(moment().format('DD'))
        }
      };
      this.dateSearch4 = {
        date: {
          // tslint:disable-next-line: radix
          year: parseInt(moment().format('YYYY')),
          // tslint:disable-next-line: radix
          month: parseInt(moment().format('MM')),
          // tslint:disable-next-line: radix
          day: parseInt(moment().format('DD'))
        }
      };
    }
  }

  async getWard() {
    try {
      const result: any = await this.wardService.getAllWard();
      if (result.rows) {
        this.wardList = result.rows;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async letSearch(wardId, dateSearch3, dateSearch4) {
    this.withdrawList = [];
    if (dateSearch3 === null || dateSearch4 === null) {
      await this.alertService.error('กรุณาเลือกวันที่ที่ต้องการค้นหา');
    } else {
      dateSearch3 = moment(
        `${dateSearch3.date.year}-${dateSearch3.date.month}-${
        dateSearch3.date.day
        }`,
        'YYYY-MM-DD'
      );
      dateSearch4 = moment(
        `${dateSearch4.date.year}-${dateSearch4.date.month}-${
        dateSearch4.date.day
        }`,
        'YYYY-MM-DD'
      );
      this.sum = dateSearch4.diff(dateSearch3, 'days');
      if (this.sum < 0) {
        this.alertService.error('กรอกข้อมูลวันที่ผิดพลาด', 'กรุณากรอกข้อมูลใหม่');
      } else {
        dateSearch3 = moment(dateSearch3)
          .subtract(1, 'days')
          .format('YYYY-MM-DD');
        dateSearch4 = moment(dateSearch4)
          .add(1, 'days')
          .format('YYYY-MM-DD');
        if (wardId === 0) {
          try {
            const result: any = await this.withdrawService.searchByDate(dateSearch3, dateSearch4);
            if (result.rows.length) {
              for (const row of result.rows) {
                row.withdrawDate = moment(row.withdrawDate).add(543, 'years').format('DD MMMM YYYY');
              }
              this.withdrawList = result.rows;
              // console.log(this.withdrawList);
            }
          } catch (error) {
            console.log(error);
          }
        } else {
          try {
            const result: any = await this.withdrawService.searchByWard(wardId, dateSearch3, dateSearch4);
            if (result.rows) {
              for (const row of result.rows) {
                row.withdrawDate = moment(row.withdrawDate).add(543, 'years').format('DD MMMM YYYY');
              }
              this.withdrawList = result.rows;
              // console.log(result.rows);
            }
          } catch (error) {
            console.log(error);
          }
        }
      }
    }
    if (this.withdrawList.length === 0) {
      this.onProcess = [];
      this.warning = 'ไม่มีรายการที่ค้นหาตรงกัน';
    } else {
      this.warning = '';
      this.onProcess = [];
      for (const row of this.withdrawList) {
        if (row.withdraw_status === '0') {
          this.onProcess.push({
            wardName: row.wardName,
            date: row.withdrawDate,
          });
        }
      }
      // console.log(this.onProcess);
    }
  }

  async onShow(code) {
    this.modalShow = true;
    this.rows = code;
    this.round = this.rows.totalRound + 1;
    this.wardCheck = false;
    // console.log('code', code);
    try {
      // console.log(this.wardCheck);

      const results: any = await this.requisitonService.showReqWaitDetail(code.Requisition_requisitionCode);
      // console.log(results.rows);
      if (results.rows.length > 0) {
        for (const row of results.rows) {
          row.amountClothWithdraw = 0;
        }
        this.reqDetailList = results.rows;
      } else {
          const results1: any = await this.requisitonService.showReqWaitDetail(code.Requisition_requisitionCode.substring(2));
          for (const row of results1.rows) {
            row.amountClothWithdraw = 0;
          }
          this.reqDetailList = results1.rows;
          this.wardCheck = true;
      }

      // if (this.wardCheck === true) {
      // } else {
      // }
      if (this.round > 1) {
        const result1: any = await this.withdrawService.getDetailById(this.rows.withdrawCode, this.round - 1);
        const result2: any = await this.withdrawService.getDetailRound(this.rows.withdrawCode);
        if (result2.rows) {
          this.withdrawRoundList = result2.rows;
        }
        if (result1.rows) {
          this.withdrawDetailList = result1.rows;
          // console.log(this.reqDetailList, this.withdrawRoundList, this.withdrawDetailList);
          for (let i = 0; i < this.reqDetailList.length; i++) {
            this.reqDetailList[i].check = false;
            for (let j = 0; j < this.withdrawDetailList.length; j++) {
              if (this.reqDetailList[i].Cloth_clothId === this.withdrawDetailList[j].Cloth_clothId) {
                this.reqDetailList[i].remains = this.withdrawDetailList[j].WithdrawDetail_remain;
                this.reqDetailList[i].export =
                  this.reqDetailList[i].amountClothReal - this.withdrawDetailList[j].WithdrawDetail_remain;
                this.reqDetailList[i].check = true;
              }
            }
          }
        }
        if (this.wardCheck === true) {
          this.reqDetailList = await _.dropWhile(this.reqDetailList, ['check', false]);
        } else {
          this.reqDetailList = await _.takeWhile(this.reqDetailList, ['check', true]);
        }

        for (let i = 0; i < this.reqDetailList.length; i++) {
          for (let j = 0; j < this.round - 1; j++) {
            this.r = 'round';
            // tslint:disable-next-line: max-line-length
            const result4: any = await this.withdrawService.getDetailByCloth(this.rows.withdrawCode, this.reqDetailList[i].Cloth_clothId, j + 1);
            this.r = this.r + j;
            const obj = {
              clothName: this.reqDetailList[i].clothName,
              round: j,
              amountCloth: result4.rows[0].amountCloth
            };
            this.roundList[i] = obj;
          }
        }
      } else {
        for (const item of this.reqDetailList) {
          item.remains = item.amountClothReal;
          item.export = 0;
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

}
