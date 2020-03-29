import { AlertService } from './../../../services/alert.service';
import { StockService } from './../../../services/stock.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Router, ActivatedRoute } from '@angular/router';
import { RepairService } from 'src/app/services/repair.service';
import { AvailableService } from 'src/app/services/available.service';

import * as jwt_decode from 'jwt-decode';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../../services//Authentication.service';
import { UsersAuthorityService } from 'src/app/services/users-authority.service';
import * as xlsx from 'xlsx';


@Component({
  selector: 'app-overview-repair',
  templateUrl: './overview-repair.component.html',
  styleUrls: ['./overview-repair.component.scss']
})
export class OverviewRepairComponent implements OnInit {
  @ViewChild('epltable', { static: false }) epltable: ElementRef;
  clothId: any;
  dateSearch3: any;
  dateSearch4: any;
  sum: any;
  clubs: any = [] ;
  clothIdList: any[] = [];
  num: number;

  constructor(
    private alertService: AlertService,
    private stockService: StockService,
    private repairService: RepairService,
    private availableService: AvailableService,
    private _Activatedroute: ActivatedRoute,
    private users_authorityService: UsersAuthorityService,
    private authenticationService: AuthenticationService,
  ) { }

  async ngOnInit() {
    moment.locale('th');
    this.clothIdList = []
    this.clothId = 0;
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

  async letSearch(clothId, dateSearch3, dateSearch4) {
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
          // .subtract(1, 'days')
          .format('YYYY-MM-DD');
        dateSearch4 = moment(dateSearch4)
          .add(1, 'days')
          .format('YYYY-MM-DD');
      }
      const result: any = await this.repairService.searchByDate(dateSearch3, dateSearch4);

      const result1: any = await this.stockService.getCloth();

      for (const item of result1.rows) {

        if (_.findIndex(this.clothIdList, ['clothId', item.clothId]) < 0) {
          this.clothIdList.push({
            clothId: item.clothId,
            clothName: item.clothName,
            amount: 0,
          });
        }
      }


      for (const item of result.rows) {

        if (_.findIndex(this.clothIdList, ['clothId', item.Cloth_clothId]) < 0) {
          this.clothIdList.push({
            clothId: item.Cloth_clothId,
            clothName: item.clothName,
            amount: item.repairAmount,
          });
        } else {
          this.num = _.findIndex(this.clothIdList, ['clothId', item.Cloth_clothId]);
          this.clothIdList[this.num].amount = this.clothIdList[this.num].amount + item.repairAmount;
        }
      }

      this.clubs = result.rows;
      console.log('this.clothIdList');
      console.log('this.clubs', this.clubs);

    }
  }

  exportToExcel() {
    const ws: xlsx.WorkSheet =
      xlsx.utils.table_to_sheet(this.epltable.nativeElement);
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
    xlsx.writeFile(wb, 'epltable.xlsx');
  }
}
