import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { UsersService } from 'src/app/services/users.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
@Component({
  selector: 'app-manage-porter',
  templateUrl: './manage-porter.component.html',
  styleUrls: ['./manage-porter.component.scss']
})
export class ManagePorterComponent implements OnInit {
  userList: any;

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

}
