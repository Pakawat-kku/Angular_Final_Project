import { Users } from './../register/users';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import * as jwt_decode from 'jwt-decode';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../../services//Authentication.service';
import { UsersAuthorityService } from 'src/app/services/users-authority.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {
  collapsed = true;
  currentUser: Users;
  currentUserSubscription: Subscription;
  decoded: any = { status_approve: false };
  userAuList: any = [];

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private users_authorityService: UsersAuthorityService
  ) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(users => {

      this.currentUser = users;
      this.decoded = jwt_decode(users.token);
      // console.log('decoded', this.decoded);

    });
    this.authenticationService.currentUser.subscribe(x =>
      this.currentUser = x
    );
  }



  async ngOnInit() {
    // tslint:disable-next-line: no-unused-expression
    await this.decoded;
    await this.checkAuthority();
  }

  async checkAuthority() {
    const result: any = await this.users_authorityService.getById(this.decoded.userId);
    console.log(result.rows);
    if (result.rows) {
      this.userAuList = result.rows;
    }
  }

  getRandomColor() {
    const color = Math.floor(0x1000000 * Math.random()).toString(16);
    return '#' + ('000000' + color).slice(-6);
  }

}
