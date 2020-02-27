import { AlertService } from './../../../services/alert.service';
import { StockService } from './../../../services/stock.service';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { RepairService } from 'src/app/services/repair.service';

@Component({
  selector: 'app-repair',
  templateUrl: './repair.component.html',
  styleUrls: ['./repair.component.scss']
})
export class RepairComponent implements OnInit {
repairList: any = [];
  constructor(
    private router: Router,
    private alertService: AlertService,
    private stockService: StockService,
    private repairService: RepairService
  ) { }

  async ngOnInit() {
    await this.getRepair();
  }

  async getRepair() {
    try {
      const cloth: any = await this.stockService.getCloth();
      if (cloth.rows) {
        this.repairList = cloth.rows;
      }
      for (const row of this.repairList) {
        const result: any = await this.repairService.sumByClothId(row.clothId);
        console.log(result.rows);
        
        if (result.rows[0].amount === null) {
          row.repairAmount = 0;
        } else {
          row.repairAmount = result.rows[0].amount;
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

}
