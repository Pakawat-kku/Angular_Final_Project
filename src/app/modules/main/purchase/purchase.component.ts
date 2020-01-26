import { StockService } from './../../../services/stock.service';
import { AlertService } from './../../../services/alert.service';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Select2OptionData } from 'ng2-select2';
import { PurchaseService } from 'src/app/services/purchase.service';
import { Router } from '@angular/router';
import { InputArray } from './inputArray';

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

  constructor(
    private router: Router,
    private alertService: AlertService,
    private stockService: StockService,
    private purchaseService: PurchaseService
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
      // console.log('del', this.purchaseLists);
    }
  }

  async onSave(data) {
    // console.log('check chong', this.purchaseLists);
    let saveData: any = [];
    let unRepeat = 0;
    let dumNum = 0;
    let purchNum = 0;
    let intersect = 0;
    let val = 0;

    console.log('pur', this.purchaseLists);

    let i = 0;
    for (let row of this.purchaseLists) {
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
      } else if (row.pricw <= 0) {
        this.alertService.error('รายการที่ ' + i + ' ราคาผิดพลาด');
        val++;
      }
    }
    if (val === 0) {
      for (let i = 0; i < this.purchaseLists.length; i++) {
        this.dummy[i] = this.purchaseLists[i].clothId;
      }
      purchNum = _.size(this.purchaseLists);
      dumNum = _.size(_.uniq(this.dummy));
      if (dumNum < purchNum) {
        console.log('มีผ้าซ้ำ');
        unRepeat = unRepeat + 1;
        console.log('this.unRepeat', unRepeat);
      } else {
        console.log('ไม่มีผ้าซ้ำ');
      }
      if (unRepeat !== 0) {
        this.alertService.error('กรุณาตรวจสอบรายการผ้าซ้ำ');
      } else {
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
                // console.log('obj', data);
                const dataInsert: any = await this.purchaseService.insertPurchaseDetail(data);
                if (dataInsert.rows) {
                  // console.log('check', dataInsert.rows);
                }
              }
            }
            this.alertService.success('บันทึกข้อมูลเรียบร้อย');
            this.router.navigate(['main/report-purchase-detail/' + this.purchaseId]);
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
  }
}

