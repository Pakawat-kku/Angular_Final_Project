import { RequisitionService } from './../../../services/requisition.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-overview-withdraw-detail',
  templateUrl: './overview-withdraw-detail.component.html',
  styleUrls: ['./overview-withdraw-detail.component.scss']
})
export class OverviewWithdrawDetailComponent implements OnInit {
  @Input() list: any;
  reqDetailList: any[];


  constructor(
    private requisitionService: RequisitionService
  ) { }

  ngOnInit() {
    console.log(this.list);
    this.getReqDetail();
  }

  async getReqDetail() {
    const result: any = await this.requisitionService.showReqDetailApprove(this.list);
    if (result.rows) {
      this.reqDetailList = result.rows;
      console.log('deatil list', this.reqDetailList);
    }
  }
}
