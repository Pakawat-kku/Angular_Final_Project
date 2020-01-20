import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import * as jwt_decode from 'jwt-decode';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../../services//Authentication.service';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  collapsed = true;
  currentUser: any;
  currentUserSubscription: Subscription;
  decoded: any;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(users => {
      this.currentUser = users;
      console.log('users' , users );
      this.decoded = jwt_decode(users.token);
      console.log('decoded', this.decoded);

  });
     this.authenticationService.currentUser.subscribe(x =>
      this.currentUser = x
    );
  }

  async ngOnInit() {
    // tslint:disable-next-line: no-unused-expression
    await this.decoded;

  }

  onLogout() {
    sessionStorage.clear();
    this.router.navigate(['login']);
  }

}
