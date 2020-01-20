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
  importDetail: [1, 2];

  constructor(
    private alertService: AlertService,
    private companyService: CompanyService,
    private exportService: ExportService,
    private router: Router,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private _Activatedroute: ActivatedRoute,

  ) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(users => {
      this.currentUser = users;
      console.log('users', users);
      this.decoded = jwt_decode(users.token);
      console.log('decoded', this.decoded);
    });
  }

  ngOnInit() {
    moment.locale('th');
    this.exportClothCode = this._Activatedroute.snapshot.paramMap.get('exportClothCode');
    console.log('id-pass', this.exportClothCode);
    this.getExportCloth();
    this.getExportDetail();

  }

  async getExportCloth() {
    try {
      const result: any = await this.exportService.showExportCloth(this.exportClothCode);
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
          }
          console.log(this.exportCloth);

      }

    } catch (err) {
      console.log(err);
    }
  }

  async getExportDetail() {
    try {
      const result: any = await this.exportService.showExportDetail(this.exportClothCode);
      console.log('result', result);
      if (result.rows) {
        console.log(result.rows);
        this.exportDetail = result.rows;
        console.log(this.exportDetail);

      }

    } catch (err) {
      console.log(err);
    }
  }
}

