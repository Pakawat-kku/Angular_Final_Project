import { AlertService } from './../../../services/alert.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RepairService } from 'src/app/services/repair.service';

@Component({
  selector: 'app-repair-detail',
  templateUrl: './repair-detail.component.html',
  styleUrls: ['./repair-detail.component.scss']
})
export class RepairDetailComponent implements OnInit {
  clothId: any;
  repairList: any = [];
  nameCloth: any;
  nameClassifier: any;
  modalEdit = false;
  amount: any;
  currentRow: any;
  editRow: any;
  dateRepair: any;

  constructor(
    private _Activatedroute: ActivatedRoute,
    private alertService: AlertService,
    private repairService: RepairService
  ) { }

  ngOnInit() {
    moment.locale('th');
    this.clothId = this._Activatedroute.snapshot.paramMap.get('clothId');
    this.getList();
  }

  async getList() {
    try {
      const cloth: any = await this.repairService.sumByClothId(this.clothId);
      const result: any = await this.repairService.getByClothId(this.clothId);
      if (result.rows && cloth.rows[0]) {
        // console.log(result.rows);
        // console.log(cloth.rows[0]);
        this.nameCloth = result.rows[0].clothName;
        this.dateRepair = moment(result.rows[0].repairDate).add(543, 'years').format('DD MMMM YYYY');
        this.nameClassifier = result.rows[0].clothClassifier;
        this.amount = cloth.rows[0].amount;
        for (const row of result.rows) {
          row.repairDate = moment(row.repairDate).add(543, 'years').format('DD MMMM YYYY');
        }
        this.repairList = result.rows;
      }
    } catch (error) {
      console.log(error);
    }
  }

  onAdd() {
    this.currentRow = {
      repairAmount: 0
    };
    this.currentRow.mode = 'add';
    this.modalEdit = true;
  }

  async onSave() {
    const data = {
      repairAmount: this.currentRow.repairAmount,
      Cloth_clothId: this.clothId,
      repairDate: moment().format('YYYY-MM-DD')
    };
    try {
      const result: any = await this.repairService.insertRepair(data);
      if (result.rows) {
        await this.alertService.success('บันทึกข้อมูลสำเร็จ');
        this.modalEdit = false;
        this.getList();
      }
    } catch (error) {
      console.log(error);
    }
  }

}
