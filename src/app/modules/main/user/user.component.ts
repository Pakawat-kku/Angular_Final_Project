import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { UsersService } from 'src/app/services/users.service';
import { Router , ActivatedRoute} from '@angular/router';
import * as moment from 'moment';
import { AuthorityService } from 'src/app/services/authority.service';
import { UsersAuthorityService } from 'src/app/services/users-authority.service';
import * as jwt_decode from 'jwt-decode';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../../services//Authentication.service';
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
  currentUser: any;
  currentUserSubscription: Subscription;
  decoded: any ;
  authority: any = [];
  constructor(
    private alertService: AlertService,
    private userService: UsersService,
    private router: Router,
    private authorityService: AuthorityService,
    private users_authorityService: UsersAuthorityService,
    private _Activatedroute: ActivatedRoute,
    private authenticationService: AuthenticationService,

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
    if (this.authority.ten !== 'true') {
      this.alertService.error();
      this.router.navigate(['main/main']);
    } else {
    moment.locale('th');
    this.getUser();
    this.getAuthority();
    }
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

