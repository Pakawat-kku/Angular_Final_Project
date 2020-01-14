import { Component, OnInit  , OnDestroy } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../../services//Authentication.service';
import * as jwt_decode from 'jwt-decode';
import { RequisitionService } from './../../../services/requisition.service';
import { Router } from '@angular/router';

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

  constructor(
    private alertService: AlertService,
    private requisitionService: RequisitionService,
    private router: Router,
    private authenticationService: AuthenticationService,

  ) {
      this.currentUserSubscription = this.authenticationService.currentUser.subscribe(users => {
      this.currentUser = users;
      console.log('users' , users );
      this.decoded = jwt_decode(users.token);
      console.log('decoded', this.decoded);

  });
  }

  ngOnInit() {
    moment.locale('th');

    this.getReqWait();
  }

  async getReqWait() {
    console.log('this.decoded.Ward_wardId', this.decoded.Ward_wardId);
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
      console.log('searchWard : ', searchRequisitionId);

      const result: any = await this.requisitionService.searchRequisitionCode(searchRequisitionId);
      if (result.rows) {
        console.log('search ', result.rows);
        this.showReqlist = result.rows;
        for (const item of this.showReqlist) {
          item.date = moment(item.reqDate).format('DD');
          item.month = moment(item.reqDate).format('MMMM');
          item.year = moment(item.reqDate).add(543, 'years').format('YYYY');
          item.time = moment(item.reqDate).format('HH:mm');
          item.day = item.date + '  ' + item.month + '  ' + item.year;
      }
          console.log(this.showReqlist);
      }
    } catch (error) {
      console.log(error);
    }
  }


  async searchTypeApprove() {
    console.log('this.decoded.Ward_wardId', this.decoded.Ward_wardId);

    try {
      const result: any = await this.requisitionService.searchTypeApprove(this.decoded.Ward_wardId);
      if (result.rows) {
        console.log('search ', result.rows);
        this.showReqlist = result.rows;
        for (const item of this.showReqlist) {
          item.date = moment(item.reqDate).format('DD');
          item.month = moment(item.reqDate).format('MMMM');
          item.year = moment(item.reqDate).add(543, 'years').format('YYYY');
          item.time = moment(item.reqDate).format('HH:mm');
          item.day = item.date + '  ' + item.month + '  ' + item.year;
      }
          console.log(this.showReqlist);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async searchTypeNotApprove() {
    console.log('this.decoded.Ward_wardId', this.decoded.Ward_wardId);

    try {
      const result: any = await this.requisitionService.searchTypeNotApprove(this.decoded.Ward_wardId);
      if (result.rows) {
        console.log('search ', result.rows);
        this.showReqlist = result.rows;
        for (const item of this.showReqlist) {
          item.date = moment(item.reqDate).format('DD');
          item.month = moment(item.reqDate).format('MMMM');
          item.year = moment(item.reqDate).add(543, 'years').format('YYYY');
          item.time = moment(item.reqDate).format('HH:mm');
          item.day = item.date + '  ' + item.month + '  ' + item.year;
      }
          console.log(this.showReqlist);
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
