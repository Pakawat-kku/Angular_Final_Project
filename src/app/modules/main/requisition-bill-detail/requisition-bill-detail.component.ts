import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import * as moment from 'moment';
import { AlertService } from 'src/app/services/alert.service';

import { RequisitionService } from './../../../services/requisition.service';
import { Subscription } from 'rxjs';
import { Users } from '../register/users';
import { AuthenticationService } from '../../../services//Authentication.service';
import * as jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-requisition-bill-detail',
  templateUrl: './requisition-bill-detail.component.html',
  styleUrls: ['./requisition-bill-detail.component.scss']
})
export class RequisitionBillDetailComponent implements OnInit {
  requisitionCode: any;
  requisitionBillDetail: any;
  requisitionBillDetailOnly: any;
  currentUser: Users;
  currentUserSubscription: Subscription;
  decoded: any;
  showReqWaitDetailAdmin: any;

  constructor(
    private alertService: AlertService,
    private _Activatedroute: ActivatedRoute,
    private router: Router,
    private requisitionService: RequisitionService,
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
    this.requisitionCode = this._Activatedroute.snapshot.paramMap.get('requisitionCode');
    console.log('id-pass', this.requisitionCode);
    await this.requisitionBill();
    await this.requisitionHeadBill();

  }

 async requisitionBill() {
  console.log('this.requisitionCode' , this.requisitionCode);
    try {
      console.log('check' , this.requisitionCode);
      const result: any = await this.requisitionService.showReqWaitDetail(this.requisitionCode);
      console.log('result', result);
      if (result.rows) {
        this.requisitionBillDetail = result.rows;
        console.log('this.requisitionBillDetail', this.requisitionBillDetail);

      }
    } catch (err) {
      console.log(err);
    }

}

async requisitionHeadBill() {

  console.log('this.requisitionCode' , this.requisitionCode);
    try {
      console.log('check' , this.requisitionCode);
      const result: any = await this.requisitionService.showReqWaitDetailOnly(this.requisitionCode);
      console.log('result', result);
      if (result.rows) {
        this.requisitionBillDetailOnly = result.rows;
        for (const item of this.requisitionBillDetailOnly) {
          item.date = moment(item.reqDate).format('DD');
          item.month = moment(item.reqDate).format('MMMM');
          item.year = moment(item.reqDate).add(543, 'years').format('YYYY');
          item.time = moment(item.reqDate).format('HH:mm');
          item.day = item.date + '  ' + item.month + '  ' + item.year;
      }
        console.log('this.requisitionBillDetailOnly', this.requisitionBillDetailOnly);

      }

    } catch (err) {
      console.log(err);
    }

}

async approve(requisitionCode) {
  this.requisitionCode = requisitionCode;
  console.log(this.requisitionCode);

  try {
    const result: any = await this.requisitionService.approveReq(this.requisitionCode);
    console.log('result', result);
    if (result.rows) {
      this.showReqWaitDetailAdmin = result.rows;
      console.log('this.showReqWaitDetailAdmin', this.showReqWaitDetailAdmin);
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
