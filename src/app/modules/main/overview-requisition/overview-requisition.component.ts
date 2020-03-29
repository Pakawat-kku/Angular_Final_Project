import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
import * as xlsx from 'xlsx';
import { OverviewRequisitionDetailComponent } from '../overview-requisition-detail/overview-requisition-detail.component';
import { Items } from '@clr/angular/data/datagrid/providers/items';
import { WithdrawService } from 'src/app/services/withdraw.service';

@Component({
  selector: 'app-overview-requisition',
  templateUrl: './overview-requisition.component.html',
  styleUrls: ['./overview-requisition.component.scss']
})
export class OverviewRequisitionComponent implements OnInit {
  @ViewChild('epltable', { static: true }) epltable: ElementRef;
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
  arr: any[] = [];
  someWard = '1';
  daySome: any[] = [];
  month: any = [];
  dayOfCloth: any = {};
  clothList: any = [];
  cal = 0;
  num = 0;
  showList: any = [];

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
    this.daySome = [];

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

        if (wardId === 0 || wardId === '0') { // เลือกแบบทุกวอร์ด
          this.someWard = '1';
          try {
            const result: any = await this.requisitionService.searchByDate(dateSearch3, dateSearch4);

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

          } catch (error) {
            console.log(error);
          }
        } else { // เลือกวอร์ดเดียว
          this.someWard = '2';
          let day1 = 0;
          let day2 = 0;
          day1 = parseInt(moment(dateSearch3).format('DD'));
          day2 = parseInt(moment(dateSearch4).format('DD'));
          console.log(day1, day2);

          for (let i = day1 ; i < day2; i++) {
            this.daySome.push({
              day: i
            });
          }
          console.log(this.daySome);

        try {
          const result: any = await this.requisitionService.searchByWard(wardId, dateSearch3, dateSearch4);

          for (const item of result.rows) {
            const result1: any = await this.withdrawService.getWithdrawByCode(item.requisitionCode);

          }

          if (result.rows) {
            for (const row of result.rows) {
              row.reqDate = moment(row.reqDate).add(543, 'years').format('DD MMMM YYYY');
            }
            this.requisitionList = result.rows;
          }
          console.log('this.requisitionList',  this.requisitionList);

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

          for (const item of result.rows) {

            if (_.findIndex(this.daySome, ['day', moment(item.reqDate).format('DD')]) < 0) {
              this.daySome.push({
                clothId: item.Cloth_clothId,
                amount: item.amountClothReal,
              });
            } else {
              this.num = _.findIndex(this.daySome, ['clothId', item.Cloth_clothId]);
              this.daySome[this.num].amount = this.daySome[this.num].amount + item.amountClothReal;
            }
          }

          // for (let i = 0; i < this.clothIdList.length; i++) {
          //   if (i % 2 === 0) {

          //     this.dayOfCloth.push({
          //       re: 'บ',
          //       requisition: this.clothIdList[i].amount,
          //     });
          //   } else {

          //     this.dayOfCloth.push({
          //       re: 'บ',
          //       requisition: this.clothIdList[i].amount,
          //     });
          //   }
          //   if (i % 2 !== 0) {
          //     this.dayOfCloth.push({
          //       re: 'จ',
          //       requisition: 0,
          //     });
          //   } else {
          //     this.dayOfCloth.push({
          //       re: 'จ',
          //       requisition: 0,
          //     });
          //   }
          // }
          // console.log('this.dayOfCloth', this.dayOfCloth);

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
  // console.log('item', item);

  }

  async onTable(dateSearch3, dateSearch4) {
    this.dateSearch1 = await moment(
      `${dateSearch3.date.year}-${dateSearch3.date.month}-${
      dateSearch3.date.day
      }`,
      'YYYY-MM-DD'
    );
    this.dateSearch2 = await moment(
      `${dateSearch4.date.year}-${dateSearch4.date.month}-${
      dateSearch4.date.day
      }`,
      'YYYY-MM-DD'
    );

    // console.log(this.dateSearch1, this.dateSearch2);
    // console.log(this.dateSearch2.diff(this.dateSearch1, 'month'));
    this.cal = 0;
    this.month = [{}];
    this.dayOfCloth = [];
    this.clothList = [];
    this.showList = [];
    this.cal = this.dateSearch2.diff(this.dateSearch1, 'month') + 1;

    if (this.cal > 1) {
      this.month[0] = {
        name: moment(this.dateSearch1).format('MMM'),
        // tslint:disable-next-line: radix
        id: parseInt(moment(this.dateSearch1).format('MM'))
      };
      for (let i = 1; i < this.cal; i++) {
        this.month[i] = {
          name: moment(this.dateSearch1).add(i, 'month').format('MMM'),
          // tslint:disable-next-line: radix
          id: parseInt(moment(this.dateSearch1).add(i, 'month').format('MM'))
        };
      }
    } else if (this.cal === 1) {
      this.month[0] = {
        name: moment(this.dateSearch1).format('MMM'),
        // tslint:disable-next-line: radix
        id: parseInt(moment(this.dateSearch1).format('MM'))
      };
    }

    for (let i = 0; i < this.month.length; i++) {
      // if (i % 2 === 0) {
      //   this.dayOfCloth.push({
      //     text: 'บ',
      //     monthId: this.month[i].id,
      //   });
      // } else {
      this.dayOfCloth.push({
        text: 'บ',
        monthId: this.month[i].id,
      });
      // }
      // if (i % 2 !== 0) {
      //   this.dayOfCloth.push({
      //     text: 'จ',
      //     monthId: this.month[i].id,
      //   });
      // } else {
      //   this.dayOfCloth.push({
      //     text: 'จ',
      //     monthId: this.month[i].id,
      //   });
      // }
    }

    const result: any = await this.stockService.getCloth();
    if (result.rows) {
      this.clothList = result.rows;
    }


    const results: any = await this.wardService.getAllWard();
    // console.log(results.rows);
    if (results.rows) {
      let month1 = '';
      let month2 = '';

      // console.log(this.cal);
      for (const item of results.rows) {
        if (this.cal > 1) {
          for (let i = 0; i < this.cal; i++) {
            if (i === (this.cal - 1)) {
              month1 = moment(this.dateSearch1).add(i, 'month').subtract(1, 'days').format('YYYY-MM-DD');
              month2 = moment(this.dateSearch2).add(1, 'days').format('YYYY-MM-DD');
              const row1: any = await this.requisitionService.searchByWard(item.wardId, month1, month2);
              // const row2: any = await this.withdrawService.searchByWardDetail(item.wardId, month1, month2);
              if (row1.rows.length > 1) {
                console.log(i, month1, month2);
                for (const r of row1.rows) {
                  // tslint:disable-next-line: radix
                  r.monthId = parseInt(moment(r.reqDate).format('MM'));
                  console.log(r.monthId);
                  if (_.findIndex(this.showList, ['clothId', r.Cloth_clothId]) < 0) {
                    const obj: any = {
                      wardId: r.Ward_wardId,
                      clothName: r.clothName,
                      clothId: r.Cloth_clothId,
                    };
                    obj[r.monthId] = r.amountClothReal;
                    this.showList.push(obj);
                  } else {
                    this.num = _.findIndex(this.showList, ['clothId', r.Cloth_clothId]);
                    this.showList[this.num][r.monthId] += r.amountClothReal;
                  }
                }
              }
            } else {
              month1 = moment(this.dateSearch1).add(i, 'month').subtract(1, 'days').format('YYYY-MM-DD');
              month2 = moment(this.dateSearch1).add(i + 1, 'month').format('YYYY-MM-DD');
              const row1: any = await this.requisitionService.searchByWard(item.wardId, month1, month2);
              if (row1.rows.length > 1) {
                console.log(i, month1, month2);
                for (const r of row1.rows) {
                  // tslint:disable-next-line: radix
                  r.monthId = parseInt(moment(r.reqDate).format('MM'));
                  if (_.findIndex(this.showList, ['clothId', r.Cloth_clothId]) < 0) {
                    const obj: any = {
                      wardId: r.Ward_wardId,
                      clothName: r.clothName,
                      clothId: r.Cloth_clothId,
                    };
                    obj[r.monthId] = r.amountClothReal;
                    this.showList.push(obj);
                  } else {
                    this.num = _.findIndex(this.showList, ['clothId', r.Cloth_clothId]);
                    this.showList[this.num][r.monthId] += r.amountClothReal;
                  }

                }
              }
            }
          }
        } else {
          month1 = moment(this.dateSearch1).subtract(1, 'days').format('YYYY-MM-DD');
          month2 = moment(this.dateSearch2).add(1, 'days').format('YYYY-MM-DD');
          const row1: any = await this.requisitionService.searchByWard(item.wardId, month1, month2);
          if (row1.rows.length > 1) {
            console.log(month1, month2);
            for (const r of row1.rows) {
              // r.month = m.id;
              // tslint:disable-next-line: radix
              r.monthId = parseInt(moment(r.reqDate).format('MM'));
              if (_.findIndex(this.showList, ['clothId', r.Cloth_clothId]) < 0) {
                const obj: any = {
                  wardId: r.Ward_wardId,
                  clothName: r.clothName,
                  clothId: r.Cloth_clothId,
                  // req: r.amountClothReal,
                  // monthId: m.id,
                  // wtd: 0
                };
                obj[r.monthId] = r.amountClothReal;
                this.showList.push(obj);
              } else {
                this.num = _.findIndex(this.showList, ['clothId', r.Cloth_clothId]);
                this.showList[this.num][r.monthId] += r.amountClothReal;
              }

            }
          }
          // console.log(month1, month2);
        }
      }

    }
    this.exportToExcel();
  }

  exportToExcel() {
    const ws: xlsx.WorkSheet =
      xlsx.utils.table_to_sheet(this.epltable.nativeElement);
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
    xlsx.writeFile(wb, 'requisition.xlsx');
  }
}
