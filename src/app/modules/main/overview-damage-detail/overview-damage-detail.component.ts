import { AlertService } from './../../../services/alert.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DamageService } from './../../../services/damage.service';

@Component({
  selector: 'app-overview-damage-detail',
  templateUrl: './overview-damage-detail.component.html',
  styleUrls: ['./overview-damage-detail.component.scss']
})
export class OverviewDamageDetailComponent implements OnInit {
  clothId: any;
  damageList: any = [];
  nameCloth: any;
  nameClassifier: any;
  modalEdit = false;
  amount: any;
  currentRow: any;
  editRow: any;
  dateDamage: any;

  constructor(
    private _Activatedroute: ActivatedRoute,
    private damageService: DamageService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    moment.locale('th');
    this.clothId = this._Activatedroute.snapshot.paramMap.get('clothId');
    this.getList();
  }

  async getList() {
    try {
      const cloth: any = await this.damageService.sumByClothId(this.clothId);
      const result: any = await this.damageService.getByClothId(this.clothId);
      if (result.rows && cloth.rows[0]) {
        // console.log(result.rows);
        // console.log(cloth.rows[0]);
        this.nameCloth = result.rows[0].clothName;
        this.dateDamage = moment(result.rows[0].damageDate).add(543, 'years').format('DD MMMM YYYY');
        this.nameClassifier = result.rows[0].clothClassifier;
        this.amount = cloth.rows[0].amount;
        for (const row of result.rows) {
          row.damageDate = moment(row.damageDate).add(543, 'years').format('DD MMMM YYYY');
        }
        this.damageList = result.rows;
      }
    } catch (error) {
      console.log(error);
    }
  }

  onAdd() {
    this.currentRow = {
      damageAmount: 0
    };
    this.currentRow.mode = 'add';
    this.modalEdit = true;
  }

  async onSave() {
    const data = {
      damageAmount: this.currentRow.damageAmount,
      Cloth_clothId: this.clothId,
      damageDate: moment().format('YYYY-MM-DD')
    };
    try {
      const result: any = await this.damageService.insertDamage(data);
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
