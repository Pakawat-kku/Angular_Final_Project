import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import * as moment from 'moment';
import { AlertService } from 'src/app/services/alert.service';
import { WareHouseService } from './../../../services/wareHouse.service';
import { RequisitionService } from './../../../services/requisition.service';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../../services//Authentication.service';
import * as jwt_decode from 'jwt-decode';
import * as _ from 'lodash';
import { UsersAuthorityService } from 'src/app/services/users-authority.service';
import { AvailableService } from './../../../services/available.service';
import { StockService } from './../../../services/stock.service';

@Component({
  selector: 'app-requisition-bill-detail',
  templateUrl: './requisition-bill-detail.component.html',
  styleUrls: ['./requisition-bill-detail.component.scss']
})
export class RequisitionBillDetailComponent implements OnInit {
  requisitionCode: any;
  requisitionBillDetail: any = [];
  requisitionBillDetailOnly: any;
  currentUser: any;
  currentUserSubscription: Subscription;
  decoded: any;
  showReqWaitDetailAdmin: any;
  rowSelected: any = [];
  currentRow: any;
  modalEditBill = false;
  reqEditBill: any;
  find1: any;
  find2: any;
  realAmount: any;
  status: any;
  pass: any;
  tail: any;
  head: any;
  unNormal = 0;
  authority: any = [];
  requisitionBillDetailDept: any;
  wardName: any;
  wardNameDept: any;
  notEnough: any = [];

  constructor(
    private alertService: AlertService,
    private _Activatedroute: ActivatedRoute,
    private router: Router,
    private requisitionService: RequisitionService,
    private authenticationService: AuthenticationService,
    private wareHouseService: WareHouseService,
    private availableService: AvailableService,
    private users_authorityService: UsersAuthorityService,
    private stockService: StockService,
  ) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(users => {
      this.currentUser = users;
      this.decoded = jwt_decode(users.token);

      // console.log('decoded', this.decoded);

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

    if (this.authority.two !== 'true' && this.decoded.position !== 2) {
      this.alertService.error();
      this.router.navigate(['main/main']);
    } else {
    moment.locale('th');
    this.requisitionCode = this._Activatedroute.snapshot.paramMap.get('requisitionCode');
    await this.requisitionBill();
    await this.requisitionHeadBill();
  }
}

  async requisitionBill() {
    try {
      // console.log('this.requisitionCode', this.requisitionCode);

      const result: any = await this.requisitionService.showReqWaitDetail(this.requisitionCode);
      if (result.statusCode === 200) {
        this.requisitionBillDetail = result.rows;

        // console.log('find1', _.findKey(this.requisitionBillDetail, { 'requisitionDetailStatus': '1' }));
        // console.log('find2', _.findKey(this.requisitionBillDetail, { 'requisitionDetailStatus': '2' }));

        this.find1 = _.findKey(this.requisitionBillDetail, { 'requisitionDetailStatus': '1' });
        this.find2 = _.findKey(this.requisitionBillDetail, { 'requisitionDetailStatus': '2' });

        // console.log('this.requisitionBillDetail', this.requisitionBillDetail);
        this.router.navigate(['main/requisition-bill-detail/' + this.requisitionCode]);

      }
    } catch (err) {
      console.log(err);
    }

  }

  async requisitionHeadBill() {
    try {
      // console.log('check', this.requisitionCode);
      const result: any = await this.requisitionService.showReqWaitDetailOnly(this.requisitionCode);

      const result1: any = await this.requisitionService.showReqWaitDetailDept(this.requisitionCode);



      if (result.rows) {
        this.requisitionBillDetailOnly = result.rows;
        for (const item of this.requisitionBillDetailOnly) {
          item.date = moment(item.reqDate).format('DD');
          item.month = moment(item.reqDate).format('MMMM');
          item.year = moment(item.reqDate).add(543, 'years').format('YYYY');
          item.time = moment(item.reqDate).format('HH:mm');
          item.day = item.date + ' ' + item.month + ' ' + item.year;
          this.wardName = this.requisitionBillDetailOnly[0].wardName;
        }



        if (result1.rows) {
          this.requisitionBillDetailDept = result1.rows;
          for (const item of this.requisitionBillDetailDept) {
            item.date = moment(item.reqDate).format('DD');
            item.month = moment(item.reqDate).format('MMMM');
            item.year = moment(item.reqDate).add(543, 'years').format('YYYY');
            item.time = moment(item.reqDate).format('HH:mm');
            item.day = item.date + ' ' + item.month + ' ' + item.year;
            this.wardNameDept = this.requisitionBillDetailDept[0].wardName;
          }
        }
        this.requisitionBillDetailOnly = this.requisitionBillDetailOnly;
        console.log('requisitionBillDetailOnly', this.requisitionBillDetailOnly);
        console.log('requisitionBillDetailDept', this.requisitionBillDetailDept);

        if (this.requisitionBillDetailOnly.length === 0) {
          this.status = this.requisitionBillDetailDept[0].status;
        } else {
          this.status = this.requisitionBillDetailOnly[0].status;

        }
        console.log('status', this.status);
        // console.log('this.decoded.position', this.decoded.position);

      }

    } catch (err) {
      console.log(err);
    }

  }

  async approve(formData) {
    let i = 0;
    let j = 0;
    let minus = 0;
    for (const temm of _.chunk(Object.values(formData))) {
      i++;
    }
    minus = i / 3;
    j = i - minus;

    this.head = _.chunk(_.take(Object.values(formData), j), 2);
    this.tail = _.takeRight(Object.values(formData), minus);

    // console.log('head', _.chunk(_.take(Object.values(formData), j), 2));
    // console.log('tail', _.takeRight(Object.values(formData), minus));

    let unNor = 0;
    let sum = 0;

    for (const item of _.chunk(_.takeRight(Object.values(formData), minus))) {
      // console.log('item[0]', item[0]);
      // console.log('_.nth(this.head[0], 1)', _.nth(this.head[unNor], 1));

      if (item[0] > _.nth(this.head[unNor], 1) || item[0] < 0 || item[0] === null) {
        this.unNormal = this.unNormal + 1;
        unNor = unNor + 1;
      } else {

        unNor = unNor + 1;
      }
    }
    unNor = 0;
    let noten = 0;
    let note = 0;
    for (const item of _.chunk(_.takeRight(Object.values(formData), minus))) {
        // console.log('จำนวนที่สามารถจ่ายได้', item[0]);
        // console.log('รหัสผ้า', _.take(this.head[sum]));
        if (item[0] >= 0) {
          const result1: any = await this.availableService.getAvailable(_.take(this.head[sum]));

          if (result1.rows.length === 0) {
            noten = noten + 1;

            const result2: any = await this.stockService.getClothById(_.take(this.head[sum]));
            this.notEnough[note] = result2.rows[0].clothName;
            note = note + 1;
          } else {
            if (result1.rows[0].AvailableAmount < item[0]) {
              noten = noten + 1;

              const result2: any = await this.stockService.getClothById(_.take(this.head[sum]));
              this.notEnough[note] = result2.rows[0].clothName;
              note = note + 1;
            }
          }
        }
        sum = sum + 1;
    }


    if (this.unNormal > 0 || noten > 0) {
      if (this.unNormal > 0) {
        this.alertService.error('ไม่สามารถอนุมัติได้กรุณาตรวจสอบความถูกต้อง');
        this.unNormal = 0;
        } else {
        this.alertService.error('มีผ้าในคลังส่วนกลางไม่เพียงพอ กรุณาตรวจสอบ');

      }

    } else {
      // console.log('_.chunk(_.takeRight(Object.values(formData), minus))', _.chunk(_.takeRight(Object.values(formData), minus)));

      let summ = 0;
      for (const item of _.chunk(_.takeRight(Object.values(formData), minus))) {
        let deficient = 0 ;
        // console.log('item', item[0]);
        // console.log('รหัสผ้า', _.take(this.head[summ]));
        // console.log('[1]', _.tail(this.head[summ]));
        const result: any = await this.requisitionService.updateAmountReal(_.take(this.head[summ]), this.requisitionCode, item[0]);
        const result1: any = await this.availableService.getAvailable(_.take(this.head[summ]));
        deficient = result1.rows[0].AvailableAmount - item[0];
        const obj = {
          AvailableAmount: deficient
        };
        const result2: any = await this.availableService.updateAvailable(obj , _.take(this.head[summ]));
        summ = summ + 1;
      }

      try {
        const result: any = await this.requisitionService.approveReq(this.requisitionCode);
        if (result.rows) {
          this.showReqWaitDetailAdmin = result.rows;
          this.alertService.successApprove(' อนุมัติเสร็จสิ้น ');
          this.requisitionHeadBill();
          this.requisitionBill();
          this.router.navigate(['main/requisition-bill-detail/' + this.requisitionCode]);

        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  async notApproveList(row) {
    this.currentRow = Object.assign({}, row);

    try {
      // tslint:disable-next-line: max-line-length
      const result: any = await this.requisitionService.notApproveList(this.currentRow.Requisition_requisitionCode, this.currentRow.Cloth_clothId);
      if (result.rows) {
        // this.showReqWaitDetailAdmin = result.rows;
        // console.log('this.showReqWaitDetailAdmin', this.showReqWaitDetailAdmin);
        this.alertService.successNotApprove(' อนุมัติเสร็จสิ้น ');
        this.requisitionHeadBill();
        this.requisitionBill();
        this.router.navigate(['main/requisition-bill-detail/' + this.requisitionCode]);

      }
    } catch (err) {
      console.log(err);
    }

  }

  async notApproveReq(requisitionCode) {
    this.requisitionCode = requisitionCode;

    try {
      const result: any = await this.requisitionService.notApproveReq(this.requisitionCode);
      if (result.rows) {
        this.showReqWaitDetailAdmin = result.rows;
        this.alertService.successNotApproveReq(' อนุมัติเสร็จสิ้น ');
        this.requisitionHeadBill();
        this.requisitionBill();
        this.router.navigate(['main/requisition-bill-detail/' + this.requisitionCode]);

      }
    } catch (err) {
      console.log(err);
    }

  }

  async showEditBill(row) {
    this.modalEditBill = true;
    this.currentRow = Object.assign({}, row);
  }

  async submitEdit() {
    if (this.currentRow.amountCloth <= 0) {
      this.alertService.error('จำนวนเบิกแก้ไขผิดพลาด');
    } else {
      try {
        // tslint:disable-next-line: max-line-lengththis.currentRow.amountCloth
        // tslint:disable-next-line: max-line-length
        const result: any = await this.requisitionService.submitEdit(this.currentRow.Requisition_requisitionCode, this.currentRow.Cloth_clothId, this.currentRow.amountCloth);
        if (result.rows) {
          this.alertService.editSuccess(' แก้ไขสำเร็จ ');
          this.requisitionHeadBill();
          this.requisitionBill();
          this.router.navigate(['main/requisition-bill-detail/' + this.requisitionCode]);
          this.modalEditBill = false;

        }
      } catch (err) {
        console.log(err);
      }
    }
  }

}
