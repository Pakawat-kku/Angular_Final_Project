import { AlertService } from 'src/app/services/alert.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ImportClothService } from 'src/app/services/import-cloth.service';
import * as moment from 'moment';

import * as jwt_decode from 'jwt-decode';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../../services//Authentication.service';
import { UsersAuthorityService } from 'src/app/services/users-authority.service';
@Component({
  selector: 'app-overview-import-cloth',
  templateUrl: './overview-import-cloth.component.html',
  styleUrls: ['./overview-import-cloth.component.scss']
})
export class OverviewImportClothComponent implements OnInit {
  importClothList: any = [];
  currentUser: any;
  currentUserSubscription: Subscription;
  decoded: any = { status_approve: false };
  authority: any = [];
  
  constructor(
    private alertService: AlertService,
    private route: Router,
    private importClothService: ImportClothService,
    private authenticationService: AuthenticationService,
    private users_authorityService: UsersAuthorityService,
    private router: Router,
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
    if (this.authority.eigth !== 'true') {
      this.alertService.error();
      this.router.navigate(['main/main']);
    } else {
    moment.locale('th');
    this.getList();
    }
  }

  async getList() {
    try {
      const result: any = await this.importClothService.getImportCloth();
      if (result.statusCode === 200) {
        for (const row of result.rows) {
          row.importDate = moment(row.importDate).add(543, 'years').format('DD MMMM YYYY');
        }
        this.importClothList = result.rows;
      }
    } catch (error) {
      console.log(error);
    }
  }

}
