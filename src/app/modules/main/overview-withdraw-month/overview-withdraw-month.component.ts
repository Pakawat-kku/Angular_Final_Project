import { WithdrawService } from 'src/app/services/withdraw.service';
import { AlertService } from './../../../services/alert.service';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Router } from '@angular/router';


@Component({
  selector: 'app-overview-withdraw-month',
  templateUrl: './overview-withdraw-month.component.html',
  styleUrls: ['./overview-withdraw-month.component.scss']
})
export class OverviewWithdrawMonthComponent implements OnInit {
  selectMonth = '0';
  year: any;
  year2: any;
  month: any;
  month1: string;
  month2: string;
  withdrawList: any = [];
  constructor(
    private router: Router,
    private alertService: AlertService,
    private withdrawService: WithdrawService
  ) { }

  ngOnInit() {
    this.year2 = moment().add(543, 'years').format('YYYY');
  }

  async onSearch(selectMonth) {
    if (selectMonth) {
      moment.locale('th');
      this.year = moment().format('YYYY');
      this.month2 = moment([this.year, selectMonth, 1]).add(1, 'month').format('YYYY-MM-DD');
      this.month1 = moment([this.year, selectMonth, 1]).subtract(1, 'day').format('YYYY-MM-DD');
    }
    try {
      // this.month1 = String(this.month1);
      // this.month2 = String(this.month2);
      console.log(this.month1, this.month2);
      const result: any = await this.withdrawService.checkPerMonth(
        this.month1,
        this.month2
      );
      console.log(result.rows);
      if (result.rows) {
        this.withdrawList = result.rows;
        for (let i = 0; i < result.rows.length; i++) {
          this.withdrawList[i].withdrawDate = moment(result.rows[i].withdrawDate)
            .add(543, 'years')
            .format('Do-MMMM-YYYY');
        }
      }
      console.log(this.withdrawList);
    } catch (error) {
      console.log(error);
    }
  }

}
