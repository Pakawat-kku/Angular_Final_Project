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
import { Users } from '../register/users';
import { AuthenticationService } from '../../../services//Authentication.service';
import { UsersService } from '../../../services/users.service';
import * as jwt_decode from 'jwt-decode';
import { InputArray, InputPurchase } from './inputArray';
import { Select2OptionData } from 'ng2-select2';
import { endWith } from 'rxjs/operators';

@Component({
  selector: 'app-requisition',
  templateUrl: './requisition.component.html',
  styleUrls: ['./requisition.component.scss'],

})
export class RequisitionComponent implements OnInit, OnDestroy {
  currentUser: Users;
  currentUserSubscription: Subscription;
  decoded: any;
  month: any;
  year: any;
  amount: Number;
  date: string;
  purchaseId: number;
  arrayList: Array<InputArray> = [];
  public clothList: Array<Select2OptionData>;
  public clothLists: Array<Select2OptionData>;
  purchaseLists: any[] = [{
    clothId: '1',
    amountCloth: null,
    // price: null
  }];
  reqId: any;
  modalBill = false;
  bill: any;
  regWaitDetail: any;
  exampleData: Array<Select2OptionData>;
  options = {
    multiple: true,
    theme: 'classic',
    closeOnSelect: false
  };

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
      console.log('users', users);
      this.decoded = jwt_decode(users.token);
      console.log('decoded', this.decoded);

    });
  }

  async ngOnInit() {
    // this.checkYear();
    this.getDate();
    await this.getCloth();

  }

  getDate() {
    moment.locale('th');
    this.date = moment().format('YYYY-MM-DD HH:mm:ss');
    console.log('date', this.date);
    this.reqId = this.decoded.Ward_wardId + ' ' + moment().format('YYYY-MM-DD HH:mm:ss');
  }

  onClickSubmit(formData) {
    console.log(formData);
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
    if (rowNo + 1 === this.purchaseLists.length && this.purchaseLists[rowNo].amountCloth > 0) {
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
      console.log('del', this.purchaseLists);
    }
  }

  async onSave() {
    console.log('this.purchaseLists', this.purchaseLists);
    await this.getDate();
    // tslint:disable-next-line: no-unused-expression
    console.log('diff' , (this.purchaseLists, [0]));
    try {
      const obj = {
        requisitionCode: this.reqId,
        reqDate: this.date,
        status: '1',
        Users_userId: this.decoded.userId,
        Ward_wardId: this.decoded.Ward_wardId
      };
      console.log('obj', obj);

      const result: any = await this.requisitionService.insertRealReq(obj);

      for (const row of this.purchaseLists) {

      if (row.amountCloth > 0) {

         const obj1 = {
            // id: 0,
            amountCloth: row.amountCloth,
            Cloth_clothId: row.clothId,
            Requisition_requisitionCode	: this.reqId
          };
          console.log('obj1', obj1);
          const dataInsert: any = this.requisitionService.insertReq(obj1);
          if (dataInsert.rows) {
            console.log('check', dataInsert.rows);
          }
        }
      }

      this.alertService.reqSuccess('บันทึกข้อมูลเรียบร้อย');
      this.router.navigate(['main/requisition-bill-detail/' + this.reqId]);

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
