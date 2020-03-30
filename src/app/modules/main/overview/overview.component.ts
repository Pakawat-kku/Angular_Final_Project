import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RequisitionService } from './../../../services/requisition.service';
import { StockService } from './../../../services/stock.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { NgForm, FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import * as _ from 'lodash';
import * as jwt_decode from 'jwt-decode';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../../services//Authentication.service';
import { UsersService } from '../../../services/users.service';
import { UsersAuthorityService } from 'src/app/services/users-authority.service';
import { WardService } from './../../../services/ward.service';
import * as xlsx from 'xlsx';
import { WithdrawService } from 'src/app/services/withdraw.service';


@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
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
  select = 1;
  tab = 0;

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

  async onTable(wardId, dateSearch3, dateSearch4) {
    // console.log(wardId);
    this.sum = 0;
    if (dateSearch3 === null || dateSearch4 === null) {
      await this.alertService.error('กรุณาเลือกวันที่ที่ต้องการค้นหา');
    } else {
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
      this.sum = this.dateSearch2.diff(this.dateSearch1, 'days');
      if (this.sum < 0) {
        this.alertService.error('กรอกข้อมูลวันที่ผิดพลาด', 'กรุณากรอกข้อมูลใหม่');
      } else {
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
          if (this.select === 1) {
            this.dayOfCloth.push({
              text: 'บ',
              monthId: this.month[i].id,
            });
          } else {
            this.dayOfCloth.push({
              text: 'จ',
              monthId: this.month[i].id,
            });
          }
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

        let month1 = '';
        let month2 = '';
        if (wardId === 0 || wardId === '0') {
          const results: any = await this.wardService.getAllWard();
          // console.log(results.rows);
          if (results.rows) {

            // console.log(this.cal);
            for (const item of results.rows) {
              let row1: any;
              if (this.cal > 1) {
                for (let i = 0; i < this.cal; i++) {
                  if (i === (this.cal - 1)) {
                    month1 = moment(this.dateSearch1).add(i, 'month').subtract(1, 'days').format('YYYY-MM-DD');
                    month2 = moment(this.dateSearch2).add(1, 'days').format('YYYY-MM-DD');
                    if (this.select === 1) {
                      row1 = await this.requisitionService.searchByWard(item.wardId, month1, month2);
                    } else {
                      row1 = await this.withdrawService.searchByWardDetail(item.wardId, month1, month2);
                    }
                    if (row1.rows.length > 1) {
                      // console.log(i, month1, month2);
                      for (const r of row1.rows) {
                        if (this.select === 1) {
                          // tslint:disable-next-line: radix
                          r.monthId = parseInt(moment(r.reqDate).format('MM'));
                        } else {
                          // tslint:disable-next-line: radix
                          r.monthId = parseInt(moment(r.withdrawDate).format('MM'));
                        }
                        if (_.findIndex(this.showList, ['clothId', r.Cloth_clothId]) < 0) {
                          const obj: any = {
                            wardId: r.Ward_wardId,
                            clothName: r.clothName,
                            clothId: r.Cloth_clothId,
                          };
                          if (this.select === 1) {
                            obj[r.monthId] = r.amountClothReal;
                          } else {
                            obj[r.monthId] = r.amountCloth;
                          }
                          this.showList.push(obj);
                        } else {
                          this.num = _.findIndex(this.showList, ['clothId', r.Cloth_clothId]);
                          if (this.select === 1) {
                            this.showList[this.num][r.monthId] += r.amountClothReal;
                          } else {
                            this.showList[this.num][r.monthId] += r.amountCloth;
                          }
                        }
                      }
                    }
                  } else {
                    month1 = moment(this.dateSearch1).add(i, 'month').subtract(1, 'days').format('YYYY-MM-DD');
                    month2 = moment(this.dateSearch1).add(i + 1, 'month').format('YYYY-MM-DD');
                    if (this.select === 1) {
                      row1 = await this.requisitionService.searchByWard(item.wardId, month1, month2);
                    } else {
                      row1 = await this.withdrawService.searchByWardDetail(item.wardId, month1, month2);
                    }
                    if (row1.rows.length > 1) {
                      // console.log(i, month1, month2);
                      for (const r of row1.rows) {
                        if (this.select === 1) {
                          // tslint:disable-next-line: radix
                          r.monthId = parseInt(moment(r.reqDate).format('MM'));
                        } else {
                          // tslint:disable-next-line: radix
                          r.monthId = parseInt(moment(r.withdrawDate).format('MM'));
                        }
                        if (_.findIndex(this.showList, ['clothId', r.Cloth_clothId]) < 0) {
                          const obj: any = {
                            wardId: r.Ward_wardId,
                            clothName: r.clothName,
                            clothId: r.Cloth_clothId,
                          };
                          if (this.select === 1) {
                            obj[r.monthId] = r.amountClothReal;
                          } else {
                            obj[r.monthId] = r.amountCloth;
                          }
                          this.showList.push(obj);
                        } else {
                          this.num = _.findIndex(this.showList, ['clothId', r.Cloth_clothId]);
                          if (this.select === 1) {
                            this.showList[this.num][r.monthId] += r.amountClothReal;
                          } else {
                            this.showList[this.num][r.monthId] += r.amountCloth;
                          }
                        }
                      }
                    }
                  }
                }
              } else {
                month1 = moment(this.dateSearch1).subtract(1, 'days').format('YYYY-MM-DD');
                month2 = moment(this.dateSearch2).add(1, 'days').format('YYYY-MM-DD');
                if (this.select === 1) {
                  row1 = await this.requisitionService.searchByWard(item.wardId, month1, month2);
                } else {
                  row1 = await this.withdrawService.searchByWardDetail(item.wardId, month1, month2);
                }
                if (row1.rows.length > 1) {
                  for (const r of row1.rows) {
                    if (this.select === 1) {
                      // tslint:disable-next-line: radix
                      r.monthId = parseInt(moment(r.reqDate).format('MM'));
                    } else {
                      // tslint:disable-next-line: radix
                      r.monthId = parseInt(moment(r.withdrawDate).format('MM'));
                    }
                    if (_.findIndex(this.showList, ['clothId', r.Cloth_clothId]) < 0) {
                      const obj: any = {
                        wardId: r.Ward_wardId,
                        clothName: r.clothName,
                        clothId: r.Cloth_clothId,
                      };
                      if (this.select === 1) {
                        obj[r.monthId] = r.amountClothReal;
                      } else {
                        obj[r.monthId] = r.amountCloth;
                      }
                      this.showList.push(obj);
                    } else {
                      this.num = _.findIndex(this.showList, ['clothId', r.Cloth_clothId]);
                      if (this.select === 1) {
                        this.showList[this.num][r.monthId] += r.amountClothReal;
                      } else {
                        this.showList[this.num][r.monthId] += r.amountCloth;
                      }
                    }
                  }
                }
              }
            }
          }
        } else {
          console.log(wardId);

          let row1: any;
          if (this.cal > 1) {
            for (let i = 0; i < this.cal; i++) {
              if (i === (this.cal - 1)) {
                month1 = moment(this.dateSearch1).add(i, 'month').subtract(1, 'days').format('YYYY-MM-DD');
                month2 = moment(this.dateSearch2).add(1, 'days').format('YYYY-MM-DD');
                if (this.select === 1) {
                  row1 = await this.requisitionService.searchByWard(wardId, month1, month2);
                } else {
                  row1 = await this.withdrawService.searchByWardDetail(wardId, month1, month2);
                }
                if (row1.rows.length > 1) {
                  // console.log(i, month1, month2);
                  for (const r of row1.rows) {
                    if (this.select === 1) {
                      // tslint:disable-next-line: radix
                      r.monthId = parseInt(moment(r.reqDate).format('MM'));
                    } else {
                      // tslint:disable-next-line: radix
                      r.monthId = parseInt(moment(r.withdrawDate).format('MM'));
                    }
                    if (_.findIndex(this.showList, ['clothId', r.Cloth_clothId]) < 0) {
                      const obj: any = {
                        wardId: r.Ward_wardId,
                        clothName: r.clothName,
                        clothId: r.Cloth_clothId,
                      };
                      if (this.select === 1) {
                        obj[r.monthId] = r.amountClothReal;
                      } else {
                        obj[r.monthId] = r.amountCloth;
                      }
                      this.showList.push(obj);
                    } else {
                      this.num = _.findIndex(this.showList, ['clothId', r.Cloth_clothId]);
                      if (this.select === 1) {
                        this.showList[this.num][r.monthId] += r.amountClothReal;
                      } else {
                        this.showList[this.num][r.monthId] += r.amountCloth;
                      }
                    }
                  }
                }
              } else {
                month1 = moment(this.dateSearch1).add(i, 'month').subtract(1, 'days').format('YYYY-MM-DD');
                month2 = moment(this.dateSearch1).add(i + 1, 'month').format('YYYY-MM-DD');
                if (this.select === 1) {
                  row1 = await this.requisitionService.searchByWard(wardId, month1, month2);
                } else {
                  row1 = await this.withdrawService.searchByWardDetail(wardId, month1, month2);
                }
                if (row1.rows.length > 1) {
                  // console.log(i, month1, month2);
                  for (const r of row1.rows) {
                    if (this.select === 1) {
                      // tslint:disable-next-line: radix
                      r.monthId = parseInt(moment(r.reqDate).format('MM'));
                    } else {
                      // tslint:disable-next-line: radix
                      r.monthId = parseInt(moment(r.withdrawDate).format('MM'));
                    }
                    if (_.findIndex(this.showList, ['clothId', r.Cloth_clothId]) < 0) {
                      const obj: any = {
                        wardId: r.Ward_wardId,
                        clothName: r.clothName,
                        clothId: r.Cloth_clothId,
                      };
                      if (this.select === 1) {
                        obj[r.monthId] = r.amountClothReal;
                      } else {
                        obj[r.monthId] = r.amountCloth;
                      }
                      this.showList.push(obj);
                    } else {
                      this.num = _.findIndex(this.showList, ['clothId', r.Cloth_clothId]);
                      if (this.select === 1) {
                        this.showList[this.num][r.monthId] += r.amountClothReal;
                      } else {
                        this.showList[this.num][r.monthId] += r.amountCloth;
                      }
                    }
                  }
                }
              }
            }
          } else {
            month1 = moment(this.dateSearch1).subtract(1, 'days').format('YYYY-MM-DD');
            month2 = moment(this.dateSearch2).add(1, 'days').format('YYYY-MM-DD');
            if (this.select === 1) {
              row1 = await this.requisitionService.searchByWard(wardId, month1, month2);
            } else {
              row1 = await this.withdrawService.searchByWardDetail(wardId, month1, month2);
            }
            if (row1.rows.length > 1) {
              for (const r of row1.rows) {
                if (this.select === 1) {
                  // tslint:disable-next-line: radix
                  r.monthId = parseInt(moment(r.reqDate).format('MM'));
                } else {
                  // tslint:disable-next-line: radix
                  r.monthId = parseInt(moment(r.withdrawDate).format('MM'));
                }
                if (_.findIndex(this.showList, ['clothId', r.Cloth_clothId]) < 0) {
                  const obj: any = {
                    wardId: r.Ward_wardId,
                    clothName: r.clothName,
                    clothId: r.Cloth_clothId,
                  };
                  if (this.select === 1) {
                    obj[r.monthId] = r.amountClothReal;
                  } else {
                    obj[r.monthId] = r.amountCloth;
                  }
                  this.showList.push(obj);
                } else {
                  this.num = _.findIndex(this.showList, ['clothId', r.Cloth_clothId]);
                  if (this.select === 1) {
                    this.showList[this.num][r.monthId] += r.amountClothReal;
                  } else {
                    this.showList[this.num][r.monthId] += r.amountCloth;
                  }
                }
              }
            }
          }
        }
      }
    }
    console.log(this.showList);

  }

  exportToExcel() {
    const ws: xlsx.WorkSheet =
      xlsx.utils.table_to_sheet(this.epltable.nativeElement);
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
    if (this.select === 1) {
      xlsx.writeFile(wb, 'ภาพรวม_การเบิกผ้า.xlsx');
    } else {
      xlsx.writeFile(wb, 'ภาพรวม_การจ่ายผ้า.xlsx');
    }
  }

}
