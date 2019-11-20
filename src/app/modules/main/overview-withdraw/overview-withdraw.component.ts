import { RequisitionService } from './../../../services/requisition.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-overview-withdraw',
  templateUrl: './overview-withdraw.component.html',
  styleUrls: ['./overview-withdraw.component.scss']
})
export class OverviewWithdrawComponent implements OnInit {
requisitionList: any[];
  constructor(
    private requisitionService: RequisitionService
  ) { }

  ngOnInit() {
    this.getRequisition();
  }

  async getRequisition() {
    try {
      const result: any = await this.requisitionService.showReqApprove();
      if (result.rows) {
        this.requisitionList = result.rows;
        console.log(result);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
