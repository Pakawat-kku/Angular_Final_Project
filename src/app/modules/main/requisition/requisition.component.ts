import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { RequisitionService } from './../../../services/requisition.service';
import { StockService } from './../../../services/stock.service';
import { throwError, fromEvent } from 'rxjs';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { NgForm, FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../../services//Authentication.service';
import { UsersService } from '../../../services/users.service';
import * as jwt_decode from 'jwt-decode';
import { InputArray, InputDummy, InputPurchase } from './inputArray';
import { Select2OptionData } from 'ng2-select2';
import { endWith } from 'rxjs/operators';
import { LocaleHelperService } from '@clr/angular/forms/datepicker/providers/locale-helper.service';

@Component({
  selector: 'app-requisition',
  templateUrl: './requisition.component.html',
  styleUrls: ['./requisition.component.scss'],

})
export class RequisitionComponent implements OnInit, OnDestroy {
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
  exampleData: Array<Select2OptionData>;
  time: string;
  value: string[];
  unNormal = 0;
  minus = 0;
  i = 0;
  ddd: any;
  unRepeat = 0;
  hour: any;
  min: any;

  constructor(
    private alertService: AlertService,
    private stockService: StockService,
    private requisitionService: RequisitionService,
    private router: Router,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private userService: UsersService,

  ) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(users => {
      this.currentUser = users;
      this.decoded = jwt_decode(users.token);
      this.exampleData = [];

    });
  }

  async ngOnInit() {
    moment.locale('th');
    this.getDate();
    await this.getCloth();
    this.checkTime();
    // this.exampleData = this.clothList;
  }

  getDate() {
    this.date = moment().add(543, 'years').format('DD MMMM YYYY');
    // console.log('date', this.date);

    this.dates = moment().format('YYYY-MM-DD HH:mm.ss');
    // console.log('dates', this.dates);

    this.time = moment().format('HH:mm');
    this.reqId = this.decoded.Ward_wardId + moment().format('YYYYMMDDHHmmss');
  }

  checkTime() {
    // tslint:disable-next-line: radix
    this.hour = parseInt(moment().format('HH'));
    // tslint:disable-next-line: radix
    this.min = parseInt(moment().format('mm'));
    console.log(this.hour, this.min);
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

  async onSave() {
    // console.log('this.purchaseLists', this.purchaseLists);

    let unNormal = 0;
    let unRepeat = 0;
    let dumNum = 0;
    let purchNum = 0;

    for (const item of this.purchaseLists) {
      if (item.amountCloth <= 0 || item.amountCloth === null) {
        unNormal = unNormal + 1;
        // console.log('unNormal', unNormal);
      } else {
        //  console.log('clothAmountปกติ');
      }
    }

    for (let i = 0; i < this.purchaseLists.length; i++) {
      this.dummyLists[i] = this.purchaseLists[i].clothId;
    }

    purchNum = _.size(this.purchaseLists);
    dumNum = _.size(_.uniq(this.dummyLists));

    // console.log('purchNum', purchNum );
    // console.log('dumNum' , dumNum);
    // console.log('dummylist', this.dummyLists );
    // console.log('uniq' , _.uniq(this.dummyLists));

    if (dumNum < purchNum) {
      // console.log('มีผ้าซ้ำ');
      unRepeat = unRepeat + 1;
      // console.log('this.unRepeat', unRepeat);
    } else {
      // console.log('ไม่มีผ้าซ้ำ');

    }

    // console.log('intersection', _.intersection(_.uniq(this.dummyLists) , this.dummyLists));
    // console.log(unNormal);
    // console.log(unRepeat);


    // _.difference(this.dummyLists, [2, 3]);


    await this.getDate();

    try {
      if (unNormal === 0 && unRepeat === 0) {

        const obj = {
          requisitionCode: this.reqId,
          reqDate: this.dates,
          status: '0',
          Users_userId: this.decoded.userId,
          Ward_wardId: this.decoded.Ward_wardId
        };
        // console.log('obj', obj);

        const result: any = await this.requisitionService.insertRealReq(obj);

        for (const row of this.purchaseLists) {
          // if (this.unNormal === 0) {

          const obj1 = {
            // id: 0,
            amountCloth: row.amountCloth,
            Cloth_clothId: row.clothId,
            Requisition_requisitionCode: this.reqId,
            requisitionDetailStatus: '0',
            amountClothReal: row.amountCloth

          };
          // console.log('obj1', obj1);
          const dataInsert: any = this.requisitionService.insertReq(obj1);

          this.alertService.reqSuccess('บันทึกข้อมูลเรียบร้อย');
          await this.router.navigate(['main/requisition-bill-detail/' + this.reqId]);
        }

      } if (unNormal !== 0) {
        this.alertService.error('กรุณาตรวจสอบจำนวนที่ต้องการเบิก');
        this.unNormal = 0;
        this.unRepeat = 0;

      } if (unRepeat !== 0) {
        this.alertService.error('กรุณาตรวจสอบรายการผ้าซ้ำ');
        this.unNormal = 0;
        this.unRepeat = 0;

      } if (unRepeat !== 0 && unNormal !== 0) {
        this.alertService.error('กรุณาตรวจสอบรายการผ้าซ้ำและจำนวนที่ต้องการเบิก');
        this.unNormal = 0;
        this.unRepeat = 0;
      }

    } catch (error) {
      console.log(error);

    }
  }

  // this.options = {
  //   multiple: true,
  //   theme: 'classic',
  //   closeOnSelect: false
  // }
  // async showBill(data) {
  //   this.modalBill = true;
  //     this.bill = data;
  //     console.log('this.requisitionCode' , this.bill);
  //     try {
  //       const result: any = await this.requisitionService.showReqWaitDetail(this.bill);
  //       console.log('result', result);
  //       if (result.rows) {
  //         this.regWaitDetail = result.rows;
  //         console.log('this.regWaitDetail', this.regWaitDetail);

  //       }

  //     } catch (err) {
  //       console.log(err);
  //     }

  //   }


  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.currentUserSubscription.unsubscribe();
  }

}
