import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import * as moment from 'moment';
import { AlertService } from 'src/app/services/alert.service';

import { RequisitionService } from './../../../services/requisition.service';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../../services//Authentication.service';
import * as jwt_decode from 'jwt-decode';
import * as _ from 'lodash';
import { NgForm, FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { find } from 'rxjs/operators';


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

  constructor(
    private alertService: AlertService,
    private _Activatedroute: ActivatedRoute,
    private router: Router,
    private requisitionService: RequisitionService,
    private authenticationService: AuthenticationService,
  ) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(users => {
      this.currentUser = users;
      this.decoded = jwt_decode(users.token);
    });
  }

  async ngOnInit() {
    moment.locale('th');
    this.requisitionCode = this._Activatedroute.snapshot.paramMap.get('requisitionCode');
    await this.requisitionBill();
    await this.requisitionHeadBill();
  }

  async requisitionBill() {
    try {
      console.log('this.requisitionCode', this.requisitionCode);

      const result: any = await this.requisitionService.showReqWaitDetail(this.requisitionCode);
      if (result.statusCode === 200) {
        this.requisitionBillDetail = result.rows;

        console.log('find1', _.findKey(this.requisitionBillDetail, { 'requisitionDetailStatus': '1' }));
        console.log('find2', _.findKey(this.requisitionBillDetail, { 'requisitionDetailStatus': '2' }));

        this.find1 = _.findKey(this.requisitionBillDetail, { 'requisitionDetailStatus': '1' });
        this.find2 = _.findKey(this.requisitionBillDetail, { 'requisitionDetailStatus': '2' });

        console.log('this.requisitionBillDetail', this.requisitionBillDetail);
        this.router.navigate(['main/requisition-bill-detail/' + this.requisitionCode]);

      }
    } catch (err) {
      console.log(err);
    }

  }

  async requisitionHeadBill() {
    try {
      console.log('check', this.requisitionCode);
      const result: any = await this.requisitionService.showReqWaitDetailOnly(this.requisitionCode);
      if (result.rows) {
        this.requisitionBillDetailOnly = result.rows;
        for (const item of this.requisitionBillDetailOnly) {
          item.date = moment(item.reqDate).format('DD');
          item.month = moment(item.reqDate).format('MMMM');
          item.year = moment(item.reqDate).add(543, 'years').format('YYYY');
          item.time = moment(item.reqDate).format('HH:mm');
          item.day = item.date + ' ' + item.month + ' ' + item.year;
        }
        this.requisitionBillDetailOnly = this.requisitionBillDetailOnly;
        console.log('this.requisitionBillDetailOnly', this.requisitionBillDetailOnly);

        this.status = this.requisitionBillDetailOnly[0].status;
        console.log('status', this.status);
        console.log('this.decoded.position', this.decoded.position);


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
    // console.log('i', i);
    // console.log('minus', minus);
    // console.log('j', j);
    // console.log('formdata', formData);

    this.head = _.chunk(_.take(Object.values(formData), j), 2);
    this.tail = _.takeRight(Object.values(formData), minus);

    console.log('head', _.chunk(_.take(Object.values(formData), j), 2));
    console.log('tail', _.takeRight(Object.values(formData), minus));

    let unNor = 0;
    let sum = 0;

    for (const item of _.chunk(_.takeRight(Object.values(formData), minus))) {
      console.log('item[0]', item[0]);
      console.log('_.nth(this.head[0], 1)', _.nth(this.head[unNor], 1));

      if (item[0] > _.nth(this.head[unNor], 1) || item[0] < 0 || item[0] === null) {
        this.unNormal = this.unNormal + 1;
        unNor = unNor + 1;
      } else {
        console.log('ปกติ');
        unNor = unNor + 1;
      }
    }
    unNor = 0;
    console.log('this.unNormal', this.unNormal);

    if (this.unNormal > 0) {
      this.alertService.error('ไม่สามารถอนุมัติได้กรุณาตรวจสอบ');
      this.unNormal = 0;

    } else {
      console.log('_.chunk(_.takeRight(Object.values(formData), minus))', _.chunk(_.takeRight(Object.values(formData), minus)));

      for (const item of _.chunk(_.takeRight(Object.values(formData), minus))) {
        console.log('item', item[0]);
        console.log('[0]', _.take(this.head[sum]));
        console.log('[1]', _.tail(this.head[sum]));
        const result: any = await this.requisitionService.updateAmountReal(_.take(this.head[sum]), this.requisitionCode, item[0]);
        console.log(result);
        sum = sum + 1;
        console.log('sum', sum);
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
    console.log('this.currentRow', this.currentRow);
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
