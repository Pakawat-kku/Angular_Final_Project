import { StockService } from './../../../services/stock.service';
import { AlertService } from './../../../services/alert.service';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
import { InputArray, InputPurchase } from './inputArray';
import { Select2OptionData } from 'ng2-select2';
import { PurchaseService } from 'src/app/services/purchase.service';
import { Router } from '@angular/router';
import { WareHouseService } from './../../../services/wareHouse.service';

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
  pee: string;
  totalPrice: number = 0;
  purchaseId: number;
  totalPricePerUnit: number = 0;
  arrayList: Array<InputArray> = [];
  public clothList: Array<Select2OptionData>;
  public clothLists: Array<Select2OptionData>;
  purchaseLists: any[] = [{
    clothId: '1',
    amount: null,
    price: null
  }];
  k: number = 0;
  constructor(
    private router: Router,
    private alert: AlertService,
    private stockService: StockService,
    private purchaseService: PurchaseService,
    private wareHouseService: WareHouseService,

  ) {

  }

  async ngOnInit() {
    moment.locale('th');
    this.checkYear();
    // this.getDate();
    await this.getCloth();
    this.clothLists = [{ id: '1', text: 'test1' }, { id: '2', text: 'test2' }];
    this.day = moment().format('DD MMMM');
    this.pee = moment().add(543, 'years').format('YYYY');
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
      this.alert.error('จำนวนรายการผ้าที่สั่งซื้อไม่ถูกต้อง');
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
      // console.log('arraylist', this.arrayList);
    }
    this.amount = 0;
  }

  async getCloth() {
    const result: any = await this.stockService.getCloth();
    if (result.rows) {
      this.clothList = result.rows;
      // console.log('cloth', this.clothList);
    }
  }

  async addNewRow(rowNo) {
    if (rowNo + 1 === this.purchaseLists.length && this.purchaseLists[rowNo].amount > 0 && this.purchaseLists[rowNo].price > 0) {
      await this.purchaseLists.push({
        clothId: '1',
        amount: null,
        price: null
      });
    }
  }

  async onDelete(rowNo) {
    const result: any = await this.alert.confirm('ยืนยันการลบ ?');
    if (result.value) {
      const data: any = [];
      this.purchaseLists.forEach((row, index) => {
        if (rowNo !== index) {
          data.push(row);
        }
      });
      this.purchaseLists = data;
      // console.log('del', this.purchaseLists);
    }
  }

  async onSave(data) {
    console.log('check chong', this.purchaseLists);
    let saveData: any = [];
    for (let row of this.purchaseLists) {
      this.totalPricePerUnit = 0;
      if (row.amount > 0 && row.price > 0) {
        await saveData.push(row);
        this.totalPricePerUnit = row.amount * row.price;
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
        for (let row of this.purchaseLists) {
          this.totalPricePerUnit = 0;
          if (row.amount > 0 && row.price > 0) {
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
            console.log('result.rows', result.rows);

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
            }
          }
        }
        this.alert.success('บันทึกข้อมูลเรียบร้อย');
        this.router.navigate(['main/report-purchase-detail/' + this.purchaseId]);
      }
    } catch (error) {
      console.log(error);
    }
  }
}

