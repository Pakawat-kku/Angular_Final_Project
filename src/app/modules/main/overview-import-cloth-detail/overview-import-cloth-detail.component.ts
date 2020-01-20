import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { ImportClothService } from 'src/app/services/import-cloth.service';

@Component({
  selector: 'app-overview-import-cloth-detail',
  templateUrl: './overview-import-cloth-detail.component.html',
  styleUrls: ['./overview-import-cloth-detail.component.scss']
})
export class OverviewImportClothDetailComponent implements OnInit {
  importCode: any;
  importList: any = [];
  importDetailList: any = [];

  constructor(private _Activatedroute: ActivatedRoute,
    private router: Router,
    private importService: ImportClothService
  ) { }

  ngOnInit() {
    moment.locale('th');
    this.importCode = this._Activatedroute.snapshot.paramMap.get('importCode');
    this.getImport();
  }

  async getImport() {
    try {
      const result: any = await this.importService.getImportClothWhere(this.importCode);
      if (result.rows) {
        result.rows[0].importDate = moment(result.rows[0].importDate).add(543, 'years').format('DD MMMM YYYY');
        this.importList = result.rows[0];
        console.log(this.importList);
      }
      const detail: any = await this.importService.getImportClothBy(this.importCode);
      if (detail.rows) {
        this.importDetailList = detail.rows;
        console.log(this.importDetailList);

      }
    } catch (error) {
      console.log(error);
    }
  }

}
