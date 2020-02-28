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
  reqId: any;
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
  string = '';
  cloth: any;

  constructor (
    private alertService: AlertService,
    private router: Router,
    private stockService: StockService,
    private wareHouseService: WareHouseService,
    private availableService: AvailableService,

  ) { }

  async ngOnInit() {
    moment.locale('th');
    this.getDate();
    await this.getCloth();
    for (const item of this.purchaseLists) {
      const result: any = await this.wareHouseService.getWareHouse(item.clothId);
      console.log('result', result.rows);
        if (result.rows.length === 0) {
          item.warehouseAmount = 0;
        } else {
          item.warehouseAmount = result.rows[0].warehouseAmount;
        }
    }
    // this.exampleData = this.clothList;
  }

  getDate() {
    this.date = moment().add(543, 'years').format('DD MMMM YYYY');
    console.log('date', this.date);

    this.dates = moment().format('YYYY-MM-DD HH:mm.ss');
    console.log('dates', this.dates);

    this.time = moment().format('HH:mm');
    // this.reqId = this.decoded.Ward_wardId + moment().format('YYYYMMDDHHmmss');
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
      console.log('result', result.rows);
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
      console.log('result', result.rows);
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
      console.log('del', this.purchaseLists);
    }
  }

  async onSave() {
    console.log('this.purchaseLists', this.purchaseLists);

    let unNormal = 0;


    for (let i = 0; i < this.purchaseLists.length; i++) {
      console.log('this.purchaseLists.amountCloth', this.purchaseLists[i].amountCloth);

      if (this.purchaseLists[i].amountCloth <= 0 || this.purchaseLists[i].amountCloth === null) {
        unNormal = unNormal + 1;
        this.unRepeat = i + 1 + '';
        this.unRepeatString += this.unRepeat + ' ';
      } else {
        console.log('clothAmountปกติ');
      }
    }
    console.log('this.unRepeatString' , this.unRepeatString);

    const k = [];

    let m = 0;

    for (let i = 0; i < this.purchaseLists.length - 1; i++) {

      for (let j = i + 1; j < this.purchaseLists.length; j++) {

        if (this.purchaseLists[i].clothId === this.purchaseLists[j].clothId) {

          k[m] = this.purchaseLists[i].clothId;
          m++;
        }
      }
    }

    console.log('k', k);
    console.log('unnormal' , unNormal);

    if (k.length !== 0 || unNormal !== 0 ) {
      if (unNormal !== 0) {
        this.alertService.error('กรุณาตรวจสอบรายการที่ ' + this.unRepeatString);
        unNormal = 0;
        this.unRepeatString = '';
      } else {
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

    } else {
      console.log('ผ่าน');

      await this.getDate();

      try {

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
            const result3: any = await this.wareHouseService.updateWareHouse(row.clothId , obj3);

          } else {

            const obj2 = {
              AvailableAmount: row.amountCloth + result4.rows[0].AvailableAmount,
            };
            console.log('obj2', obj2);
            const result: any = await this.availableService.updateAvailable(row.clothId , obj2);

            const obj3 = {
              warehouseAmount: result2.rows[0].warehouseAmount - row.amountCloth,
            };

            console.log('obj3', obj3);
            const result3: any = await this.wareHouseService.updateWareHouse(row.clothId , obj3);

          }
          this.alertService.reqSuccess('นำผ้าเข้าส่วนกลางสำเร็จ');
          await this.router.navigate(['main/available']);
        }

      } catch (error) {
        console.log(error);

      }
    }
  }

//   async onL(){
//     for (const row of this.clothList) {

//       const result2: any = await this.wareHouseService.getWareHouse(row.clothId);
//       const result4: any = await this.availableService.getAvailable(row.clothId);
//       if (result4.rows.length === 0) {
//         const obj1 = {
//           Cloth_clothId: row.clothId,
//           AvailableAmount: 500 + 0,
//         };
//         const result: any = await this.availableService.insertAvailable(obj1);

//         const obj3 = {
//           warehouseAmount: 10000 - 500,
//         };

//         const result3: any = await this.wareHouseService.updateWareHouse(row.clothId , obj3);

//       }
//   }
// }


  async checkValue() {
    console.log('checkValue' , this.purchaseLists);
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
