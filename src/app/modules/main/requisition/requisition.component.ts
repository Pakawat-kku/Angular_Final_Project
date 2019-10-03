import { Component, OnInit } from '@angular/core';
import { RequisitionService } from './../../../services/requisition.service';
import { StockService } from './../../../services/stock.service';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-requisition',
  templateUrl: './requisition.component.html',

})
export class RequisitionComponent implements OnInit {
  stockList: [];
  reqList: [];
  req: any;
  currentRow: any;
  modalEdit = false;
  cId: any;

  constructor(
    private alertService: AlertService,
    private stockService: StockService,
    private requisitionService: RequisitionService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getStock();
    // this.getReg();
  }

  async getStock() {
    try {
      const result: any = await this.stockService.getStock();
      if (result.rows) {
        console.log(result.rows);
        this.stockList = result.rows;
      }
    } catch (err) {
      console.log(err);
    }
  }

   async onSave(row) {
    this.currentRow = Object.assign({}, row);
    console.log('row', this.currentRow);
    this.cId = this.currentRow.cId;
    this.currentRow.mode = 'insert';
    this.modalEdit = true;
  }

  async onSubmit(cId, reqAmountCloth) {
    try {
      console.log('cId', cId);
      console.log('reqAmountCloth', reqAmountCloth);
      const obj = {
        cId: cId,
        reqAmountCloth: reqAmountCloth
      };
      console.log('obj', obj);
      const result = await this.requisitionService.insertReq(obj);
      console.log('result', result);

      if (result.ok) {
        this.alertService.reqSuccess('บันทึกสำเร็จ').then(value => {
          console.log('value', value);
          if (value.dismiss) {
            this.modalEdit = false;
            this.router.navigate(['main/requisition']);
          }
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  // async onSave(form) {
  //   try {
  //     this.req = form.value;
  //     console.log('save', form.value);

  //     const result = await this.stockService.insertWithdraw(this.req);
  //     if (result.ok) {
  //       this.router.navigate(['main/requisition']);
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  }

