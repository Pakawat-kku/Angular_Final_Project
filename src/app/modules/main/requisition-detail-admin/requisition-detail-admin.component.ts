import { Component, OnInit , OnDestroy } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { NgForm, FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../../services//Authentication.service';
import { UsersService } from '../../../services/users.service';
import * as jwt_decode from 'jwt-decode';
import { RequisitionService } from './../../../services/requisition.service';
import { Router , ActivatedRoute } from '@angular/router';

import { UsersAuthorityService } from 'src/app/services/users-authority.service';
@Component({
  selector: 'app-requisition-detail-admin',
  templateUrl: './requisition-detail-admin.component.html',
  styleUrls: ['./requisition-detail-admin.component.scss']
})

export class RequisitionDetailAdminComponent implements OnInit , OnDestroy {
  null: any;
  currentUser: any;
  currentUserSubscription: Subscription;
  decoded: any;
  date: string;
  month: string;
  year: string;
  time: string;
  // modalEdit = false;
  requisitionCode: any;
  showReqAdmin: any;
  showReqWaitDetailAdmin: any;
  requisitionCodeInOnAdd: any;
  selected: any = [];
  modalAllApprove = false;
  resultAllApprove: any;
  approve = 0;
  searchRequisition = 0;
  authority: any = [];

  constructor(
    private alertService: AlertService,
    private requisitionService: RequisitionService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private users_authorityService: UsersAuthorityService,


  ) {
      this.currentUserSubscription = this.authenticationService.currentUser.subscribe(users => {
      this.currentUser = users;
      console.log('users' , users );
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
    if (this.authority.two !== 'true') {
      this.alertService.error();
      this.router.navigate(['main/main']);
    } else {
    moment.locale('th');
    this.showReqWaitAdmin();
    // tslint:disable-next-line: no-unused-expression
    this.showReqWaitDetailAdmin;
  }
}

  async showReqWaitAdmin() {

    try {
      const result: any = await this.requisitionService.showReqWaitAdmin();

      console.log('result', result);
      if (result.rows) {
        console.log(result.rows);
        this.showReqAdmin = result.rows;
        for (const item of this.showReqAdmin) {
          item.date = moment(item.reqDate).format('DD');
          item.month = moment(item.reqDate).format('MMMM');
          item.year = moment(item.reqDate).add(543, 'years').format('YYYY');
          item.time = moment(item.reqDate).format('HH:mm');
          item.day = item.date + '  ' + item.month + '  ' + item.year;
      }
          console.log(this.showReqAdmin);
      }
      this.approve = 0;

    } catch (err) {
      console.log(err);
    }
  }

  async showReqWaitAdminApprove() {

    try {
      const result: any = await this.requisitionService.showReqWaitAdminApprove();

      console.log('result', result);
      if (result.rows) {
        console.log(result.rows);
        this.showReqAdmin = result.rows;
        for (const item of this.showReqAdmin) {
          item.date = moment(item.reqDate).format('DD');
          item.month = moment(item.reqDate).format('MMMM');
          item.year = moment(item.reqDate).add(543, 'years').format('YYYY');
          item.time = moment(item.reqDate).format('HH:mm');
          item.day = item.date + '  ' + item.month + '  ' + item.year;
      }
          console.log(this.showReqAdmin);
      }
      this.approve = 1 ;
    } catch (err) {
      console.log(err);
    }
  }

  async showReqWaitAdminNotApprove() {

    try {
      const result: any = await this.requisitionService.showReqWaitAdminNotApprove();

      console.log('result', result);
      if (result.rows) {
        console.log(result.rows);
        this.showReqAdmin = result.rows;
        for (const item of this.showReqAdmin) {
          item.date = moment(item.reqDate).format('DD');
          item.month = moment(item.reqDate).format('MMMM');
          item.year = moment(item.reqDate).add(543, 'years').format('YYYY');
          item.time = moment(item.reqDate).format('HH:mm');
          item.day = item.date + '  ' + item.month + '  ' + item.year;
      }
          console.log(this.showReqAdmin);
      }
      this.approve = 1;
    } catch (err) {
      console.log(err);
    }
  }
  async search(searchWard) {

    try {
      console.log('searchWard : ', searchWard);

      const result: any = await this.requisitionService.searchWard(searchWard);
      if (result.rows) {
        console.log('search ', result.rows);
        this.showReqAdmin = result.rows;
        for (const item of this.showReqAdmin) {
          item.date = moment(item.reqDate).format('DD');
          item.month = moment(item.reqDate).format('MMMM');
          item.year = moment(item.reqDate).add(543, 'years').format('YYYY');
          item.time = moment(item.reqDate).format('HH:mm');
          item.day = item.date + '  ' + item.month + '  ' + item.year;
      }
          console.log(this.showReqAdmin);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async searchReq(searchRequisitionId) {
    if (searchRequisitionId === null || searchRequisitionId === undefined) {
      this.alertService.error('กรุณาใส่รหัสการเบิก');
    } else {
    try {
      console.log('searchRequisitionId : ', searchRequisitionId);

      const result: any = await this.requisitionService.searchRequisitionCode(searchRequisitionId);
      if (result.rows) {
        console.log('search ', result.rows);
        this.showReqAdmin = result.rows;
        for (const item of this.showReqAdmin) {
          item.date = moment(item.reqDate).format('DD');
          item.month = moment(item.reqDate).format('MMMM');
          item.year = moment(item.reqDate).add(543, 'years').format('YYYY');
          item.time = moment(item.reqDate).format('HH:mm');
          item.day = item.date + '  ' + item.month + '  ' + item.year;
      }
          console.log(this.showReqAdmin);
      }
      for (const item of this.showReqAdmin) {
        if (item.status === 1) {
          this.searchRequisition = this.searchRequisition + 1 ;
        } else {
          console.log('ไม่ผิดปกติ');
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  }


  moAllApprove() {
    console.log('this.selected', this.selected);
    this.modalAllApprove = true;
  }

  async allApprove() {
  for (const item of this.selected) {
    const result: any = await this.requisitionService.showReqWaitDetail(item.requisitionCode);
    console.log('result' , result.rows);

    const result1: any = await this.requisitionService.approveReq(result.rows[0].Requisition_requisitionCode);
    console.log('result1' , result1.rows);
}
    this.alertService.successApprove(' อนุมัติเสร็จสิ้น ');
    this.modalAllApprove = false;
    this.router.navigate(['main/requisition-detail-admin/']);
    this.showReqWaitAdmin();
}

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.currentUserSubscription.unsubscribe();
}

}
