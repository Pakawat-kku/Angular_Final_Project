import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { UsersService } from 'src/app/services/users.service';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  userList: any[] = [];
  rowSelected: any = {};
  loading = false;
  modalEdit = false;
  currentRow: any;
  editRow: any;
  dateApprove: any;

  constructor(
    private alertService: AlertService,
    private userService: UsersService,
    private router: Router
  ) { }

  ngOnInit() {
    moment.locale('th');
    this.getUser();
  }

  async getUser() {
    try {
      const result: any = await this.userService.getUser();
      if (result.rows) {
        this.userList = result.rows;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async onEdit(row) {
    this.currentRow = Object.assign({}, row);
    this.currentRow.mode = 'edit';
    this.modalEdit = true;
  }

  async getNotApprove() {
    try {
      const result: any = await this.userService.searchNotApprove();
      if (result.rows) {
        this.userList = result.rows;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getApprove() {
    try {
      const result: any = await this.userService.searchApprove();
      if (result.rows) {
        this.userList = result.rows;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async letSearch(search, type) {
    // console.log(search, type);
    try {
      if ((search !== '' || search !== undefined) && (type !== '' || type !== undefined)) {
        if (type === 'firstname') {
          const result: any = await this.userService.searchByFirstname(search);
          if (result.rows) {
            this.userList = result.rows;
          }
        } else if (type === 'lastname') {
          const result: any = await this.userService.searchByLastname(search);
          if (result.rows) {
            this.userList = result.rows;
          }
        } else if (type === 'username') {
          const result: any = await this.userService.searchByUsername(search);
          if (result.rows) {
            this.userList = result.rows;
          }
        } else {
          this.alertService.error('กรุณาระบุประเภทการค้นหา');
        }
      }
    } catch (error) {
      console.log(error);
    }

  }

  async onSave() {
    const obj = {
      firstname: this.currentRow.firstname,
      lastname: this.currentRow.lastname
    };
    console.log(obj);
  }

  async onApprove(username) {
    this.dateApprove = moment().format('YYYY-MM-DD');
    try {
      const confirm: any = await this.alertService.confirm();
      if (confirm.value === true) {
        const result: any = await this.userService.approveUser(username, this.dateApprove);
        if (result.statusCode === 200) {
          this.alertService.success();
          this.getUser();
          this.router.navigate(['main/user']);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async onCancel(username) {
    try {
      const confirm: any = await this.alertService.confirm();
      if (confirm.value === true) {
        const result: any = await this.userService.cancelUser(username);
        if (result.statusCode === 200) {
          this.alertService.success();
          this.getUser();
          this.router.navigate(['main/user']);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }


}

