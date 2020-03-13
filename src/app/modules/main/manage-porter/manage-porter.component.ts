import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { UsersService } from 'src/app/services/users.service';
import { WardService } from 'src/app/services/ward.service';
import { UsersAuthorityService } from 'src/app/services/users-authority.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
import * as _ from 'lodash';
import { ifStmt } from '@angular/compiler/src/output/output_ast';

import * as jwt_decode from 'jwt-decode';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../../services//Authentication.service';
@Component({
  selector: 'app-manage-porter',
  templateUrl: './manage-porter.component.html',
  styleUrls: ['./manage-porter.component.scss']
})
export class ManagePorterComponent implements OnInit {
  userList: any;
  porter: any[] = [];
  managePorter = false;
  currentRow: any;
  selected: any = [];
  allWard: any;
  tableTwo: any;
  sum = 0;
  summer: any;
  diseble = false;
  blank1 = false;
  blank2 = false;
  currentUser: any;
  currentUserSubscription: Subscription;
  decoded: any = { status_approve: false };
  authority: any = [];

  constructor(
    private alertService: AlertService,
    private userService: UsersService,
    private wardService: WardService,
    private usersAuthorityService: UsersAuthorityService,
    private router: Router,
    private authenticationService: AuthenticationService,
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
    if (this.authority.seven !== 'true') {
      this.alertService.error();
      this.router.navigate(['main/main']);
    } else {
    moment.locale('th');
    await this.getUser();
    await this.getTableTwo();
    }
  }

  async getUser() {
    try {
      const result: any = await this.userService.getUser();
      const result1: any = await this.usersAuthorityService.get();

      if (result.rows) {
        this.userList = result.rows;
      }

      for (const item of this.userList) {
        for (const items of result1.rows) {
          if (item.userId === items.Users_userId) {
            if (items.Authority_aId === 1) {
              // console.log(item.firstname + 'คนมีสิทธิ');
              this.porter.push({
                userId: item.userId,
                firstname: item.firstname,
                lastname: item.lastname,
              });
            }
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getTableTwo() {
    const result2: any = await this.wardService.getAllWard();
    this.tableTwo = result2.rows;

    for (const item of this.tableTwo) {
      const result3: any = await this.userService.getUserId(item.Users_userId);

      if (result3.rows.length === 0) {
        item.name = 'ว่าง';
      } else {
        item.name = result3.rows[0].firstname + ' ' + result3.rows[0].lastname;
      }
    }

  }


  async showManagePorter(row) {
    this.managePorter = true;
    this.currentRow = Object.assign({}, row);
    await this.getSelected(this.currentRow);
  }

  async getSelected(row) {
    try {

      const result1: any = await this.wardService.getWardBlank(row.userId);
      this.sum = 0;
      this.allWard = result1.rows;
      for (const item of result1.rows) {
        const result2: any = await this.userService.getUserId(item.Users_userId);
        if (result2.rows.length === 0) {
          item.name = 'ว่าง';
        } else {
          item.name = result2.rows[0].firstname + ' ' + result2.rows[0].lastname;
          this.sum = this.sum + 1;
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async manageWardPorter() {
    try {
      for (const item of this.selected) {

        const result: any = await this.wardService.getWardById(item.wardId);

       if (item.Users_userId === null) {
          const obj = {
            wardId: item.wardId,
            Users_userId: this.currentRow.userId,
          };

          const result2 = await this.wardService.updateWard(obj);
        }

      }
      this.managePorter = false;

      this.getTableTwo();
      this.alertService.success('จัดการสำเร็จ');
      this.router.navigate(['main/manage-porter']);

    } catch (error) {
      console.log(error);
    }
  }

  async cancelManageWardPorter() {
    try {
      for (const item of this.selected) {

        const obj = {
          wardId: item.wardId,
          Users_userId: null,
        };
        const result1 = await this.wardService.updateWard(obj);

      }
      this.managePorter = false;
      this.alertService.success('ยกเลิกรายการที่เลือกเรียบร้อย');
      this.getTableTwo();
      this.router.navigate(['main/manage-porter']);
    } catch (error) {
      console.log(error);
    }
  }

  check() {
    console.log('this.selected' , this.selected);
    let i = 0;
    let j = 0;
    for (const item of this.selected) {
        if (item.Users_userId === null) {
          i ++;
        } else {
          j ++;
        }
    }
    if (i > 0 ) {
      this.blank1 = true ;
    } else {
      this.blank1 = false ;
    }

    if (j > 0 ) {
      this.blank2 = true ;
    } else {
      this.blank2 = false ;
    }

    console.log('i', i);
    console.log('j', j);

    if (this.selected.length === 0 ) {
      this.diseble = false;
      console.log('this.diseble[]', this.diseble);

    } else {
      this.diseble = true;
      console.log('this.diseble![]', this.diseble);
    }
    console.log('this.blank1', this.blank1);
    console.log('this.blank2', this.blank2);
  }
}

