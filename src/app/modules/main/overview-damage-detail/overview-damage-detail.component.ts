import { AlertService } from './../../../services/alert.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DamageService } from './../../../services/damage.service';

import * as jwt_decode from 'jwt-decode';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../../services//Authentication.service';
import { UsersAuthorityService } from 'src/app/services/users-authority.service';
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
  currentUser: any;
  currentUserSubscription: Subscription;
  decoded: any = { status_approve: false };
  authority: any = [];

  constructor(
    private _Activatedroute: ActivatedRoute,
    private damageService: DamageService,
    private alertService: AlertService,
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
    if (this.authority.nine !== 'true') {
      this.alertService.error();
      this.router.navigate(['main/main']);
    } else {
    moment.locale('th');
    this.clothId = this._Activatedroute.snapshot.paramMap.get('clothId');
    this.getList();
    }
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
