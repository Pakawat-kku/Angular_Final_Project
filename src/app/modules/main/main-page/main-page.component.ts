import { Users } from './../register/users';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import * as jwt_decode from 'jwt-decode';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../../services//Authentication.service';

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

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(users => {

        this.currentUser = users;
        // console.log('users', users);
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

  }

}
