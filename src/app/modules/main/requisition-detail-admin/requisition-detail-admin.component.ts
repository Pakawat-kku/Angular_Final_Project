import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { NgForm, FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../../services//Authentication.service';
import { UsersService } from '../../../services/users.service';
import * as jwt_decode from 'jwt-decode';
import { RequisitionService } from './../../../services/requisition.service';
import { Router, ActivatedRoute } from '@angular/router';
import { WardService } from './../../../services/ward.service';
import { UsersAuthorityService } from 'src/app/services/users-authority.service';
import { AvailableService } from './../../../services/available.service';
import { StockService } from './../../../services/stock.service';

@Component({
  selector: 'app-requisition-detail-admin',
  templateUrl: './requisition-detail-admin.component.html',
  styleUrls: ['./requisition-detail-admin.component.scss']
})

export class RequisitionDetailAdminComponent implements OnInit, OnDestroy {
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
  clothIdList: any[] = [];
  num = 0;
  notEnough: any = [];
  stringError = '';

  constructor(
    private alertService: AlertService,
    private requisitionService: RequisitionService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private users_authorityService: UsersAuthorityService,
    private wardService: WardService,
    private availableService: AvailableService,
    private stockService: StockService,


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

      if (result.rows) {

        this.showReqAdmin = result.rows;
        for (const item of this.showReqAdmin) {
          const result1: any = await this.wardService.getWardById(item.Ward_wardId);
          if (result1.rows.length === 0) {
            item.wardName = item.description;
          } else {
            item.wardName = result1.rows[0].wardName;
          }
          item.date = moment(item.reqDate).format('DD');
          item.month = moment(item.reqDate).format('MMMM');
          item.year = moment(item.reqDate).add(543, 'years').format('YYYY');
          item.time = moment(item.reqDate).format('HH:mm');
          item.day = item.date + '  ' + item.month + '  ' + item.year;
        }

      }
      this.approve = 0;

    } catch (err) {
      console.log(err);
    }
  }

  async showReqWaitAdminApprove() {

    try {
      const result: any = await this.requisitionService.showReqWaitAdminApprove();

      if (result.rows) {

        this.showReqAdmin = result.rows;
        for (const item of this.showReqAdmin) {
          const result1: any = await this.wardService.getWardById(item.Ward_wardId);
          if (result1.rows.length === 0) {
            item.wardName = item.description;
          } else {
            item.wardName = result1.rows[0].wardName;
          }
          item.date = moment(item.reqDate).format('DD');
          item.month = moment(item.reqDate).format('MMMM');
          item.year = moment(item.reqDate).add(543, 'years').format('YYYY');
          item.time = moment(item.reqDate).format('HH:mm');
          item.day = item.date + '  ' + item.month + '  ' + item.year;
        }
      }
      this.approve = 1;
    } catch (err) {
      console.log(err);
    }
  }

  async showReqWaitAdminNotApprove() {

    try {
      const result: any = await this.requisitionService.showReqWaitAdminNotApprove();


      if (result.rows) {
        this.showReqAdmin = result.rows;
        for (const item of this.showReqAdmin) {
          const result1: any = await this.wardService.getWardById(item.Ward_wardId);
          if (result1.rows.length === 0) {
            item.wardName = item.description;
          } else {
            item.wardName = result1.rows[0].wardName;
          }
          item.date = moment(item.reqDate).format('DD');
          item.month = moment(item.reqDate).format('MMMM');
          item.year = moment(item.reqDate).add(543, 'years').format('YYYY');
          item.time = moment(item.reqDate).format('HH:mm');
          item.day = item.date + '  ' + item.month + '  ' + item.year;
        }

      }
      this.approve = 1;
    } catch (err) {
      console.log(err);
    }
  }
  async search(searchWard) {

    try {

      const result: any = await this.requisitionService.searchWard(searchWard);
      if (result.rows) {

        this.showReqAdmin = result.rows;
        for (const item of this.showReqAdmin) {
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

  async searchReq(searchRequisitionId) {
    if (searchRequisitionId === null || searchRequisitionId === undefined) {
      this.alertService.error('กรุณาใส่รหัสการเบิก');
    } else {
      try {

        const result: any = await this.requisitionService.searchRequisitionCode(searchRequisitionId);
        if (result.rows) {

          this.showReqAdmin = result.rows;
          for (const item of this.showReqAdmin) {
            item.date = moment(item.reqDate).format('DD');
            item.month = moment(item.reqDate).format('MMMM');
            item.year = moment(item.reqDate).add(543, 'years').format('YYYY');
            item.time = moment(item.reqDate).format('HH:mm');
            item.day = item.date + '  ' + item.month + '  ' + item.year;
          }

        }
        for (const item of this.showReqAdmin) {
          if (item.status === 1) {
            this.searchRequisition = this.searchRequisition + 1;
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  }


  moAllApprove() {
    this.modalAllApprove = true;
  }

  async allApprove() {
    // ส่วนตัดสต็อก
    // for (const item of this.selected) {
    //   const result: any = await this.requisitionService.showReqWaitDetail(item.requisitionCode);

    //   for (const itemm of result.rows) {

    //     if (_.findIndex(this.clothIdList, ['clothId', itemm.Cloth_clothId]) < 0) {
    //       this.clothIdList.push({
    //         clothId: itemm.Cloth_clothId,
    //         amount: itemm.amountClothReal,
    //       });
    //     } else {
    //       this.num = _.findIndex(this.clothIdList, ['clothId', itemm.Cloth_clothId]);
    //       this.clothIdList[this.num].amount = this.clothIdList[this.num].amount + itemm.amountClothReal;
    //     }
    //   }

    // }
    // let noten = 0;
    // let note = 0;

    // for (const item of this.clothIdList) {

    //   const result1: any = await this.availableService.getAvailable(item.clothId);

    //   if (result1.rows.length === 0) {
    //     noten = noten + 1;
    //     const result2: any = await this.stockService.getClothById(item.clothId);
    //     this.notEnough[note] = result2.rows[0].clothName;
    //     note = note + 1;
    //   } else {

    //     if (result1.rows[0].AvailableAmount < item.amount) {
    //       noten = noten + 1;

    //       const result2: any = await this.stockService.getClothById(item.clothId);
    //       this.notEnough[note] = result2.rows[0].clothName;
    //       note = note + 1;
    //     }
    //   }
    // }

    // if (noten > 0) {

    //   for (const item of this.notEnough) {
    //   this.stringError += item + '';
    //   this.alertService.error('ไม่สามารถอนุมัติได้เนื่องจาก ' + this.stringError + 'ไม่เพียงพอ' );
    //   }
    // } else {


      for (const item of this.clothIdList) {
        let deficient = 0;
        const result1: any = await this.availableService.getAvailable(item.clothId);

        deficient = result1.rows[0].AvailableAmount - item.amount;

        const obj = {
          AvailableAmount: deficient
        };
        const result2: any = await this.availableService.updateAvailable(obj, item.clothId);
      }

      for (const item of this.selected) {
        const result: any = await this.requisitionService.showReqWaitDetail(item.requisitionCode);
        const result2: any = await this.requisitionService.approveReq(result.rows[0].Requisition_requisitionCode);
      }

      this.alertService.successApprove(' อนุมัติเสร็จสิ้น ');
      this.modalAllApprove = false;
      this.router.navigate(['main/requisition-detail-admin/']);
      this.showReqWaitAdmin();
    // }

  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.currentUserSubscription.unsubscribe();
  }

}
