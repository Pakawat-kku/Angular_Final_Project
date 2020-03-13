import { Component, OnInit } from '@angular/core';
import * as jwt_decode from 'jwt-decode';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../../services//Authentication.service';
import { UsersAuthorityService } from 'src/app/services/users-authority.service';
@Component({
  selector: 'app-weight-in-company',
  templateUrl: './weight-in-company.component.html',
  styleUrls: ['./weight-in-company.component.scss']
})
export class WeightInCompanyComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
