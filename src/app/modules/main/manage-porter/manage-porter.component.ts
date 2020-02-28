import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { UsersService } from 'src/app/services/users.service';
import { WardService } from 'src/app/services/ward.service';
import { UsersAuthorityService } from 'src/app/services/users-authority.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
import * as _ from 'lodash';

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

  constructor(
    private alertService: AlertService,
    private userService: UsersService,
    private wardService: WardService,
    private usersAuthorityService: UsersAuthorityService,
    private router: Router
  ) { }

  ngOnInit() {
    moment.locale('th');
    this.getUser();
    // this.getSelected();
  }

  async getUser() {
    try {
      const result: any = await this.userService.getUser();
      const result1: any = await this.usersAuthorityService.get();
      console.log(result.rows);

      if (result.rows) {
        this.userList = result.rows;
      }
      for (const item of this.userList) {
        for (const items of result1.rows) {
          if (item.userId === items.Users_userId) {
            if (items.Authority_aId === 1) {
              console.log(item.firstname + 'คนมีสิทธิ');
              this.porter.push({
                userId: item.userId,
                firstname: item.firstname,
                lastname: item.lastname,
              });
            }
          }
        }
      }

      console.log('this.porter', this.porter);

    } catch (error) {
      console.log(error);
    }
  }

  async showManagePorter(row) {
    this.managePorter = true;
    this.currentRow = Object.assign({}, row);
    console.log('this.currentRow', this.currentRow);
    this.getSelected(this.currentRow);
  }

  async getSelected(row) {
    try {
      console.log('this.currentRow', row);
      // const result: any = await this.wardService.getWardBlank(row.userId);
      // const result: any = await this.wardService.getAllWard();
      const result1: any = await this.wardService.getWardBlank(row.userId);

       this.allWard = result1.rows;
      for (const item of result1.rows) {
        const result2: any = await this.userService.getUserId(item.Users_userId);
        if (result2.rows.length === 0) {
          item.name = 'ว่าง';
        } else {
          item.name = result2.rows[0].firstname + ' ' + result2.rows[0].lastname;
        }
      }

      console.log('this.allWard', this.allWard);

    } catch (error) {
      console.log(error);
    }
  }

  async manageWardPorter() {
    console.log('selected', this.selected);
    console.log('currentRow', this.currentRow);

    for (const item of this.selected) {
      console.log('item.wardId' , item.wardId);

      const result: any = await this.wardService.getWardById(item.wardId);
      console.log('result.rows' , result.rows);
      console.log('item.Users_userId' , item.Users_userId);

      if (item.Users_userId === result.rows[0].Users_userId) {
        const obj = {
              wardId: item.wardId,
              Users_userId: null,
            };
            console.log('เอาออก');

         const result1 = await  this.wardService.updateWard(obj);
      } if (item.Users_userId === null) {
        const obj = {
              wardId: item.wardId,
              Users_userId: this.currentRow.userId,
            };
            console.log('เพิ่ม');

            const result2 = await  this.wardService.updateWard(obj);

      }
     }
  }
}
