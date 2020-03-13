import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
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

import { UsersAuthorityService } from 'src/app/services/users-authority.service';
@Component({
  selector: 'app-export-cloth-detail',
  templateUrl: './export-cloth-detail.component.html',
  styleUrls: ['./export-cloth-detail.component.scss']
})
export class ExportClothDetailComponent implements OnInit {
  currentUserSubscription: Subscription;
  currentUser: any;
  decoded: any;
  exportClothHos: any;
  exportClothCompany: any;
  status: any;
  authority: any = [];

  constructor(
    private alertService: AlertService,
    private companyService: CompanyService,
    private exportService: ExportService,
    private router: Router,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
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
        this.authority.ten = 'true';
      }
    }
    if (this.authority.eigth !== 'true') {
      this.alertService.error();
      this.router.navigate(['main/main']);
    } else {
    this.exportClothHospital();
    moment.locale('th');
  }
}

  async exportClothHospital() {
    console.log('this.decoded.Ward_wardId', this.decoded.Ward_wardId);
    try {
      const result: any = await this.exportService.getExportClothHos();

      console.log('result', result);

      if (result.rows) {
        this.exportClothHos = result.rows;
          for (const item of this.exportClothHos) {
              item.date = moment(item.exportClothDate).format('DD');
              item.month = moment(item.exportClothDate).format('MMMM');
              item.year = moment(item.exportClothDate).add(543, 'years').format('YYYY');
              item.time = moment(item.exportClothDate).format('HH:mm');
              item.day = item.date + '  ' + item.month + '  ' + item.year;
          }
          console.log('this.exportClothHos' , this.exportClothHos);
        }
          this.status =  1;
          console.log('status', this.status);

    } catch (err) {
      console.log(err);
    }
  }


async exportClothCom() {
  console.log('this.decoded.Ward_wardId', this.decoded.Ward_wardId);
  try {
    const result: any = await this.exportService.getExportClothCompany();

    console.log('result', result);

    if (result.rows) {

        this.exportClothHos = result.rows;
        for (const item of this.exportClothHos) {
            item.date = moment(item.exportClothDate).format('DD');
            item.month = moment(item.exportClothDate).format('MMMM');
            item.year = moment(item.exportClothDate).add(543, 'years').format('YYYY');
            item.time = moment(item.exportClothDate).format('HH:mm');
            item.day = item.date + '  ' + item.month + '  ' + item.year;
        }
        console.log('this.exportClothHos', this.exportClothHos);
    }
    this.status =  2;


  } catch (err) {
    console.log(err);
  }
}
}
