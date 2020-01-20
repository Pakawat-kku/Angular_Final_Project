import { AlertService } from 'src/app/services/alert.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ImportClothService } from 'src/app/services/import-cloth.service';
import * as moment from 'moment';

@Component({
  selector: 'app-overview-import-cloth',
  templateUrl: './overview-import-cloth.component.html',
  styleUrls: ['./overview-import-cloth.component.scss']
})
export class OverviewImportClothComponent implements OnInit {
  importClothList: any = [];

  constructor(private alertService: AlertService,
    private route: Router,
    private importClothService: ImportClothService
  ) { }

  ngOnInit() {
    moment.locale('th');
    this.getList();
  }

  async getList() {
    try {
      const result: any = await this.importClothService.getImportCloth();
      if (result.statusCode === 200) {
        for (const row of result.rows) {
          row.importDate = moment(row.importDate).add(543, 'years').format('DD MMMM YYYY');
        }
        this.importClothList = result.rows;
      }
    } catch (error) {
      console.log(error);
    }
  }

}
