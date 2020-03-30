import { AlertService } from './../../../services/alert.service';
import { PositionService } from './../../../services/position.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WardService } from 'src/app/services/ward.service';
import { UsersService } from 'src/app/services/users.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Items } from '@clr/angular/data/datagrid/providers/items';


@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.scss']
})
export class SignupPageComponent implements OnInit {
  positionList: any[] = [];
  wardList: any = [];
  usernameList: any = [];
  checkUsername: any;
  checkWard: any = true;
  ward = ['opd', 'or'];
  positionId = 1;
  public items: Array<string>  = [
    'op', 'kl'
  ];
  wardId = 15;

  constructor(
    private positionService: PositionService,
    private wardService: WardService,
    private userService: UsersService,
    private alertService: AlertService,
    private router: Router,

  ) {
  }

  async ngOnInit() {
    this.getPositionWard();
    // console.log('date ',moment().format('YYYY-MM-DD'));
  }
  // private value: any = {};

  // public selected(value: any): void {
  //   console.log('Selected value is: ', value);
  // }

  // public removed(value: any): void {
  //   console.log('Removed value is: ', value);
  // }

  // public typed(value: any): void {
  //   console.log('New search input: ', value);
  // }

  // public refreshValue(value: any): void {
  //   for (let row of this.wardList) {
  //     this.value = {
  //       text: row.wardName,
  //       id: row.wardId
  //     };
  //   }
  //   this.value = value;
  //   console.log('value', value);
  // }

  async getPositionWard() {
    const result: any = await this.positionService.getPosition();
    const re: any = await this.wardService.getAllWard();
    if (result.rows && re.rows) {
      this.positionList = result.rows;
      this.wardList = re.rows;
      this.positionList = _.dropRight(this.positionList);
      for (let row of this.wardList) {
        // this.items = {
        //   text: row.wardName,
        //   id: row.wardId
        // };
      }
      for(let row of this.wardList) {
        await this.ward.push(row.wardName);
      }
      // console.log('this.ward' , this.ward);

      // console.log(this.items);
    }
  }

  async onClickSubmit(formData) {
    console.log('formData', formData);
    if (formData.username === undefined || formData.username === '') {
      this.alertService.error('กรุณากรอก username');
      this.checkWard = false;
    } else if (formData.password === undefined || formData.password === '') {
      this.alertService.error('กรุณากรอกรหัสผ่าน');
      this.checkWard = false;
    } else if (formData.conPassword === undefined || formData.conPassword === '') {
      this.alertService.error('กรุณากรอกรหัสผ่านอีกครั้ง');
      this.checkWard = false;
    } else if (formData.password !== formData.conPassword) {
      this.checkWard = false;
      this.alertService.error('รหัสผ่านไม่ตรงกัน');
    } else if (formData.firstname === undefined || formData.firstname === '') {
      this.checkWard = false;
      this.alertService.error('กรุณากรอกชื่อ');
    } else if (formData.lastname === undefined || formData.lastname === '') {
      this.checkWard = false;
      this.alertService.error('กรุณากรอกนามสกุล');
    } else if (formData.positionId === undefined || formData.positionId === '') {
      this.checkWard = false;
      this.alertService.error('กรุณาเลือกตำแหน่ง');
    } else if (formData.positionId === '2') {
      if (formData.wardId === undefined || formData.wardId === '') {
        this.alertService.error('กรุณาเลือกวอร์ด');
        this.checkWard = false;
      } else {
        this.checkWard = true;
      }
    } if (this.checkWard === true) {
      const result: any = await this.userService.getUser();
      if (result.rows) {
        this.checkUsername = _.findIndex(result.rows, ['username', formData.username]);
      }
      if (this.checkUsername < 0 && this.checkWard === true) {
        const data = {
          username: formData.username,
          password: formData.password,
          firstname: formData.firstname,
          lastname: formData.lastname,
          Position_pId: formData.positionId,
          Ward_wardId: formData.wardId,
          dateSignup: moment().format('YYYY-MM-DD')
        };
        const ins: any = await this.userService.insertUsers(data);
        if (ins.statusCode === 200) {
          this.alertService.success();
          this.router.navigate(['/login']);
        }
      } else {
        this.alertService.error('มีผู้ใช้ username นี้แล้ว กรุณาตั้งใหม่');
      }
    }
  }

}
