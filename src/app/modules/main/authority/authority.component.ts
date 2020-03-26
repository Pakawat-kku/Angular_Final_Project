import { AlertService } from 'src/app/services/alert.service';
import { Component, OnInit } from '@angular/core';
import { AuthorityService } from 'src/app/services/authority.service';
import { Router } from '@angular/router';

import * as jwt_decode from 'jwt-decode';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../../services//Authentication.service';
import { UsersAuthorityService } from 'src/app/services/users-authority.service';

@Component({
  selector: 'app-authority',
  templateUrl: './authority.component.html',
  styleUrls: ['./authority.component.scss']
})
export class AuthorityComponent implements OnInit {
  authorityList: any = [];
  modalEdit = false;
  currentRow: any;
  editRow: any;
  currentUser: any;
  currentUserSubscription: Subscription;
  decoded: any = { status_approve: false };
  authority: any = [];

  constructor(
    private authorityService: AuthorityService,
    private authenticationService: AuthenticationService,
    private users_authorityService: UsersAuthorityService,
    private alertService: AlertService,
    private router: Router,
  ) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(users => {
        this.currentUser = users;
        this.decoded = jwt_decode(users.token);
    });
    this.authenticationService.currentUser.subscribe(x =>
      this.currentUser = x
    );
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
      this.getAuthority();

    }
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

  async onEdit(row) {
    this.currentRow = Object.assign({}, row);
    this.currentRow.mode = 'edit';
    this.modalEdit = true;
  }

  onAdd() {
    this.currentRow = {
      description: ''
    };
    this.currentRow.mode = 'add';
    this.modalEdit = true;
  }

  async onSave() {
    const obj = {
      description: this.currentRow.description
    };
    try {
      if (this.currentRow.mode === 'add') {
        const result: any = await this.authorityService.insertAuthority(obj);
        if (result.rows) {
          this.alertService.success('บันทึกสำเร็จ').then(value => {

            if (value.dismiss) {
              this.getAuthority();
              this.modalEdit = false;
              this.router.navigate(['main/authority']);
            }
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

}
