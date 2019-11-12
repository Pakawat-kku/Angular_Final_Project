import { StockService } from './../../../services/stock.service';
import { AlertService } from './../../../services/alert.service';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
import { InputArray, InputPurchase } from './inputArray';
import { Select2OptionData } from 'ng2-select2';

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
  public clothList: Array<Select2OptionData>;
  public clothLists: Array<Select2OptionData>;
  purchaseLists: any[] = [{
    clothId: '1',
    amount: null,
    price: null
  }];
  constructor(
    private alert: AlertService,
    private stockService: StockService
  ) { }

  async ngOnInit() {
    this.checkYear();
    await this.getCloth();
    this.clothLists = [{ id: '1', text: 'test1' }, { id: '2', text: 'test2' }];
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
        this.purchaseLists.push({
          clothId: '1',
          amount: null,
          price: null
        });
        arrayId.id = i + 1;
        this.arrayList.push(arrayId);
      }
      console.log('arraylist', this.arrayList);
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
      console.log('del', this.purchaseLists);
    }
  }

  async onSave(data) {
    console.log(this.purchaseLists);
    let saveData: any = [];
    for (let row of this.purchaseLists) {
      if (row.amount > 0 && row.price > 0) {
        await saveData.push(row);
        const result 
      }
    }
    console.log(saveData);
  }
}

