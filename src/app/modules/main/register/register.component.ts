import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { UsersService } from './../../../services/users.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  constructor(
    private alertService: AlertService,
    private router: Router,
    private usersService: UsersService ,

  ) { }

  ngOnInit() {
  }

  async onInsertUsers(form) {
    console.log('form.value', form.value);
    console.log('index', _.values(form.value));

    this.alertService
      .confirmReq()
      .then(async value => {
        if (value.value === true) {
          console.log('true');

              const obj = {
                userId: 'k',
                username: 'k',
                password: 'k',
                Ward_wardId	: 'k',
                Position_pId: 'k',

              };

              const result = await this.usersService.insertUsers(obj);
              console.log('result', result);


              if (result) {

                this.router.navigate(['main/register']);
              }
        } else if (value.dismiss) {
          console.log('false');
        }
          if (value.dismiss) {

          }
        });
    }
}
