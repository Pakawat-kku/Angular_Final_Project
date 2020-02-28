import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { UsersService } from 'src/app/services/users.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { AuthorityService } from 'src/app/services/authority.service';
import { UsersAuthorityService } from 'src/app/services/users-authority.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  userList: any[] = [];
  selected: any = [];
  rowSelected: any = {};
  loading = false;
  modalEdit = false;
  currentRow: any;
  editRow: any;
  dateApprove: any;
  type = 'firstname';
  authorityList: any = [];

  constructor(
    private alertService: AlertService,
    private userService: UsersService,
    private router: Router,
    private authorityService: AuthorityService,
    private users_authorityService: UsersAuthorityService
  ) { }

  ngOnInit() {
    moment.locale('th');
    this.getUser();
    this.getAuthority();
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
    // console.log(this.currentRow);
    try {
      const result: any = await this.users_authorityService.getById(this.currentRow.userId);
      if (result.rows) {
        for (let i = 0; i < this.authorityList.length; i++) {
          this.authorityList[i].status = 'false';
          for (let j = 0; j < result.rows.length; j++) {
            if (result.rows[j].Authority_aId === this.authorityList[i].aId) {
              this.authorityList[i].status = 'true';
            }
          }
        }
        // console.log(this.authorityList);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async cancelAutho(Users_userId, Authority_aId) {
    // console.log(Users_userId, Authority_aId);
    try {
      const result: any = await this.users_authorityService.cancelById(Users_userId, Authority_aId);
      if (result.rows) {
        await this.getAuthority();
        await this.onEdit(this.currentRow);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async addAutho(Users_userId, Authority_aId) {
    // console.log(Users_userId, Authority_aId);
    const data = {
      Users_userId: Users_userId,
      Authority_aId: Authority_aId
    };
    try {
      const result: any = await this.users_authorityService.insert(data);
      if (result.rows) {
        await this.getAuthority();
        await this.onEdit(this.currentRow);
      }
    } catch (error) {
      console.log(error);
    }
  }

  onAdd(item) {
    this.currentRow = {
      Users_userId: item.userId,
      username: item.username,
      Authority_aId: '',
      position: item.Position_pId
    };
    // console.log(this.currentRow);
    this.currentRow.mode = 'add';
    this.modalEdit = true;
  }

  async getAuthority() {
    try {
      const result: any = await this.authorityService.getAuthority();
      if (result.rows) {
        this.authorityList = result.rows;
      }
    } catch (err) {
      console.log(err);
    }
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

  async onSave2(item) {
    this.currentRow = {
      Users_userId: item.userId,
      username: item.username,
      position: item.Position_pId
    };
    console.log(this.currentRow);
    const confirm: any = await this.alertService.confirm();
    if (confirm.value === true) {
      this.dateApprove = moment().format('YYYY-MM-DD');
      const result: any = await this.userService.approveUser(this.currentRow.username, this.dateApprove);
      if (result.statusCode === 200) {
        this.alertService.success();
        this.getUser();
        this.modalEdit = false;
        this.selected = [];
        this.router.navigate(['main/user']);
      }
    }
  }

  async onSave() {
    // console.log(this.currentRow, this.selected);
    const confirm: any = await this.alertService.confirm();
    if (confirm.value === true) {
      for (const row of this.selected) {
        const data = {
          Users_userId: this.currentRow.Users_userId,
          Authority_aId: row.aId,
        };
        const result1: any = await this.users_authorityService.insert(data);
      }
      this.dateApprove = moment().format('YYYY-MM-DD');
      const result: any = await this.userService.approveUser(this.currentRow.username, this.dateApprove);
      if (result.statusCode === 200) {
        this.alertService.success();
        this.getUser();
        this.modalEdit = false;
        this.selected = [];
        this.router.navigate(['main/user']);
      }
    }
  }

  async onCancel(username, Users_userId) {
    // console.log(Users_userId);

    try {
      const confirm: any = await this.alertService.confirm();
      if (confirm.value === true) {
        const result2: any = await this.users_authorityService.cancel(Users_userId);
        const result: any = await this.userService.cancelUser(username);
        if (result.statusCode === 200) {
          this.alertService.success();
          await this.getUser();
          this.router.navigate(['main/user']);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }


}

