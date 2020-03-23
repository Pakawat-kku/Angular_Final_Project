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

import { UsersAuthorityService } from 'src/app/services/users-authority.service';

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
    weightCloth: null,
    weightCar: null,
  }];
  exportClothType: any = 1;
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
  model: Object = { date: { year: 2020, month: 1, day: 15 } };
  exportClothCode: any;
  resultYear: number;
  resultMonth: number;
  resultDay: number;
  companyList: any;
  company: any = 1;
  exportClothTotalWeight = 0;
  dates: string;
  weightSum: number;
  calWeight = 0;
  sumWeightCloth = 0;
  exportDetailSumWeight = 0;
  exportCarId: any;
  exportClothUserImport: any;
  pass = 0;
  authority: any = [];

  constructor(
    private alertService: AlertService,
    private companyService: CompanyService,
    private exportService: ExportService,
    private router: Router,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private users_authorityService: UsersAuthorityService,
  ) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(users => {
      this.currentUser = users;
      console.log('users', users);
      this.decoded = jwt_decode(users.token);
      console.log('decoded', this.decoded);
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
    if (this.authority.eigth !== 'true') {
      this.alertService.error();
      this.router.navigate(['main/main']);
    } else {
    moment.locale('th');
    this.getDate();
    this.getCompany();
    // tslint:disable-next-line: no-unused-expression
  }
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
    this.dates = moment().format('YYYY-MM-DD');
    this.time = moment().format('HH:mm');
    // tslint:disable-next-line: radix
    this.day = parseInt(moment().format('DD'));
    // tslint:disable-next-line: radix
    this.month = parseInt(moment().format('MM'));
    // tslint:disable-next-line: radix
    this.year = parseInt(moment().add(543, 'years').format('YYYY'));

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
      await this.exportList.push({
        clothId: '1',
        weightCloth: null,
        weightCar
          : null,

      });
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
      console.log('exportCarId', this.exportCarId);
      console.log('this.exportList', this.exportList);
      console.log('exportClothType', this.exportClothType);
      this.getDate();
      // tslint:disable-next-line: no-unused-expression
      console.log('diff', (this.exportList, [0]));
      this.calculateWeight();
      if (this.exportClothType === 1) {
      for (let i = 0; i < this.exportList.length; i++) {
        if (this.exportList[i].weightCloth === null
          || this.exportList[i].weightCar === null
          || this.exportList[i].weightCloth === undefined
          || this.exportList[i].weightCar === undefined) {
          this.alertService.error('รายการที่ ' + (i + 1) + ' กรอกข้อมูลไม่ครบ');
        } else if (this.exportList[i].weightCloth < this.exportList[i].weightCar) {
          this.alertService.error('รายการที่ ' + (i + 1) + ' น้ำหนักรถมากกว่าน้ำหนักผ้า');
        // tslint:disable-next-line: max-line-length
        } else if (this.exportList[i].weightCloth <= 0 || this.exportList[i].weightCar <= 0) {
          this.alertService.error('รายการที่ ' + (i + 1) + ' มีข้อผิดพลาดกรุณาตรวจสอบ');
        // } else if (this.exportCarId === '' || this.exportCarId === undefined) {
        //   this.alertService.error('กรุณาใส่ทะเบียนรถ');
        } else if (this.exportClothUserImport === '' || this.exportClothUserImport === undefined ) {
          this.alertService.error('กรุณาใส่ชื่อผู้รับ');
        } else {
          this.pass = this.pass + 1;
        }
      }
    } else {
      for (let i = 0; i < this.exportList.length; i++) {
        if (this.exportList[i].weightCloth === null
          || this.exportList[i].weightCar === null
          || this.exportList[i].weightCloth === undefined
          || this.exportList[i].weightCar === undefined) {
          this.alertService.error('รายการที่ ' + (i + 1) + ' กรอกข้อมูลไม่ครบ');
        } else if (this.exportList[i].weightCloth < this.exportList[i].weightCar) {
          this.alertService.error('รายการที่ ' + (i + 1) + ' น้ำหนักรถมากกว่าน้ำหนักผ้า');
        // tslint:disable-next-line: max-line-length
        } else if (this.exportList[i].weightCloth <= 0 || this.exportList[i].weightCar <= 0) {
          this.alertService.error('รายการที่ ' + (i + 1) + ' มีข้อผิดพลาดกรุณาตรวจสอบ');
        // } else if (this.exportCarId === '' || this.exportCarId === undefined) {
        //   this.alertService.error('กรุณาใส่ทะเบียนรถ');
        } else if (this.exportClothUserImport === '' || this.exportClothUserImport === undefined ) {
          this.alertService.error('กรุณาใส่ชื่อผู้รับ');
        } else {
          this.pass = this.pass + 1;
        }
      }
    }
      console.log('pass', this.pass);

      if (this.pass > 0) {
      console.log('this.exportClothType', this.exportClothType);
      if (this.exportClothType === 1) { 
        const result_alert: any = await this.alertService.confirm('น้ำหนักผ้าเปื้อน ' + this.weightSum + ' กก.');
        if (result_alert.value) {

        console.log('ซักเอง');
        const obj = {
          exportClothCode: this.exportClothCode,
          exportClothDate: this.dates,
          exportClothUserExport: this.decoded.firstname,
          exportClothType: this.exportClothType,
          Company_idCompany: null,
          exportClothTotalWeight: this.weightSum,
          exportCarId : '-',
          exportClothUserImport : this.exportClothUserImport,

        };
        console.log('obj', obj);
        const result: any = this.exportService.insertExportCloth(obj);

        for (const row of this.exportList) {
          this.exportDetailSumWeight = row.weightCloth - row.weightCar ;
          if (row.weightCloth > 0 && row.weightCar > 0) {
            const obj1 = {
              ExportCloth_exportClothCode: this.exportClothCode,
              exportDetailWeightCloth: row.weightCloth,
              exportDetailWeightCar : row.weightCar,
              exportDetailSumWeight : this.exportDetailSumWeight,

            };
            console.log('obj1', obj1);
            const dataInsert: any = this.exportService.insertExportDetail(obj1);
            if (dataInsert.rows) {
              console.log('check', dataInsert.rows);
            }
          }
        }

        this.alertService.success('บันทึกข้อมูลเรียบร้อย');
        await this.router.navigate(['main/export-cloth-bill/' + this.exportClothCode]);
      }
      } else {
        const result_alert: any = await this.alertService.confirm('น้ำหนักผ้าเปื้อน ' + this.weightSum + ' กก.');
        if (result_alert.value) {
        console.log('ส่งบริษัท');

        console.log('this.exportClothUserImport', this.exportClothUserImport);

        const obj = {
          exportClothCode: this.exportClothCode,
          exportClothDate: this.dates,
          exportClothUserExport: this.decoded.firstname,
          exportClothType: this.exportClothType,
          Company_idCompany: this.company,
          exportClothTotalWeight:  this.weightSum,
          exportCarId : this.exportCarId,
          exportClothUserImport : this.exportClothUserImport,
        };
        console.log('obj', obj);
        const result: any = this.exportService.insertExportCloth(obj);

        for (const row of this.exportList) {
          this.exportDetailSumWeight = row.weightCloth - row.weightCar ;
          if (row.weightCloth > 0 && row.weightCar > 0) {
            const obj1 = {
              ExportCloth_exportClothCode: this.exportClothCode,
              exportDetailWeightCloth: row.weightCloth,
              exportDetailWeightCar : row.weightCar,
              exportDetailSumWeight : this.exportDetailSumWeight,
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
      }
      }

      //  } else {
      //   this.alertService.error('ไม่สามารถบันทึกข้อมูลได้ โปรดตรวจสอบความถูกต้อง');
      //  }
      this.exportClothType = 1;
    }
    } catch (error) {
      console.log(error);
    }
  }

  calculateWeight() {
    this.weightSum = 0.0;
    for (let i = 0; i < this.exportList.length; i++) {
        this.calWeight = 0.0;
        this.calWeight = this.exportList[i].weightCloth - this.exportList[i].weightCar;
        this.weightSum += this.calWeight;
  }
}

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.currentUserSubscription.unsubscribe();
  }
}
