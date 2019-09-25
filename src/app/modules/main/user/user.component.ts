import { MainService } from './../../../services/main.service';
import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  users: any[] = [];
  rowSelected: any = {};
  loading = false;
  modalEdit = false;

  constructor(
    private mainService: MainService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.getUser();
  }

  async getUser() {
    this.loading = true;
    const result = await this.mainService.getUserTest();
    if (result.results) {
      this.users = result.results;
    }
    this.loading = false;
  }

  onEdit(row) {
    this.rowSelected = row;
    this.modalEdit = true;
  }


}

