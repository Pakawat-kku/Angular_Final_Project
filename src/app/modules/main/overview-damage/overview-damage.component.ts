import { AlertService } from './../../../services/alert.service';
import { StockService } from './../../../services/stock.service';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { DamageService } from './../../../services/damage.service';


@Component({
  selector: 'app-overview-damage',
  templateUrl: './overview-damage.component.html',
  styleUrls: ['./overview-damage.component.scss']
})
export class OverviewDamageComponent implements OnInit {
  damageList: any = [];
  constructor(
    private router: Router,
    private damageService: DamageService,
    private alertService: AlertService,
    private stockService: StockService
  ) { }

  ngOnInit() {
    this.getDamage();
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
