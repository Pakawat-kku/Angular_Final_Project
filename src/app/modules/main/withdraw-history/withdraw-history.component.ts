import { Component, OnInit } from '@angular/core';
import { WithdrawService } from 'src/app/services/withdraw.service';
import * as jwt_decode from 'jwt-decode';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/services/Authentication.service';

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

  constructor(
    private withdrawService: WithdrawService,
    private authenticationService: AuthenticationService
  ) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(users => {
      this.currentUser = users;
      this.decoded = jwt_decode(users.token);
    });
  }

  ngOnInit() {
    moment.locale('th');
    this.getWithdraw();
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
