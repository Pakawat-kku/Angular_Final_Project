import { Component, OnInit } from '@angular/core';
import { StockService } from './../../../services/stock.service';
import { WareHouseService } from './../../../services/wareHouse.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { AvailableService } from './../../../services/available.service';
import { Warehouse_export_availableService } from './../../../services/warehouse_export_available';
import { Warehouse_export_availableDetailService } from './../../../services/warehouse_export_availableDetail';
import { AuthenticationService } from '../../../services//Authentication.service';
import * as jwt_decode from 'jwt-decode';
import { Subscription } from 'rxjs';

import { UsersAuthorityService } from 'src/app/services/users-authority.service';
@Component({
  selector: 'app-move-warehouse-bill-detail',
  templateUrl: './move-warehouse-bill-detail.component.html',
  styleUrls: ['./move-warehouse-bill-detail.component.scss']
})
export class MoveWarehouseBillDetailComponent implements OnInit {
  warehouse_export_available: any;
  warehouse_export_availableCode: any;
  modalDetail = false;
  warehouse_export_availableDetail: any;
  currentRow: any;
  currentUser: any;
  currentUserSubscription: Subscription;
  decoded: any = { status_approve: false };
  authority: any = [];
  
  constructor(
    private alertService: AlertService,
    private router: Router,
    private stockService: StockService,
    private wareHouseService: WareHouseService,
    private availableService: AvailableService,
    private warehouse_export_availableService: Warehouse_export_availableService,
    private warehouse_export_availableDetailService: Warehouse_export_availableDetailService,
    private authenticationService: AuthenticationService,
    private _Activatedroute: ActivatedRoute,
    private users_authorityService: UsersAuthorityService,



  ) { 
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(users => {
      this.currentUser = users;
      this.decoded = jwt_decode(users.token);
  });
  }

  async ngOnInit() {
    const result: any = await this.users_authorityService.getById(this.decoded.userId);
    // console.log('result.rows' , result);
    for (const item of result.rows) {
      if (item.aId === 1) {
        this.authority.one = 'true';
      } if (item.aId === 2) {
        this.authority.two = 'true';
      } if (item.aId === 3) {
        this.authority.three = 'true';
      } if (item.aId === 4) {
        this.authority.four = 'true';
      } if (item.aId === 5) {
        this.authority.five = 'true';
      } if (item.aId === 6) {
        this.authority.six = 'true';
      } if (item.aId === 7) {
        this.authority.seven = 'true';
      } if (item.aId === 8) {
        this.authority.eigth = 'true';
      } if (item.aId === 9) {
        this.authority.nine = 'true';
      } if (item.aId === 10) {
        this.authority.ten = 'true';
      }
    }
    if (this.authority.five !== 'true') {
      this.alertService.error();
      this.router.navigate(['main/main']);
    } else {
    moment.locale('th');
    this.warehouse_export_availableCode = this._Activatedroute.snapshot.paramMap.get('warehouse_export_availableCode');
    this.getWarehouse_export_availableDetail();
  }
}

  async getWarehouse_export_availableDetail () {
    // tslint:disable-next-line: max-line-length
    const result: any = await this.warehouse_export_availableDetailService.getWarehouse_export_availableDetailByCode(this.warehouse_export_availableCode);
    this.warehouse_export_availableDetail = result.rows;
    console.log('warehouse_export_availableDetail' , this.warehouse_export_availableDetail);

    // tslint:disable-next-line: max-line-length
    const result1: any = await this.warehouse_export_availableService.getWarehouse_export_availableByCode(this.warehouse_export_availableCode);
    this.warehouse_export_available = result1.rows;
    for (const item of this.warehouse_export_available) {
      item.date = moment(item.warehouse_export_availableDate).format('DD');
      item.month = moment(item.warehouse_export_availableDate).format('MMMM');
      item.year = moment(item.warehouse_export_availableDate).add(543, 'years').format('YYYY');
      item.time = moment(item.warehouse_export_availableDate).format('HH:mm');
      item.day = item.date + ' ' + item.month + ' ' + item.year;
    }
    console.log('warehouse_export_available', this.warehouse_export_available);


  }

}
