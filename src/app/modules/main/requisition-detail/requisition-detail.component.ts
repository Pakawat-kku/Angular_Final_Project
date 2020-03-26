import { Component, OnInit  , OnDestroy } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../../services//Authentication.service';
import * as jwt_decode from 'jwt-decode';
import { RequisitionService } from './../../../services/requisition.service';
import { Router , ActivatedRoute} from '@angular/router';

import { UsersAuthorityService } from 'src/app/services/users-authority.service';
@Component({
  selector: 'app-requisition-detail',
  templateUrl: './requisition-detail.component.html',
  styleUrls: ['./requisition-detail.component.scss']
})
export class RequisitionDetailComponent implements OnInit , OnDestroy {
  currentUser: any;
  currentUserSubscription: Subscription;
  decoded: any;
  showReqlist: any;
  date: string;
  month: string;
  year: string;
  time: string;
  modalEdit = false;
  requisitionCode: any;
  regWaitDetail: any;
  showSearchRequisitionId: any;
  authority: any = [];

  constructor(
    private alertService: AlertService,
    private requisitionService: RequisitionService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private _Activatedroute: ActivatedRoute,
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
    if (this.decoded.position !== 2) {
      this.alertService.error();
      this.router.navigate(['main/main']);
    } else {
    moment.locale('th');
    this.getReqWait();
    }
  }

  async getReqWait() {
    try {
      const result: any = await this.requisitionService.showReqWait(this.decoded.Ward_wardId);
      if (result.rows) {
        this.showReqlist = result.rows;
          for (const item of this.showReqlist) {
              item.date = moment(item.reqDate).format('DD');
              item.month = moment(item.reqDate).format('MMMM');
              item.year = moment(item.reqDate).add(543, 'years').format('YYYY');
              item.time = moment(item.reqDate).format('HH:mm');
              item.day = item.date + '  ' + item.month + '  ' + item.year;
          }
      }
    } catch (err) {
      console.log(err);
    }
  }

  // async onAdd(requisitionCode) {
  //   this.modalEdit = true;
  //   this.requisitionCode = requisitionCode;
  //   console.log('this.requisitionCode' , this.requisitionCode);
  //   try {
  //     const result: any = await this.requisitionService.showReqWaitDetail(this.requisitionCode);
  //     console.log('result', result);
  //     if (result.rows) {
  //       this.regWaitDetail = result.rows;
  //       console.log('this.regWaitDetail', this.regWaitDetail);

  //     }

  //   } catch (err) {
  //     console.log(err);
  //   }

  // }

  async search(searchRequisitionId) {

    try {

      const result: any = await this.requisitionService.searchRequisitionCode(searchRequisitionId);
      if (result.rows) {

        this.showReqlist = result.rows;
        for (const item of this.showReqlist) {
          item.date = moment(item.reqDate).format('DD');
          item.month = moment(item.reqDate).format('MMMM');
          item.year = moment(item.reqDate).add(543, 'years').format('YYYY');
          item.time = moment(item.reqDate).format('HH:mm');
          item.day = item.date + '  ' + item.month + '  ' + item.year;
      }
      }
    } catch (error) {
      console.log(error);
    }
  }


  async searchTypeApprove() {

    try {
      const result: any = await this.requisitionService.searchTypeApprove(this.decoded.Ward_wardId);
      if (result.rows) {

        this.showReqlist = result.rows;
        for (const item of this.showReqlist) {
          item.date = moment(item.reqDate).format('DD');
          item.month = moment(item.reqDate).format('MMMM');
          item.year = moment(item.reqDate).add(543, 'years').format('YYYY');
          item.time = moment(item.reqDate).format('HH:mm');
          item.day = item.date + '  ' + item.month + '  ' + item.year;
      }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async searchTypeNotApprove() {

    try {
      const result: any = await this.requisitionService.searchTypeNotApprove(this.decoded.Ward_wardId);
      if (result.rows) {

        this.showReqlist = result.rows;
        for (const item of this.showReqlist) {
          item.date = moment(item.reqDate).format('DD');
          item.month = moment(item.reqDate).format('MMMM');
          item.year = moment(item.reqDate).add(543, 'years').format('YYYY');
          item.time = moment(item.reqDate).format('HH:mm');
          item.day = item.date + '  ' + item.month + '  ' + item.year;
      }

      }
    } catch (error) {
      console.log(error);
    }
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.currentUserSubscription.unsubscribe();
}
}
