import { AlertService } from './../../../services/alert.service';
import { StockService } from './../../../services/stock.service';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { DamageService } from './../../../services/damage.service';

import * as jwt_decode from 'jwt-decode';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../../services//Authentication.service';
import { UsersAuthorityService } from 'src/app/services/users-authority.service';
@Component({
  selector: 'app-overview-damage',
  templateUrl: './overview-damage.component.html',
  styleUrls: ['./overview-damage.component.scss']
})
export class OverviewDamageComponent implements OnInit {
  damageList: any = [];
  currentUser: any;
  currentUserSubscription: Subscription;
  decoded: any = { status_approve: false };
  authority: any = [];

  constructor(
    private router: Router,
    private damageService: DamageService,
    private alertService: AlertService,
    private stockService: StockService,
    private authenticationService: AuthenticationService,
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
    if (this.authority.nine !== 'true') {
      this.alertService.error();
      this.router.navigate(['main/main']);
    } else {
    this.getDamage();
    }
  }

  async getDamage() {
    try {
      const cloth: any = await this.stockService.getCloth();
      if (cloth.rows) {
        this.damageList = cloth.rows;
      }
      // const result2: any = await this.damageService.getDamage();
      for (const row of this.damageList) {
        const result: any = await this.damageService.sumByClothId(row.clothId);
        if (result.rows[0].amount === null) {
          row.damageAmount = 0;
        } else {
          row.damageAmount = result.rows[0].amount;
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

}
