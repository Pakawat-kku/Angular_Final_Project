import { AlertService } from './../../../services/alert.service';
import { WithdrawService } from './../../../services/withdraw.service';
import { RequisitionService } from './../../../services/requisition.service';
import { Component, OnInit } from '@angular/core';
import * as jwt_decode from 'jwt-decode';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Users } from '../register/users';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/services/Authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-overview-withdraw',
  templateUrl: './overview-withdraw.component.html',
  styleUrls: ['./overview-withdraw.component.scss']
})
export class OverviewWithdrawComponent implements OnInit {
  requisitionList: any[];
  withdrawCode: any;
  modalShow = false;
  reqDetailList: any[];
  selected: any = [];
  collapsed = true;
  currentUser: Users;
  currentUserSubscription: Subscription;
  decoded: any;

  constructor(
    private requisitionService: RequisitionService,
    private authenticationService: AuthenticationService,
    private withdrawService: WithdrawService,
    private alertService: AlertService,
    private router: Router
  ) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(users => {
      this.currentUser = users;
      this.decoded = jwt_decode(users.token);
    });
  }

  ngOnInit() {
    this.getRequisition();
    moment.locale('th');
  }

  async getRequisition() {
    try {
      const result: any = await this.requisitionService.showReqApprove();
      if (result.rows) {
        this.requisitionList = result.rows;
        for (const item of this.requisitionList) {
          item.reqTime = moment(item.reqDate).format('HH:mm');
          item.reqDate = moment(item.reqDate).add(543, 'years').format('DD MMMM YYYY');
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async onShow(code) {
    this.modalShow = true;
    console.log('code', code);
    try {
      const result: any = await this.requisitionService.showReqDetailApprove(code);
      if (result.rows) {
        this.reqDetailList = result.rows;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async onSubmit() {
    // console.log(this.selected);
    const decision: any = await this.alertService.confirm('ยืนยันการทำรายการ ?');
    if (decision.value) {
      try {
        const data: any = [];
        this.withdrawCode = this.decoded.userId + moment().format('YYYYMMDDHHmmss');
        for (const row of this.selected) {
          await data.push({
            withdrawCode: this.withdrawCode,
            withdrawDate: moment().format('YYYY-MM-DD HH:mm:ss'),
            withdraw_status: '1',
            Ward_wardId: row.wardId,
            Users_userId: this.decoded.userId,
            Requisition_requisitionCode: row.requisitionCode
          });
          await this.requisitionService.statusWithdraw(row.requisitionCode);
        }
        console.log(data);

        const result: any = await this.withdrawService.saveWithdraw(data);
        if (result.statusCode === 200) {
          this.alertService.success('เลือกรายการสำเร็จ');
          await this.getRequisition();
          this.router.navigate(['main/overview-withdraw-detail/' + this.withdrawCode]);
        } else {
          console.log(result);
        }

      } catch (error) {
        console.log(error);
      }
    }
  }
}
