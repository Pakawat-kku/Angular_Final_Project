import { WithdrawService } from 'src/app/services/withdraw.service';
import { WardService } from './../../../services/ward.service';
import { AlertService } from './../../../services/alert.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { InputArray } from '../requisition/inputArray';

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
  constructor(
    private alertService: AlertService,
    private wardService: WardService,
    private withdrawService: WithdrawService
  ) { }

  ngOnInit() {
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
              console.log(this.withdrawList);
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
              console.log(result.rows);
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
      console.log(this.onProcess);
    }
  }

}
