import { StockService } from './../../../services/stock.service';
import { AlertService } from './../../../services/alert.service';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
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
  arrayList: Array<InputArray> = [];
  clothList: any;
  constructor(
    private alert: AlertService,
    private stockService: StockService
  ) { }

  ngOnInit() {
    this.checkYear();
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
  onClickSubmit(formData) {
    console.log(formData);
    if (formData.amount < 1) {
      this.alert.error('จำนวนรายการผ้าที่สั่งซื้อไม่ถูกต้อง');
    } else {
      this.amount = formData.amount;
      for (let i = 0; i < this.amount; i++) {
        const arrayId = new InputArray();
        arrayId.id = i + 1;
        this.arrayList.push(arrayId);
      }
      console.log(this.arrayList);
      this.getCloth();
    }
    this.amount = 0;
  }

  async getCloth() {
    const result: any = await this.stockService.getCloth();
    if (result.rows) {
      this.clothList = result.rows;
      console.log('cloth', this.clothList);
    }
  }
}

