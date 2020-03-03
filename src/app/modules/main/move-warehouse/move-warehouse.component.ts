import { Component, OnInit } from '@angular/core';
import { StockService } from './../../../services/stock.service';
import { WareHouseService } from './../../../services/wareHouse.service';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { NgForm, FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { InputArray, InputDummy, InputPurchase } from './inputArray';
import { AvailableService } from './../../../services/available.service';
import { Warehouse_export_availableService } from './../../../services/Warehouse_export_available';
import { Warehouse_export_availableDetailService } from './../../../services/warehouse_export_availableDetail';
import { AuthenticationService } from '../../../services//Authentication.service';
import * as jwt_decode from 'jwt-decode';
import { analyzeFileForInjectables } from '@angular/compiler';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import * as jquery from 'jquery';

@Component({
  selector: 'app-move-warehouse',
  templateUrl: './move-warehouse.component.html',
  styleUrls: ['./move-warehouse.component.scss']
})
export class MoveWarehouseComponent implements OnInit {
  currentUser: any;
  currentUserSubscription: Subscription;
  decoded: any;
  month: any;
  year: any;
  amount: Number;
  date: string;
  dates: any;
  purchaseId: number;
  arrayList: Array<InputArray> = [];
  clothList: any;
  purchaseLists: any[] = [{
    clothId: '1',
    amountCloth: null,
    // price: null
  }];
  dummyLists: any[] = [{
    clothId: undefined
  }];
  warehouse_export_availableCode: any;
  modalBill = false;
  bill: any;
  regWaitDetail: any;
  // exampleData: Array<Select2OptionData>;
  time: string;
  value: string[];
  unNormal = 0;
  minus = 0;
  i = 0;
  ddd: any;
  unRepeat = '';
  unRepeatString = '';
  over = '';
  overString = '';
  string = '';
  cloth: any;
  title = 'angularselect2';

  constructor(
    private alertService: AlertService,
    private router: Router,
    private stockService: StockService,
    private wareHouseService: WareHouseService,
    private availableService: AvailableService,
    private warehouse_export_availableService: Warehouse_export_availableService,
    private warehouse_export_availableDetailService: Warehouse_export_availableDetailService,
    private authenticationService: AuthenticationService,


  ) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(users => {
      this.currentUser = users;
      this.decoded = jwt_decode(users.token);

    });
  }

  async ngOnInit() {
    // jquery('.js-example-basic-single').select2();
    moment.locale('th');
    await this.getCloth();
    for (const item of this.purchaseLists) {
      const result: any = await this.wareHouseService.getWareHouse(item.clothId);
      if (result.rows.length === 0) {
        item.warehouseAmount = 0;
      } else {
        item.warehouseAmount = result.rows[0].warehouseAmount;
      }
    }
    this.getDate();
   
  }

  getDate() {
    this.date = moment().add(543, 'years').format('DD MMMM YYYY');

    this.dates = moment().format('YYYY-MM-DD HH:mm.ss');

    this.time = moment().format('HH:mm');
    this.warehouse_export_availableCode = this.decoded.userId + moment().format('YYYYMMDDHHmmss');

  }

  async onClickSubmit(formData) {
    console.log(formData);
    if (formData.amount < 1) {
      this.alertService.error('จำนวนรายการผ้าที่สั่งซื้อไม่ถูกต้อง');
    } else {
      this.amount = formData.amount;
      for (let i = 0; i < this.amount; i++) {
        const arrayId = new InputArray();
        this.purchaseLists.push({
          clothId: '1',
          amountCloth: null,
        });
        // arrayId.id = i + 1;
        // this.arrayList.push(arrayId);
      }
      console.log('arraylist', this.arrayList);
    }
    for (const item of this.purchaseLists) {
      const result: any = await this.wareHouseService.getWareHouse(item.clothId);
      if (result.rows.length === 0) {
        item.warehouseAmount = 0;
      } else {
        item.warehouseAmount = result.rows[0].warehouseAmount;
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

  async addNewRow(rowNo) {
    // if (rowNo + 1 === this.purchaseLists.length && this.purchaseLists[rowNo].amountCloth > 0) {
    if (rowNo + 1 === this.purchaseLists.length) {

      await this.purchaseLists.push({
        clothId: '1',
        amountCloth: null,

      });
    }
    for (const item of this.purchaseLists) {
      const result: any = await this.wareHouseService.getWareHouse(item.clothId);
      if (result.rows.length === 0) {
        item.warehouseAmount = 0;
      } else {
        item.warehouseAmount = result.rows[0].warehouseAmount;
      }
    }
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

  async onSave() {
    console.log('this.purchaseLists', this.purchaseLists);
    let unNormal = 0;


    for (let i = 0; i < this.purchaseLists.length; i++) {

      if (this.purchaseLists[i].amountCloth <= 0 || this.purchaseLists[i].amountCloth === null) {
        unNormal = unNormal + 1;
        this.unRepeat = i + 1 + '';
        this.unRepeatString += this.unRepeat + ' ';
      } else {
        console.log('clothAmountปกติ');
      }
    }

    let k = [];

    let m = 0;

    for (let i = 0; i < this.purchaseLists.length - 1; i++) {

      for (let j = i + 1; j < this.purchaseLists.length; j++) {

        if (this.purchaseLists[i].clothId === this.purchaseLists[j].clothId) {

          k[m] = this.purchaseLists[i].clothId;
          m++;
        }
      }
    }

    let f = [];
    for (let i = 0; i < this.purchaseLists.length; i++) {
      if (this.purchaseLists[i].warehouseAmount < this.purchaseLists[i].amountCloth) {
        f[i] = this.purchaseLists[i].clothId;
        this.over = i + 1 + '';
        this.overString += this.over + ' ';
      }
    }
    console.log('f', f);
    console.log('k', k);
    console.log('unnormal', unNormal);

    if (k.length !== 0 || unNormal !== 0 || f.length !== 0) {
      if (unNormal !== 0) {
        this.alertService.error('กรุณาตรวจสอบรายการที่ ' + this.unRepeatString);
        unNormal = 0;
        this.unRepeatString = '';
      } if (k.length !== 0) {
        const result: any = await this.stockService.getCloth();
        this.cloth = result.rows;
        for (const item of this.cloth) {
          for (const items of _.uniq(k)) {
            // tslint:disable-next-line: radix
            if (item.clothId === parseInt(items)) {
              console.log('item.clothId', item.clothName);
              this.string += item.clothName + ' ';
            }
          }
        }
        this.alertService.error('มีการทำรายการผ้าซ้ำ คือ ' + this.string);
        this.string = '';
      }
      if (f.length !== 0) {

        this.alertService.error('ไม่สามารถเบิกจากคลังได้เนื่องจากรายการ' + this.overString + 'มีผ้าไม่เพียงพอ');
        this.overString = '';

      }

    } else {
      console.log('ผ่าน');

      await this.getDate();

      try {
        this.getDate();

        for (const row of this.purchaseLists) {
          const result2: any = await this.wareHouseService.getWareHouse(row.clothId);
          const result4: any = await this.availableService.getAvailable(row.clothId);
          console.log('result2', result2);
          console.log('result4', result4);
          if (result4.rows.length === 0) {
            const obj1 = {
              Cloth_clothId: row.clothId,
              AvailableAmount: row.amountCloth + 0,
            };
            console.log('obj1', obj1);
            const result: any = await this.availableService.insertAvailable(obj1);

            const obj3 = {
              warehouseAmount: result2.rows[0].warehouseAmount - row.amountCloth,
            };

            console.log('obj3', obj3);
            const result3: any = await this.wareHouseService.updateWareHouse(row.clothId, obj3);

            const obj6 = {
              warehouse_export_availableCode: this.warehouse_export_availableCode,
              Cloth_clothId: row.clothId,
              warehouse_export_availableAmount: row.amountCloth,
            };

            console.log('obj6', obj6);

            const result6: any = await this.warehouse_export_availableDetailService.insertWarehouse_export_availableDetail(obj6);
            console.log('result6', result6);

          } else {

            const obj2 = {
              AvailableAmount: row.amountCloth + result4.rows[0].AvailableAmount,
            };
            console.log('obj2', obj2);
            const result: any = await this.availableService.updateAvailable(row.clothId, obj2);

            const obj3 = {
              warehouseAmount: result2.rows[0].warehouseAmount - row.amountCloth,
            };

            console.log('obj3', obj3);
            const result3: any = await this.wareHouseService.updateWareHouse(row.clothId, obj3);

            const obj6 = {
              warehouse_export_availableCode: this.warehouse_export_availableCode,
              Cloth_clothId: row.clothId,
              warehouse_export_availableAmount: row.amountCloth,
            };
            console.log('obj6', obj6);


            const result6: any = await this.warehouse_export_availableDetailService.insertWarehouse_export_availableDetail(obj6);
            console.log('result6', result6);

          }
        }
        const obj5 = {
          warehouse_export_availableCode: this.warehouse_export_availableCode,
          warehouse_export_availableDate: this.dates,
          warehouse_export_available_userExport: this.decoded.userId
        };

        const result5: any = await this.warehouse_export_availableService.insertWarehouse_export_available(obj5);

        this.alertService.reqSuccess('นำผ้าเข้าส่วนกลางสำเร็จ');
        await this.router.navigate(['/main/move-warehouse-bill-detail/' + this.warehouse_export_availableCode]);

      } catch (error) {
        console.log(error);

      }
    }
  }


  async checkValue() {
    console.log('checkValue', this.purchaseLists);
    for (const item of this.purchaseLists) {
      const result: any = await this.wareHouseService.getWareHouse(item.clothId);
      console.log('result', result.rows);
      if (result.rows.length === 0) {
        item.warehouseAmount = 0;
      } else {
        item.warehouseAmount = result.rows[0].warehouseAmount;
      }
    }
    console.log('result.rows', this.purchaseLists);

  }

}
