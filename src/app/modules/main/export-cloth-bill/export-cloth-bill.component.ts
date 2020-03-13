import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../../services//Authentication.service';
import { NgForm, FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import * as jwt_decode from 'jwt-decode';
import * as _ from 'lodash';
import * as moment from 'moment';
import { IMyOptions } from 'mydatepicker-th';
import { CompanyService } from './../../../services/company.service';
import { ExportService } from './../../../services/export.service';
import { ImportClothService } from 'src/app/services/import-cloth.service';
import { ImportDetailWeightService } from 'src/app/services/import-detail-weight.service';
import { ImportDetailWeightSumService } from 'src/app/services/import-detail-weight-sum.service';

import { UsersAuthorityService } from 'src/app/services/users-authority.service';
@Component({
  selector: 'app-export-cloth-bill',
  templateUrl: './export-cloth-bill.component.html',
  styleUrls: ['./export-cloth-bill.component.scss']
})
export class ExportClothBillComponent implements OnInit {
  currentUserSubscription: Subscription;
  currentUser: any;
  decoded: any;
  exportCloth: any;
  exportDetail: any;
  exportClothCode: any;
  importDetail: any;
  importList: any;
  importDetailList: any;
  importCloth: any;
  percent: any;
  importDetailWeightSum: any;
  exportClothHospital: any;
  exportClothType: any;
  exportClothTypeHospital: any;
  getInner = '';
  exportClothCodeDummy: any;
  importClothCode = '';
  authority: any = [];


  constructor(
    private alertService: AlertService,
    private companyService: CompanyService,
    private exportService: ExportService,
    private router: Router,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private _Activatedroute: ActivatedRoute,
    private importService: ImportClothService,
    private importDetailWeightClothService: ImportDetailWeightService,
    private importDetailWeightSumService: ImportDetailWeightSumService,
    private users_authorityService: UsersAuthorityService,
    
  ) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(users => {
      this.currentUser = users;
      console.log('users', users);
      this.decoded = jwt_decode(users.token);
      console.log('decoded', this.decoded);
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
        this.authority.eigth = 'true';
      }
    }
    if (this.authority.ten !== 'true') {
      this.alertService.error();
      this.router.navigate(['main/main']);
    } else {
    moment.locale('th');
    this.exportClothCode = this._Activatedroute.snapshot.paramMap.get('exportClothCode');
    console.log('id-pass', this.exportClothCode);
    await this.getExportCloth();
    await this.getExportDetail();
    await this.getImportDetail();
    await this.getImportCloth();
    await this.getImportDetailWeightSum();
    }
  }

  async getExportCloth() {
    try {
      console.log('exportClothCode', this.exportClothCode);
      const result: any = await this.exportService.showExportClothCompany(this.exportClothCode);
      const result1: any = await this.exportService.showExportClothHospital(this.exportClothCode);

      console.log('result', result);

      if (result.rows) {
        console.log(result.rows);
        this.exportCloth = result.rows;
        for (const item of this.exportCloth) {
          item.date = moment(item.exportClothDate).format('DD');
          item.month = moment(item.exportClothDate).format('MMMM');
          item.year = moment(item.exportClothDate).add(543, 'years').format('YYYY');
          item.time = moment(item.exportClothDate).format('HH:mm');
          item.day = item.date + '  ' + item.month + '  ' + item.year;
          item.percent = item.exportClothTotalWeight.toFixed(2) * 0.95;
          item.percent = parseFloat(item.percent).toFixed(2);
          this.exportClothType = item.exportClothType;
        }
        console.log('this.exportCloth', this.exportCloth);

        this.exportClothHospital = result1.rows;
        for (const item of this.exportClothHospital) {
          item.date = moment(item.exportClothDate).format('DD');
          item.month = moment(item.exportClothDate).format('MMMM');
          item.year = moment(item.exportClothDate).add(543, 'years').format('YYYY');
          item.time = moment(item.exportClothDate).format('HH:mm');
          item.day = item.date + '  ' + item.month + '  ' + item.year;
          item.percent = item.exportClothTotalWeight.toFixed(2) * 0.95;
          item.percent = parseFloat(item.percent).toFixed(2);
          this.exportClothTypeHospital = item.exportClothType;

        }
        console.log('this.exportClothType', this.exportClothType);
        console.log('exportClothTypeHospital', this.exportClothTypeHospital);
      }

    } catch (err) {
      console.log(err);
    }
  }

  async getExportDetail() {
    try {
      const result: any = await this.exportService.showExportDetail(this.exportClothCode);
      if (result.rows) {
        console.log(result.rows);
        this.exportDetail = result.rows;
        console.log('this.exportDetail', this.exportDetail);

      }

    } catch (err) {
      console.log(err);
    }
  }

  async getImportCloth() {
    try {
      const result: any = await this.importService.showImportCloth(this.exportClothCode);
      if (result.rows) {
        console.log(result.rows);

        this.importCloth = result.rows;

        for (const item of this.importCloth) {
          item.date = moment(item.importDate).format('DD');
          item.month = moment(item.importDate).format('MMMM');
          item.year = moment(item.importDate).add(543, 'years').format('YYYY');
          item.time = moment(item.importDate).format('HH:mm');
          item.day = item.date + '  ' + item.month + '  ' + item.year;
          this.importClothCode = item.importCode;
        }
        console.log('this.importCloth', this.importCloth);

      }

    } catch (err) {
      console.log(err);
    }
  }

  async getImportDetail() {
    try {
      const result: any = await this.importDetailWeightClothService.showImportDetailWeight(this.exportClothCode);
      if (result.rows) {
        console.log(result.rows);
        this.importDetail = result.rows;
        console.log('this.importDetail', this.importDetail);

      }

    } catch (err) {
      console.log(err);
    }
  }
  async getImportDetailWeightSum() {
    try {
      console.log(this.exportClothCode);
      const result: any = await this.importService.showImportCloth(this.exportClothCode);
      this.exportClothCodeDummy = result.rows;
      for (const item of this.exportClothCodeDummy) {
        this.exportClothCodeDummy = item.importCode;
      }
      console.log('this.exportClothCodeDummy', this.exportClothCodeDummy);

      const result1: any = await this.importService.getInner(this.exportClothCode);
      const result2: any = await this.importDetailWeightSumService.showImportDetailWeightSum(this.exportClothCodeDummy);

      if (result.rows && result1.rows) {
        console.log(result.rows);
        this.getInner = result1.rows;
        console.log('this.getInner', this.getInner);
        this.importDetailWeightSum = result2.rows;
        console.log('this.importDetailWeightSum', this.importDetailWeightSum);

      }

    } catch (err) {
      console.log(err);
    }
  }
}


