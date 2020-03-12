import { UsersAuthorityService } from 'src/app/services/users-authority.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import * as jwt_decode from 'jwt-decode';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../../services//Authentication.service';
import { UsersService } from '../../../services/users.service';
import { MainService } from 'src/app/services/main.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  collapsed = true;
  currentUser: any;
  currentUserSubscription: Subscription;
  decoded: any = { status_approve: false };
  authority: any = [];


  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private users_authorityService: UsersAuthorityService,
    private mainService: MainService
  ) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(users => {
      if (users) {
        this.currentUser = users;
        this.decoded = jwt_decode(users.token);
      }
    });
    this.authenticationService.currentUser.subscribe(x =>
      this.currentUser = x
    );
  }

  async ngOnInit() {
    this.currentUser = await this.mainService.decodeToken();
    // tslint:disable-next-line: no-unused-expression
    if (!this.currentUser) {
      this.onLogout();
      return;
    }
    await this.decoded;
    this.checkAuthority();
  }

  async checkAuthority() {
    // console.log('this.decoded.usersId', this.decoded.userId);
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
    // console.log('this.authority', this.authority);
  }


  onLogout() {
    sessionStorage.clear();
    this.router.navigate(['login']);
  }

}
