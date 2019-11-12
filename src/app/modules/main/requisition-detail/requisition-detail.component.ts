import { Component, OnInit  , OnDestroy } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { NgForm, FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { Users } from '../register/users';
import { AuthenticationService } from '../../../services//Authentication.service';
import { UsersService } from '../../../services/users.service';
import * as jwt_decode from 'jwt-decode';
import { RequisitionService } from './../../../services/requisition.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-requisition-detail',
  templateUrl: './requisition-detail.component.html',
  styleUrls: ['./requisition-detail.component.scss']
})
export class RequisitionDetailComponent implements OnInit , OnDestroy {
  currentUser: Users;
  currentUserSubscription: Subscription;
  decoded: any;
  showReqlist: any;

  constructor(
    private alertService: AlertService,
    private requisitionService: RequisitionService,
    private router: Router,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private userService: UsersService

  ) {
      this.currentUserSubscription = this.authenticationService.currentUser.subscribe(users => {
      this.currentUser = users;
      console.log('users' , users );
      this.decoded = jwt_decode(users.token);
      console.log('decoded', this.decoded);

  });
  }

  ngOnInit() {
    this.getReqWait();
  }

  async getReqWait() {

    try {
      console.log('this.decoded.userId', this.decoded.Ward_wardId);

      const result: any = await this.requisitionService.showReqWait(this.decoded.Ward_wardId);
      console.log('result', result);

      if (result.rows) {
        console.log(result.rows);
        this.showReqlist = result.rows;
      }
    } catch (err) {
      console.log(err);
    }
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.currentUserSubscription.unsubscribe();
}
}
