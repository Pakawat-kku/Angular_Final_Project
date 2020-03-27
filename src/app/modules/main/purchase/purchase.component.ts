import { StockService } from './../../../services/stock.service';
import { AlertService } from './../../../services/alert.service';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
import { PurchaseService } from 'src/app/services/purchase.service';
import { Router, ActivatedRoute } from '@angular/router';
import { WareHouseService } from './../../../services/wareHouse.service';
import { InputArray } from './inputArray';

import * as jwt_decode from 'jwt-decode';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../../services//Authentication.service';
import { UsersAuthorityService } from 'src/app/services/users-authority.service';
@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.scss']
})
export class PurchaseComponent implements OnInit {
  month: any;
  year: any;
  amount: Number;
  date: string;
  day: string;
  dummy: any = [];
  pee: string;
  totalPrice = 0;
  purchaseId: number;
  totalPricePerUnit = 0;
  arrayList: Array<InputArray> = [];
  // public clothList: Array<Select2OptionData>;
  // public clothLists: Array<Select2OptionData>;
  clothList: any = [];
  purchaseLists: any[] = [{
    clothId: '1',
    amount: null,
    price: null
  }];
  k = 0;
  currentUser: any;
  currentUserSubscription: Subscription;
  decoded: any ;
  authority: any = [];

  constructor(
    private router: Router,
    private alertService: AlertService,
    private stockService: StockService,
    private purchaseService: PurchaseService,
    private wareHouseService: WareHouseService,
    private _Activatedroute: ActivatedRoute,
    private users_authorityService: UsersAuthorityService,
    private authenticationService: AuthenticationService,

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
    if (this.authority.three !== 'true') {
      this.alertService.error();
      this.router.navigate(['main/main']);
    } else {
    moment.locale('th');
    this.checkYear();
    // this.getDate();
    await this.getCloth();
    // this.clothLists = [{ id: '1', text: 'test1' }, { id: '2', text: 'test2' }];
    this.day = moment().format('DD MMMM');
    this.pee = moment().add(543, 'years').format('YYYY');
  }
}

  async checkYear() {
    this.month = moment().format('MM');
    // tslint:disable-next-line: radix
    if (parseInt(this.month) > 9) {
      this.year = moment().add(543, 'years').format('YYYY');
    } else {
      this.year = moment().add(542, 'years').format('YYYY');
    }
  }

  getDate() {
    moment.locale('th');
    this.date = moment().format('YYYY-MM-DD HH:mm:ss');
    // console.log('date', this.date);
  }

  onClickSubmit(formData) {
    // console.log(formData);
    if (formData.amount < 1) {
      this.alertService.error('จำนวนรายการผ้าที่สั่งซื้อไม่ถูกต้อง');
    } else {
      this.amount = formData.amount;
      for (let i = 0; i < this.amount; i++) {
        const arrayId = new InputArray();
        this.purchaseLists.push({
          clothId: '1',
          amount: null,
          price: null
        });
        arrayId.id = i + 1;
        this.arrayList.push(arrayId);
      }

    }
    this.amount = 0;
  }

  async getCloth() {
    const result: any = await this.stockService.getCloth();
    if (result.rows) {
      this.clothList = result.rows;
    }
  }

  async addNewRow() {
    await this.purchaseLists.push({
      clothId: '1',
      amount: null,
      price: null
    });
  }

  async onDelete(rowNo) {
    const result: any = await this.alertService.confirm('ยืนยันการลบ ?');
    if (result.value) {
      const data: any = [];
      this.purchaseLists.forEach((row, index) => {
        if (rowNo !== index) {
          data.push(row);
        }
      });
      this.purchaseLists = data;
    }
  }

  async onSave(data) {
    console.log('check chong', this.purchaseLists);

    const saveData: any = [];
    let unRepeat = 0;
    let dumNum = 0;
    let purchNum = 0;
    let val = 0;
    let k = [];
    let m = 0;

    // tslint:disable-next-line: no-shadowed-variable
    for (let i = 0; i < this.purchaseLists.length - 1; i++) {
      for (let j = i + 1; j < this.purchaseLists.length; j++) {
        if (this.purchaseLists[i].clothId === this.purchaseLists[j].clothId) {
          k[m] = this.purchaseLists[j].clothId;
          m++;
        }
      }
    }
    console.log(k);

    let i = 0;
    for (const row of this.purchaseLists) {
      i++;
      if (row.amount === null || row.amount === undefined || row.amount === '') {
        this.alertService.error('รายการที่ ' + i + ' ไม่มีจำนวนผ้า');
        val++;
      } else if (row.price === null || row.price === undefined || row.price === '') {
        this.alertService.error('รายการที่ ' + i + ' ไม่มีราคาผ้า');
        val++;
      } else if (row.amount <= 0) {
        this.alertService.error('รายการที่ ' + i + ' จำนวนผิดพลาด');
        val++;
      } else if (row.price <= 0) {
        this.alertService.error('รายการที่ ' + i + ' ราคาผิดพลาด');
        val++;
      }
    }
    if (val === 0) {
      // tslint:disable-next-line: no-shadowed-variable
      for (let i = 0; i < this.purchaseLists.length; i++) {
        this.dummy[i] = this.purchaseLists[i].clothId;
      }
      purchNum = _.size(this.purchaseLists);
      dumNum = _.size(_.uniq(this.dummy));
      if (dumNum < purchNum) {
        unRepeat = unRepeat + 1;
      }
      if (unRepeat !== 0) {
        this.alertService.error('กรุณาตรวจสอบรายการผ้าซ้ำ');
      } else {
        for (const row of this.purchaseLists) {
          this.totalPricePerUnit = 0;
          if (row.amount > 0 && row.price > 0) {
            await saveData.push(row);
            this.totalPricePerUnit = row.amount * row.price;
            // console.log('total price', this.totalPricePerUnit);
            const data = {
              id: 0,
              amountCloth: row.amount,
              pricePerUnit: row.price,
              totalPrice: this.totalPricePerUnit,
              Purchase_purchaseId: this.purchaseId,
              Cloth_clothId: row.clothId
            };
            // ส่วนของการ update เข้า warehouse
            const result: any = await this.wareHouseService.getWareHouse(row.clothId);

            if (result.rows.length === 0) {
              const data1 = {
                Cloth_clothId: row.clothId,
                warehouseAmount: row.amount,
              };
              const result1: any = await this.wareHouseService.insertWareHouse(data1);
            } if (result.rows.length !== 0) {

              this.k = result.rows[0].warehouseAmount + row.amount;
              console.log('k', this.k);
              console.log('กรณีสอง');
              const data2 = {
                warehouseAmount: this.k,
              };
              const result1: any = await this.wareHouseService.updateWareHouse(row.clothId, data2);
            }
            // ส่วนของการ update เข้า warehouse ถึงตรงนี้
            // console.log('obj', data);
            const dataInsert: any = await this.purchaseService.insertPurchaseDetail(data);
            if (dataInsert.rows) {
              // console.log('check', dataInsert.rows);
              this.totalPrice += this.totalPricePerUnit;
            }
          }
          await this.getDate();
          // console.log('save data', saveData);
          // console.log('save data price', this.totalPrice);
          const obj = {
            purchaseId: 0,
            totalPrice: this.totalPrice,
            purchaseDate: this.date
          };
          try {
            const result: any = await this.purchaseService.insertPurchase(obj);
            if (result.rows) {
              // console.log(result.rows);
            }
            const getPur: any = await this.purchaseService.getPurchase(this.totalPrice, this.date);
            if (getPur.rows) {
              // console.log('get', getPur.rows[0].purchaseId);
              this.purchaseId = getPur.rows[0].purchaseId;
              for (const row of this.purchaseLists) {
                this.totalPricePerUnit = 0;
                if (row.amount > 0 && row.price > 0) {
                  this.totalPricePerUnit = row.amount * row.price;
                  // console.log('total price', this.totalPricePerUnit);
                  // tslint:disable-next-line: no-shadowed-variable
                  const data = {
                    id: 0,
                    amountCloth: row.amount,
                    pricePerUnit: row.price,
                    totalPrice: this.totalPricePerUnit,
                    Purchase_purchaseId: this.purchaseId,
                    Cloth_clothId: row.clothId
                  };
                  // console.log('obj', data);
                  const dataInsert: any = await this.purchaseService.insertPurchaseDetail(data);
                  if (dataInsert.rows) {
                    // console.log('check', dataInsert.rows);
                  }
                }
              }

            }
          } catch (error) {
            console.log(error);
          }
        }
        this.alertService.success('บันทึกข้อมูลเรียบร้อย');
        this.router.navigate(['main/report-purchase-detail/' + this.purchaseId]);
      }
    }
  }

  // async onLazy() {
  //   for (let row of this.clothList) {
  //     const data = {
  //       warehouseAmount: 10000,
  //       warehousePrice: 200,
  //       Cloth_clothId: row.clothId
  //     };
  //     const result: any = await this.wareHouseService.insertWareHouse(data);
  //     if (result.rows) {
  //       console.log('pass');
  //     }
  //   }
  // }
}
