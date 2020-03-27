import { Component, OnInit, OnDestroy } from '@angular/core';
import { RequisitionService } from './../../../services/requisition.service';
import { StockService } from './../../../services/stock.service';
import { throwError, fromEvent } from 'rxjs';
import { Router , ActivatedRoute} from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { FormBuilder} from '@angular/forms';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../../services//Authentication.service';
import { UsersService } from '../../../services/users.service';
import * as jwt_decode from 'jwt-decode';
import { InputArray } from './inputArray';
import { Select2OptionData } from 'ng2-select2';
import { UsersAuthorityService } from 'src/app/services/users-authority.service';
import { WardService } from './../../../services/ward.service';

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
  unRepeatString = '';
  string = '';
  cloth: any;
  unRepeat = 0;
  hour: any;
  min: any;
  authority: any = [];
  position: any;
  wardList: any;
  wardId: any;
  section = 1;
  Department: any;
  unRepeatStringArray: any = [];

  constructor(
    private alertService: AlertService,
    private stockService: StockService,
    private requisitionService: RequisitionService,
    private router: Router,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private userService: UsersService,
    private _Activatedroute: ActivatedRoute,
    private users_authorityService: UsersAuthorityService,
    private wardService: WardService,

  ) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(users => {
      this.currentUser = users;
      this.decoded = jwt_decode(users.token);
      this.exampleData = [];
      console.log(this.decoded);


    });
  }

   async ngOnInit() {

    this.position = this.decoded.position;
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
    if (this.decoded.position === 2 || this.decoded.position === 1 && this.authority.two === 'true' ) {
      moment.locale('th');
      this.getDate();
      await this.getCloth();
      this.checkTime();
      this.getWard();

    } else {
      this.alertService.error();
      this.router.navigate(['main/main']);
    }
  }


  async getWard() {
    try {
      const result: any = await this.wardService.getAllWard();
      if (result.rows) {
        this.wardList = result.rows;
        this.wardId = this.wardList[0].wardId;
        }
    } catch (error) {
      console.log(error);
    }
  }

  getDate() {
    this.date = moment().add(543, 'years').format('DD MMMM YYYY');
    // console.log('date', this.date);

    this.dates = moment().format('YYYY-MM-DD HH:mm.ss');
    // console.log('dates', this.dates);

    this.time = moment().format('HH:mm');

    if (this.decoded.position === 2) {
      this.reqId = this.decoded.Ward_wardId + moment().format('YYYYMMDDHHmmss');

    } else {
      this.reqId = this.wardId + moment().format('YYYYMMDDHHmmss');

    }
    
  }

  checkTime() {
    // tslint:disable-next-line: radix
    this.hour = parseInt(moment().format('HH'));
    // tslint:disable-next-line: radix
    this.min = parseInt(moment().format('mm'));
  }

  onClickSubmit(formData) {
    // console.log(formData);
    if (formData.amount < 1) {
      this.alertService.error('จำนวนรายการผ้าที่สั่งซื้อไม่ถูกต้อง');
    } else {
      this.amount = formData.amount;
      for (let i = 0; i < this.amount; i++) {
        const arrayId = new InputArray();
        // this.purchaseLists.push({
        //   clothId: '1',
        //   amount: null,
        //   price: null
        // });
        this.purchaseLists.push({
          clothId: '1',
          amountCloth: null,
        });
        // arrayId.id = i + 1;
        // this.arrayList.push(arrayId);
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


    let unNormal = 0;
    let unRepeat = 0;
    let dumNum = 0;
    let purchNum = 0;
    let q = 0;
    let qq = 1;
    this.unRepeatStringArray = [];
    for (const item of this.purchaseLists) {
      if (item.amountCloth <= 0 || item.amountCloth === null) {
        unNormal = unNormal + 1;
        this.unRepeatStringArray[q] = qq;
        q = q + 1 ;
      }
      qq = qq + 1;
    }

    for (const itemmm of this.unRepeatStringArray) {
      this.unRepeatString += itemmm + ' ';
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

    let k = [];

    let m = 0;

    for (let i = 0; i < this.purchaseLists.length - 1; i++) {

      for (let j = i + 1; j < this.purchaseLists.length; j++) {

        if (this.purchaseLists[i].clothId === this.purchaseLists[j].clothId) {

          k[m] = this.purchaseLists[i].clothId;
          m++;
        }
      }
    }


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
            if (item.clothId === parseInt(items)) {

              this.string += item.clothName + ' ';
            }
          }


      }
      this.alertService.error('มีการทำรายการผ้าซ้ำ คือ ' + this.string);
      this.string = '';
    }

    } else {


      await this.getDate();

      try {
        if (this.decoded.position === 2) {
          const obj = {
            requisitionCode: this.reqId,
            reqDate: this.dates,
            status: '0',
            Users_userId: this.decoded.userId,
            Ward_wardId: this.decoded.Ward_wardId
          };


          const result: any = await this.requisitionService.insertRealReq(obj);

        } else {
          if (this.section === 1) {
            const obj = {
              requisitionCode: this.reqId,
              reqDate: this.dates,
              status: '0',
              Users_userId: this.decoded.userId,
              Ward_wardId: this.wardId
            };

            const result: any = await this.requisitionService.insertRealReq(obj);
            // const result1: any = await this.requisitionService.approveReq(this.reqId);

          } else {
            let reqId = moment().format('YYYYMMDDHHmmss');
            const obj = {
              requisitionCode: reqId,
              reqDate: this.dates,
              status: '0',
              Users_userId: this.decoded.userId,
              description: this.Department
            };

            const result: any = await this.requisitionService.insertRealReq(obj);
            // const result1: any = await this.requisitionService.approveReq(reqId);
            this.reqId = reqId;
          }
        }

        for (const row of this.purchaseLists) {

          const obj1 = {
            amountCloth: row.amountCloth,
            Cloth_clothId: row.clothId,
            Requisition_requisitionCode: this.reqId,
            requisitionDetailStatus: '0',
            amountClothReal: row.amountCloth

          };
          // console.log('obj1', obj1);
          const dataInsert: any = this.requisitionService.insertReq(obj1);
        }

        this.alertService.reqSuccess('บันทึกข้อมูลเรียบร้อย');
        await this.router.navigate(['main/requisition-bill-detail/' + this.reqId]);

      } catch (error) {
        console.log(error);

      }
    }
  }

  //     } if (unNormal !== 0) {
  //       this.alertService.error('กรุณาตรวจสอบจำนวนที่ต้องการเบิก');
  //       this.unNormal = 0;
  //       this.unRepeat = 0;

  //     } if (unRepeat !== 0) {
  //       this.alertService.error('กรุณาตรวจสอบรายการผ้าซ้ำ');
  //       this.unNormal = 0;
  //       this.unRepeat = 0;

  //     } if (unRepeat !== 0 && unNormal !== 0) {
  //       this.alertService.error('กรุณาตรวจสอบรายการผ้าซ้ำและจำนวนที่ต้องการเบิก');
  //       this.unNormal = 0;
  //       this.unRepeat = 0;
  //     }

  //   } catch (error) {
  //     console.log(error);

  //   }
  // }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.currentUserSubscription.unsubscribe();
  }

}
