import { Component, OnInit } from '@angular/core';
import { RequisitionService } from './../../../services/requisition.service';
import { StockService } from './../../../services/stock.service';
import { throwError, fromEvent } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { NgForm, FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../../services//Authentication.service';
import { UsersService } from '../../../services/users.service';
import * as jwt_decode from 'jwt-decode';
import { Select2OptionData } from 'ng2-select2';
import { endWith } from 'rxjs/operators';
import { LocaleHelperService } from '@clr/angular/forms/datepicker/providers/locale-helper.service';
import { LoginModule } from '../../login/login.module';
import { UsersAuthorityService } from 'src/app/services/users-authority.service';
import { WardService } from './../../../services/ward.service';
import { analyzeAndValidateNgModules } from '@angular/compiler';

import { OverviewRequisitionDetailComponent } from '../overview-requisition-detail/overview-requisition-detail.component';
import { Items } from '@clr/angular/data/datagrid/providers/items';
import { WithdrawService } from 'src/app/services/withdraw.service';

@Component({
  selector: 'app-overview-requisition',
  templateUrl: './overview-requisition.component.html',
  styleUrls: ['./overview-requisition.component.scss']
})
export class OverviewRequisitionComponent implements OnInit {
  currentUser: any;
  currentUserSubscription: Subscription;
  decoded: any;
  dateSearch1: any;
  dateSearch2: any;
  dateSearch3: any;
  dateSearch4: any;
  requisitionList: any[];
  sum: any;
  wardList: any;
  onProcess: any[];
  warning: any;
  wardId: any;
  requisitionListReal: any[];
  clothIdList: any[] = [];
  num: number;
  arr: any[] = [];
  someWard = '1';
  dayOfCloth: any[] = [];
  daySome: any[] = [] ;

  constructor(
    private alertService: AlertService,
    private stockService: StockService,
    private requisitionService: RequisitionService,
    private router: Router,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private userService: UsersService,
    private _Activatedroute: ActivatedRoute,
    private users_authorityService: UsersAuthorityService,
    private wardService: WardService,
    private withdrawService: WithdrawService,

  ) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(users => {
      this.currentUser = users;
      this.decoded = jwt_decode(users.token);
    });
  }

  async ngOnInit() {
    moment.locale('th');
    await this.getWard();
    this.wardId = 0;
    this.alwayWard();
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

  async alwayWard() {

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
    this.requisitionList = [];
    this.clothIdList = [];
    this.dayOfCloth = [];
    this.sum = 0;

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
        console.log('dateSearch3', moment(dateSearch3).format('DD'));


        console.log('this.dayOfCloth', this.dayOfCloth);

        if (wardId === 0 || wardId === '0') { // เลือกแบบทุกวอร์ด
          console.log('wardId', wardId);
          this.someWard = '1';
          try {
            const result: any = await this.requisitionService.searchByDate(dateSearch3, dateSearch4);
            // console.log('result', result.rows);
            let i = 0;
            for (const item of result.rows) {

              if (_.findIndex(this.clothIdList, ['Ward_wardId', item.Ward_wardId]) < 0) {
                await this.clothIdList.push({
                  Ward_wardId: item.Ward_wardId,
                  wardName: item.wardName,
                  dateSearch3: dateSearch3,
                  dateSearch4: dateSearch4,
                });
              }
            }
            // console.log('this.clothIdList', this.clothIdList);

          } catch (error) {
            console.log(error);
          }
        } else { // เลือกวอร์ดเดียว
          this.someWard = '2';
          try {
            const result: any = await this.requisitionService.searchByWard(wardId, dateSearch3, dateSearch4);
            console.log('result', result.rows);
            for (const item of result.rows) {
              const result1: any = await this.withdrawService.getWithdrawByCode(item.requisitionCode);
              console.log('result1', result1.rows);
            }

            if (result.rows) {
              for (const row of result.rows) {
                row.reqDate = moment(row.reqDate).add(543, 'years').format('DD MMMM YYYY');
              }
              this.requisitionList = result.rows;
            }

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

            for (let i = 0; i < this.clothIdList.length; i++) {
              if (i % 2 === 0) {

                this.dayOfCloth.push({
                  re: 'บ',
                  requisition: this.clothIdList[i].amount,
                });
              } else {

                this.dayOfCloth.push({
                  re: 'บ',
                  requisition: this.clothIdList[i].amount,
                });
              }
              if (i % 2 !== 0) {
                this.dayOfCloth.push({
                  re: 'จ',
                  requisition: 0,
                });
              } else {
                this.dayOfCloth.push({
                  re: 'จ',
                  requisition: 0,
                });
              }
            }
            console.log(moment(dateSearch3).format('DD'));
            console.log(moment(dateSearch4).format('DD'));

            for (const item of this.clothIdList) {
              const result1: any = await this.stockService.getClothById(item.clothId);
              this.num = _.findIndex(this.clothIdList, ['clothId', item.clothId]);
              item.clothName = result1.rows[0].clothName;
            }

          } catch (error) {
            console.log(error);
          }
        }
      }
    }
  }

  onAdd(item) {
    console.log('item', item);

  }
}
