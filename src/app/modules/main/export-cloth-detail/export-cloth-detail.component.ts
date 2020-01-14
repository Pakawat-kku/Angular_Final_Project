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

@Component({
  selector: 'app-export-cloth-detail',
  templateUrl: './export-cloth-detail.component.html',
  styleUrls: ['./export-cloth-detail.component.scss']
})
export class ExportClothDetailComponent implements OnInit {
  currentUserSubscription: Subscription;
  currentUser: any;
  decoded: any;
  exportCloth: any;

  constructor(
    private alertService: AlertService,
    private companyService: CompanyService,
    private exportService: ExportService,
    private router: Router,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
  ) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(users => {
      this.currentUser = users;
      console.log('users', users);
      this.decoded = jwt_decode(users.token);
      console.log('decoded', this.decoded);
    });
  }

  ngOnInit() {
    this.getExportCloth();

  }

  async getExportCloth() {
    console.log('this.decoded.Ward_wardId', this.decoded.Ward_wardId);
    try {
      const result: any = await this.exportService.getExportCloth();
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
}
