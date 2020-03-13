import { DamageService } from './../../../services/damage.service';
import { ImportDetailAmountService } from './../../../services/import-detail-amount.service';
import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { StockService } from 'src/app/services/stock.service';
import { InputArray } from '../requisition/inputArray';
import * as _ from 'lodash';

import * as jwt_decode from 'jwt-decode';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../../services//Authentication.service';
import { UsersAuthorityService } from 'src/app/services/users-authority.service';

@Component({
  selector: 'app-import-cloth-amount',
  templateUrl: './import-cloth-amount.component.html',
  styleUrls: ['./import-cloth-amount.component.scss']
})
export class ImportClothAmountComponent implements OnInit {
  ImportCloth_importCode: any;
  month: any;
  year: any;
  clothList: any = [];
  day: string;
  pee: string;
  amount: any;
  val = false;
  dummy: any = [];
  arrayList: Array<InputArray> = [];
  importList: any[] = [{
    clothId: '1',
    importDetailAmount: null,
    damageAmount: null
  }];
  currentUser: any;
  currentUserSubscription: Subscription;
  decoded: any;
  authority: any = [];

  constructor(
    private alertService: AlertService,
    private _Activatedroute: ActivatedRoute,
    private router: Router,
    private stockService: StockService,
    private importDetailAmountService: ImportDetailAmountService,
    private damageService: DamageService,
    private authenticationService: AuthenticationService,
    private users_authorityService: UsersAuthorityService,

  ) { 
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(users => {
      this.currentUser = users;
      this.decoded = jwt_decode(users.token);
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
    this.ImportCloth_importCode = this._Activatedroute.snapshot.paramMap.get('importClothCode');
    moment.locale('th');
    console.log('im', this.ImportCloth_importCode);
    this.checkYear();
    this.getCloth();
    this.day = moment().format('DD MMMM');
    this.pee = moment().add(543, 'years').format('YYYY');
  }
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

  async getCloth() {
    try {
      const result: any = await this.stockService.getCloth();
      if (result.rows) {
        this.clothList = result.rows;
      }
    } catch (error) {
      console.log(error);
    }
  }

  onClickSubmit(formData) {
    // console.log(formData);
    if (formData.amount < 1) {
      this.alertService.error('จำนวนรายการผ้าที่สั่งซื้อไม่ถูกต้อง');
    } else {
      this.amount = formData.amount;
      for (let i = 0; i < this.amount; i++) {
        const arrayId = new InputArray();
        this.importList.push({
          clothId: '1',
          importDetailAmount: null,
          damageAmount: null
        });
        arrayId.id = i + 1;
        this.arrayList.push(arrayId);
      }
      // console.log('arraylist', this.arrayList);
    }
    this.amount = 0;
  }

  async addNewRow() {
    await this.importList.push({
      clothId: '1',
      importDetailAmount: null,
      damageAmount: null
    });
  }

  async onDelete(rowNo) {
    const result: any = await this.alertService.confirm('ยืนยันการลบ ?');
    if (result.value) {
      const data: any = [];
      this.importList.forEach((row, index) => {
        if (rowNo !== index) {
          data.push(row);
        }
      });
      this.importList = data;
    }
  }

  async onSave() {
    // console.log(this.importList);
    let i = 0;
    // this.dummy = this.importList;
    // for (let i = 0; i < this.importList.length; i++) {
    //   for(let j=0; j<this.dummy.length; j++){
    //     if(this.importList[i].clothId === this.dummy[j].clothId){
    //       console.log(this.dummy[j].clothId);
    //     }
    //   }
    // }

    let unRepeat = 0;
    let dumNum = 0;
    let purchNum = 0;
    let intersect = 0;

    for (let i = 0; i < this.importList.length; i++) {
      this.dummy[i] = this.importList[i].clothId;
    }
    purchNum = _.size(this.importList);
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

      for (let row of this.importList) {
        this.val = false;
        i++;
        if (row.importDetailAmount === null || row.importDetailAmount === undefined || row.importDetailAmount === '') {
          if (row.damageAmount === null || row.damageAmount === undefined || row.damageAmount === '') {
            this.alertService.error('รายการที่ ' + i + ' ไม่มีจำนวนผ้า');
          }
          row.importDetailAmount = 0;
          this.val = false;
        }
        if (row.importDetailAmount < 0 || row.damageAmount < 0) {
          this.alertService.error('รายการที่ ' + i + ' จำนวนผิดพลาด');
          this.val = false;
        } else if (row.damageAmount > 0) {
          const data1 = {
            damageAmount: row.damageAmount,
            Cloth_clothId: row.clothId,
            damageDate: moment().format('YYYY-MM-DD'),
            ImportCloth_importCode: this.ImportCloth_importCode
          };
          const data2 = {
            importDetailAmount: row.importDetailAmount,
            Cloth_clothId: row.clothId,
            ImportCloth_importCode: this.ImportCloth_importCode
          };
          try {
            const result1: any = await this.damageService.insertDamage(data1);
            const result2: any = await this.importDetailAmountService.insertImportDetailAmount(data2);
            if (result1.rows && result2.rows) {
              this.val = true;
            }
          } catch (error) {
            console.log(error);
          }
        } else {
          const data = {
            importDetailAmount: row.importDetailAmount,
            Cloth_clothId: row.clothId,
            ImportCloth_importCode: this.ImportCloth_importCode
          };
          try {
            const result: any = await this.importDetailAmountService.insertImportDetailAmount(data);
            if (result.rows) {
              this.val = true;
            }
          } catch (error) {
            console.log(error);
          }
        }
      }
    }
        if (this.val === true) {
          await this.alertService.success('บันทึกรายการสำเร็จ');
          this.router.navigate(['main/export-cloth-detail/']);
        }
  }

}
