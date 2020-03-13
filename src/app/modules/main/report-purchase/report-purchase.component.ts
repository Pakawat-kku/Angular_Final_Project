import { PurchaseService } from 'src/app/services/purchase.service';
import { AlertService } from './../../../services/alert.service';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';

import * as jwt_decode from 'jwt-decode';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../../services//Authentication.service';
import { UsersAuthorityService } from 'src/app/services/users-authority.service';
@Component({
  selector: 'app-report-purchase',
  templateUrl: './report-purchase.component.html',
  styleUrls: ['./report-purchase.component.scss']
})
export class ReportPurchaseComponent implements OnInit {
  purchaseList: any[];
  currentUser: any;
  currentUserSubscription: Subscription;
  decoded: any ;
  authority: any = [];

  constructor(
    private purchaseService: PurchaseService,
    private alertService: AlertService,
    private _Activatedroute: ActivatedRoute,
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
    this.getPurchase();
    }
  }

  async getPurchase() {
    moment.locale('th');
    try {
      const result: any = await this.purchaseService.getAllPurchase();
      if (result.rows) {
        this.purchaseList = result.rows;
        for(let item of this.purchaseList)
        {
          item.date = moment(item.purchaseDate).format('DD');
          item.month = moment(item.purchaseDate).format('MMMM');
          item.year = moment(item.purchaseDate).add(543, 'years').format('YYYY');
        }
      }
      console.log(this.purchaseList);
    } catch (error) {
      console.log(error);

    }
  }
}
