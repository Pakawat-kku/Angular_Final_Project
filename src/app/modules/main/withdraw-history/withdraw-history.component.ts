import { Component, OnInit } from '@angular/core';
import { WithdrawService } from 'src/app/services/withdraw.service';
import * as jwt_decode from 'jwt-decode';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/services/Authentication.service';
import { AlertService } from 'src/app/services/alert.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UsersAuthorityService } from 'src/app/services/users-authority.service';
@Component({
  selector: 'app-withdraw-history',
  templateUrl: './withdraw-history.component.html',
  styleUrls: ['./withdraw-history.component.scss']
})
export class WithdrawHistoryComponent implements OnInit {
  withdrawList: any[];
  collapsed = true;
  currentUser: any;
  currentUserSubscription: Subscription;
  decoded: any;
  authority: any = [];
  constructor(
    private withdrawService: WithdrawService,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private _Activatedroute: ActivatedRoute,
    private router: Router,
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
    if (this.authority.one !== 'true') {
      this.alertService.error();
      this.router.navigate(['main/main']);
    } else {
    moment.locale('th');
    this.getWithdraw();
    }
  }

  async getWithdraw() {
    try {
      const result: any = await this.withdrawService.getWithdrawByUserId(this.decoded.userId);
      if (result.rows) {
        this.withdrawList = result.rows;
        for (let item of this.withdrawList) {
          item.date = moment(item.withdrawDate).add(543, 'years').format('DD MMMM YYYY');
        }
        // console.log(this.withdrawList);
      }
    } catch (error) {
      console.log(error);
    }
  }

}
