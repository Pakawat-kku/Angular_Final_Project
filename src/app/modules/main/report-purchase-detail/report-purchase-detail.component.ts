import { PurchaseService } from 'src/app/services/purchase.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { AlertService } from './../../../services/alert.service';

import * as jwt_decode from 'jwt-decode';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../../services//Authentication.service';
import { UsersAuthorityService } from 'src/app/services/users-authority.service';
@Component({
  selector: 'app-report-purchase-detail',
  templateUrl: './report-purchase-detail.component.html',
  styleUrls: ['./report-purchase-detail.component.scss']
})
export class ReportPurchaseDetailComponent implements OnInit {
  purchaseId: any;
  date: string;
  month: string;
  year: string;
  purchaseDetailList: any[];
  currentUser: any;
  currentUserSubscription: Subscription;
  decoded: any ;
  authority: any = [];

  constructor(
    private _Activatedroute: ActivatedRoute,
    private _router: Router,
    private purchaseService: PurchaseService,
    private alertService: AlertService,
    private router: Router,
    private users_authorityService: UsersAuthorityService,
    private authenticationService: AuthenticationService,

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
    if (this.authority.three !== 'true') {
      this.alertService.error();
      this.router.navigate(['main/main']);
    } else {
    moment.locale('th');
    this.purchaseId = this._Activatedroute.snapshot.paramMap.get('purchaseId');

    this.getPurchaseDetail();
    }
  }

  async getPurchaseDetail() {
    try {
      const purchase: any = await this.purchaseService.getPurchaseById(this.purchaseId);
      if (purchase.rows) {
        this.date = moment(purchase.rows[0].purchaseDate).format('DD');
        this.month = moment(purchase.rows[0].purchaseDate).format('MMMM');
        this.year = moment(purchase.rows[0].purchaseDate).add(543, 'years').format('YYYY');

      }
      const result: any = await this.purchaseService.getPurchaseDetailById(this.purchaseId);
      if (result.rows) {
        this.purchaseDetailList = result.rows;

      }
    } catch (error) {
      console.log(error);
    }
  }

}
