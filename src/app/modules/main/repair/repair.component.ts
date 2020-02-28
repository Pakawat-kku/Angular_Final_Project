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
  modalEdit = false;
  currentRow: any = [];
  editRow: any;
  clothList: any = [];
  addRepair: any[] = [{
    clothId: '1',
    amount: null
  }];

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
        this.clothList = cloth.rows;
      }
      for (const row of this.repairList) {
        const result: any = await this.repairService.sumByClothId(row.clothId);
        // console.log(result.rows);
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

  onAdd() {
    this.currentRow.mode = 'add';
    this.modalEdit = true;
  }

  async addNewRow() {
    await this.addRepair.push({
      clothId: '1',
      amount: null
    });
  }

  async onDelete(rowNo) {
    const result: any = await this.alertService.confirm('ยืนยันการลบ ?');
    if (result.value) {
      const data: any = [];
      this.addRepair.forEach((row, index) => {
        if (rowNo !== index) {
          data.push(row);
        }
      });
      this.addRepair = data;
    }
  }

  async onSave() {
    console.log(this.addRepair);
    for (const row of this.addRepair) {
      const data = {
        repairAmount: row.amount,
        Cloth_clothId: row.clothId,
        repairDate: moment().format('YYYY-MM-DD')
      };
      try {
        const result: any = await this.repairService.insertRepair(data);
      } catch (error) {
        console.log(error);
      }
    }
    await this.alertService.success('บันทึกข้อมูลสำเร็จ');
    this.modalEdit = false;
    this.getRepair();
  }

}
