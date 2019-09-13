import { Component, OnInit } from '@angular/core';
import { StockService } from './../../../services/stock.service';
@Component({
  selector: 'app-requisition',
  templateUrl: './requisition.component.html',

})
export class RequisitionComponent implements OnInit {
  stockList: any;

  constructor(
    private stockService: StockService
  ) {}

  ngOnInit() {
    this.getStock();
  }

  async getStock() {
    try {
      const result: any = await this.stockService.getStock();
      if (result.rows) {
        console.log(result.rows);
        this.stockList = result.rows;
        console.log('fff', this.stockList);
      }
    } catch (err) {
      console.log(err);
    }
  }

}
