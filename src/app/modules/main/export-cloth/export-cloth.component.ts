import { Component, OnInit, OnDestroy } from '@angular/core';
import { InputArray, InputPurchase } from './inputArray';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../../services//Authentication.service';
import { NgForm, FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import * as jwt_decode from 'jwt-decode';
import * as _ from 'lodash';
import * as moment from 'moment';
import { IMyOptions } from 'mydatepicker-th';
import { CompanyService } from './../../../services/company.service';
import { ExportService } from './../../../services/export.service';


@Component({
  selector: 'app-export-cloth',
  templateUrl: './export-cloth.component.html',
  styleUrls: ['./export-cloth.component.scss']
})
export class ExportClothComponent implements OnInit, OnDestroy {
  myDatePickerOptions: IMyOptions = {
    dateFormat: 'dd mmm yyyy',
    disableWeekends: false, // วันหยุด
    markCurrentDay: true,
    disableDays: []
  };
  currentUserSubscription: Subscription;
  currentUser: any;
  decoded: any;
  day: any;
  month: any;
  year: any;
  amount: Number;
  date: any;
  arrayList: Array<InputArray> = [];
  exportList: any[] = [{
    weighCloth: null,
    weighCar: null,
    // price: null
  }];
  exportClothType: any;
  reqId: any;
  modalBill = false;
  bill: any;
  regWaitDetail: any;
  options = {
    multiple: true,
    theme: 'classic',
    closeOnSelect: false
  };
  time: string;
  currentRow: any;
  disabled = false;
  model: Object = { date: { year: 2019, month: 12, day: 25 } };
  exportClothCode: any;
  resultYear: number;
  resultMonth: number;
  resultDay: number;
  companyList: any;
  company: any;
  exportClothTotalWeight = 0;
  dates: string;

  constructor(
    private alertService: AlertService,
    private companyService: CompanyService,
    private exportService: ExportService,
    private router: Router,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
  ) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(users => {
      this.currentUser = users;
      console.log('users', users);
      this.decoded = jwt_decode(users.token);
      console.log('decoded', this.decoded);
    });
  }

  async ngOnInit() {
    moment.locale('th');
    this.getDate();
    this.getCompany();
  }

  async getCompany() {
    const result: any = await this.companyService.getCompany();
    if (result.rows) {
      this.companyList = result.rows;
      console.log('company', this.companyList);
    }
  }

  getCopyOfOptions(): IMyOptions {
    return JSON.parse(JSON.stringify(this.myDatePickerOptions));
  }


  getDate() {
    moment.locale('th');

    this.date = moment().add(543, 'years').format('DD MMMM YYYY');
    console.log('date', this.date);

    this.dates = moment().format('YYYY-MM-DD');
    console.log('dates', this.dates);

    this.time = moment().format('HH:mm');
    // tslint:disable-next-line: radix
    this.day = parseInt(moment().format('DD'));
    // tslint:disable-next-line: radix
    this.month = parseInt(moment().format('MM'));
    // tslint:disable-next-line: radix
    this.year = parseInt(moment().add(543, 'years').format('YYYY'));
    console.log('day', this.day);
    console.log('month', this.month);
    console.log('year', this.year);
    this.exportClothCode = '1' + moment().format('YYYYMMDDHHmmss');
    // รหัสบริษัท​ + วันปีเดือนวันชั่วโมงวินาทีส่งออก
  }

  onClickSubmit(formData) {
    console.log(formData);
    if (formData.amount < 1) {
      this.alertService.error('จำนวนรายการผ้าที่สั่งซื้อไม่ถูกต้อง');
    } else {
      this.amount = formData.amount;
      for (let i = 0; i < this.amount; i++) {
        const arrayId = new InputArray();
        this.exportList.push({
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


  async addNewRow(rowNo) {
    if (rowNo + 1 === this.exportList.length && this.exportList[rowNo].weighCar > 0) {
      await this.exportList.push({
        clothId: '1',
        weighCloth: null,
        weighCar
  : null,

      });
    }
  }

  async onDelete(rowNo) {
    const result: any = await this.alertService.confirm('ยืนยันการลบ ?');
    if (result.value) {
      const data: any = [];
      this.exportList.forEach((row, index) => {
        if (rowNo !== index) {
          data.push(row);
        }
      });
      this.exportList = data;
      console.log('del', this.exportList);
    }
  }

  async onSave() {
    try {
    console.log('this.exportList', this.exportList);
    console.log('exportClothType', this.exportClothType);

    this.getDate();
    console.log();


    // this.resultDay = this.model.date.day - this.day;
    // this.resultMonth = this.model.date.month - this.month;
    // this.resultYear = (this.model.date.year + 543) - this.year;

    // console.log('resultDay',  this.resultDay ); // เป็นint อยู่แล้ว
    // console.log('resultMonth', this.resultMonth);
    // console.log('resultYear', this.resultYear);

    // tslint:disable-next-line: max-line-length
    if (this.resultDay <= 0 && this.resultMonth <= 0 && this.resultYear <= 0 && this.exportClothType && this.exportClothType !== undefined) {
    await this.getDate();
    // tslint:disable-next-line: no-unused-expression
    console.log('diff' , (this.exportList, [0]));

    for (const row of this.exportList) {
      console.log('row.weighCloth', row.weighCloth);
      // tslint:disable-next-line: radix
      this.exportClothTotalWeight = this.exportClothTotalWeight + row.weighCloth;
    }

    const obj = {
      exportClothCode: this.exportClothCode,
      exportClothDate : this.dates,
      exportClothUserExport :  this.decoded.firstname,
      exportClothType	: this.exportClothType,
      Company_idCompany :  this.company,
      exportClothTotalWeight : this.exportClothTotalWeight,
    };
    console.log('obj', obj);

    const result: any = this.exportService.insertExportCloth(obj);

    for (const row of this.exportList) {

        if (row.weighCloth > 0 && row.weighCar > 0) {
         const obj1 = {
            ExportCloth_exportClothCode: this.exportClothCode,
            exportDetailWeightCloth: row.weighCloth,
            exportDetailWeightCar	: row.weighCar,
            // exportClothTotalWeight : this.exportClothTotalWeight,

          };
          console.log('obj1', obj1);
          const dataInsert: any = this.exportService.insertExportDetail(obj1);
          if (dataInsert.rows) {
            console.log('check', dataInsert.rows);
          }
      }
    }

      this.alertService.reqSuccess('บันทึกข้อมูลเรียบร้อย');
      await this.router.navigate(['main/export-cloth-bill/' + this.exportClothCode]);
       } else {
        this.alertService.error('ไม่สามารถบันทึกข้อมูลได้ โปรดตรวจสอบความถูกต้อง');
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
