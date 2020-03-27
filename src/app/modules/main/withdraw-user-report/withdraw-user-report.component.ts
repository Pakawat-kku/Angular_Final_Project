import { UsersAuthorityService } from 'src/app/services/users-authority.service';
import { WithdrawService } from 'src/app/services/withdraw.service';
import { WardService } from './../../../services/ward.service';
import { AlertService } from './../../../services/alert.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { StockService } from 'src/app/services/stock.service';
import * as _ from 'lodash';
import { RequisitionService } from 'src/app/services/requisition.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-withdraw-user-report',
  templateUrl: './withdraw-user-report.component.html',
  styleUrls: ['./withdraw-user-report.component.scss']
})
export class WithdrawUserReportComponent implements OnInit {
  wardList: any = [{}];
  userAuth: any = [];
  sum: any;
  userId: any;
  warning: any;
  onProcess: any[] = [];
  withdrawList: any = [];
  dateSearch1: any;
  dateSearch2: any;
  dateSearch3: any;
  dateSearch4: any;
  clothList: any = [];
  showList: any = [];
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
    private stockService: StockService,
    private wardService: WardService,
    private withdrawService: WithdrawService,
    private user_authService: UsersAuthorityService,
    private requisitonService: RequisitionService,
  ) { }

  async ngOnInit() {
    // await this.getWard();
    await this.getUserAuth();
    moment.locale('th');
    this.userId = '0';
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

  async getCloth() {
    try {
      const result: any = await this.stockService.getCloth();
      if (result.rows) {
        // console.log('cloth', result.rows);
        this.clothList = result.rows;
        // console.log('check', this.clothList);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async getUserAuth() {
    try {
      const result: any = await this.user_authService.getByAuth(1);
      if (result.rows) {
        this.userAuth = result.rows;
      }
    } catch (error) {
      console.log(error);
    }
  }


  async letSearch(userId, dateSearch3, dateSearch4) {
    this.withdrawList = [];
    // console.log(userId);
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
        if (userId === '0') {
          try {
            for (const rows of this.userAuth) {
              const result2: any = await this.withdrawService.getWithdrawByUserId(rows.Users_userId);
              // console.log(result2.rows);
              if (result2.rows) {
                for (const item of result2.rows) {
                  // console.log(item.withdrawCode);
                  const result: any = await this.withdrawService.searchByCode(item.withdrawCode, dateSearch3, dateSearch4);
                  // console.log(result.rows);
                  if (result.rows) {
                    for (const row of result.rows) {
                      row.userId = item.userId;
                      row.name = item.firstname + ' ' + item.lastname;
                      row.withdrawDate = moment(row.withdrawDate).add(543, 'years').format('DD MMMM YYYY');
                      await this.withdrawList.push(row);
                    }
                  }
                }
              }
            }
          } catch (error) {
            console.log(error);
          }
        } else {
          try {

            const result2: any = await this.withdrawService.getWithdrawByUserId(userId);
            // console.log(result2.rows);
            if (result2.rows) {
              for (const item of result2.rows) {
                // console.log(item.withdrawCode);
                const result: any = await this.withdrawService.searchByCode(item.withdrawCode, dateSearch3, dateSearch4);
                // console.log(result.rows);
                if (result.rows) {
                  for (const row of result.rows) {
                    row.userId = userId;
                    row.withdrawDate = moment(row.withdrawDate).add(543, 'years').format('DD MMMM YYYY');
                    await this.withdrawList.push(row);
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
    }
  }

  async onShow(code) {
    this.modalShow = true;
    this.rows = code;
    this.round = this.rows.totalRound + 1;
    this.wardCheck = false;
    // console.log('code', code);
    try {
      const result3: any = await this.wardService.getPorter(code.userId);
      // console.log(result3.rows);
      for (const r of result3.rows) {
        if (r.wardName === 'ผ้าเช็ดมือ') {
          this.wardCheck = true;
        }
      }
      // console.log(this.wardCheck);

      if (this.wardCheck === true) {
        const results: any = await this.requisitonService.showReqWaitDetail(code.Requisition_requisitionCode.substring(2));
        for (const row of results.rows) {
          row.amountClothWithdraw = 0;
        }
        this.reqDetailList = results.rows;
      } else {
        const results: any = await this.requisitonService.showReqWaitDetail(code.Requisition_requisitionCode);
        for (const row of results.rows) {
          row.amountClothWithdraw = 0;
        }
        this.reqDetailList = results.rows;
      }
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
