import { Component, OnInit } from '@angular/core';
import { AlertService } from './../../../services/alert.service';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent implements OnInit {

  constructor(
    private alertService: AlertService,
    private _Activatedroute: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.alertService.error('ไม่มีหน้านี้ในระบบ');
    this.router.navigate(['main/main']);
  }

}
