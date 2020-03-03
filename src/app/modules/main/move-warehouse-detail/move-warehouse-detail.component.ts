import { Component, OnInit } from '@angular/core';
import { StockService } from './../../../services/stock.service';
import { WareHouseService } from './../../../services/wareHouse.service';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { AvailableService } from './../../../services/available.service';
import { Warehouse_export_availableService } from './../../../services/Warehouse_export_available';
import { Warehouse_export_availableDetailService } from './../../../services/warehouse_export_availableDetail';
import { AuthenticationService } from '../../../services//Authentication.service';
import * as jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-move-warehouse-detail',
  templateUrl: './move-warehouse-detail.component.html',
  styleUrls: ['./move-warehouse-detail.component.scss']
})
export class MoveWarehouseDetailComponent implements OnInit {
  Warehouse_export_available: any;
  warehouse_export_availableCode: any;
  modalDetail = false;
  warehouse_export_availableDetail: any;
  currentRow: any;

  constructor(
    private alertService: AlertService,
    private router: Router,
    private stockService: StockService,
    private wareHouseService: WareHouseService,
    private availableService: AvailableService,
    private warehouse_export_availableService: Warehouse_export_availableService,
    private warehouse_export_availableDetailService: Warehouse_export_availableDetailService,
    private authenticationService: AuthenticationService,


  ) { }

  async ngOnInit() {
    moment.locale('th');
    await this.getWarehouse_export_available();
  }


  async getWarehouse_export_available() {
    const result: any = await this.warehouse_export_availableService.getWarehouse_export_available();
    this.Warehouse_export_available = result.rows;
    for (const item of this.Warehouse_export_available) {
      item.date = moment(item.warehouse_export_availableDate).format('DD');
      item.month = moment(item.warehouse_export_availableDate).format('MMMM');
      item.year = moment(item.warehouse_export_availableDate).add(543, 'years').format('YYYY');
      item.time = moment(item.warehouse_export_availableDate).format('HH:mm');
      item.day = item.date + '  ' + item.month + '  ' + item.year;
    }
    console.log('getWarehouse_export_available', this.Warehouse_export_available);

  }

  async search() {
    try {

      if (this.warehouse_export_availableCode === undefined) {
        this.alertService.error('กรุณากรอกรหัสการเบิกที่ต้องการค้นหา');
      } else {

      console.log('this.warehouse_export_availableCode', this.warehouse_export_availableCode);

      // tslint:disable-next-line: max-line-length
      const result: any = await this.warehouse_export_availableService.searchWarehouse_export_available(this.warehouse_export_availableCode);
      console.log('result.rows', result.rows);
      if (result.rows) {

        this.Warehouse_export_available = result.rows;
        for (const item of this.Warehouse_export_available) {
          item.date = moment(item.warehouse_export_availableDate).format('DD');
          item.month = moment(item.warehouse_export_availableDate).format('MMMM');
          item.year = moment(item.warehouse_export_availableDate).add(543, 'years').format('YYYY');
          item.time = moment(item.warehouse_export_availableDate).format('HH:mm');
          item.day = item.date + '  ' + item.month + '  ' + item.year;
        }
        console.log('getWarehouse_export_available', this.Warehouse_export_available);
      }
    }
    } catch (error) {
      console.log(error);
    }
  }

  async modalDetailExport(row) {
    this.currentRow = Object.assign({}, row);
    this.modalDetail = true;
    console.log('warehouse_export_availableCode', this.currentRow.warehouse_export_availableCode);

    // tslint:disable-next-line: max-line-length
    const result: any = await this.warehouse_export_availableDetailService.getWarehouse_export_availableDetailByCode(this.currentRow.warehouse_export_availableCode);
    console.log(result.rows);
    this.warehouse_export_availableDetail = result.rows;


  }
}


