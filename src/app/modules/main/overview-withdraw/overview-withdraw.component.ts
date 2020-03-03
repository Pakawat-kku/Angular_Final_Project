import { AlertService } from './../../../services/alert.service';
import { WithdrawService } from './../../../services/withdraw.service';
import { RequisitionService } from './../../../services/requisition.service';
import { Component, OnInit } from '@angular/core';
import * as jwt_decode from 'jwt-decode';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/services/Authentication.service';
import { Router } from '@angular/router';
import { WardService } from 'src/app/services/ward.service';

@Component({
  selector: 'app-overview-withdraw',
  templateUrl: './overview-withdraw.component.html',
  styleUrls: ['./overview-withdraw.component.scss']
})
export class OverviewWithdrawComponent implements OnInit {
  requisitionList: any[] = [{}];
  withdrawCode: any;
  modalShow = false;
  reqDetailList: any[] = [{}];
  selected: any = [];
  collapsed = true;
  currentUser: any;
  currentUserSubscription: Subscription;
  decoded: any;
  wardCheck = false;
  rows: any = [];
  time: any;
  round = 0;
  detailList: any = [];
  reqList: any = [];
  clothRemain = '';
  uncomplete = 0;
  over = 0;
  clothOver = '';
  remain: any;
  withdrawList: any = [];


  constructor(
    private requisitionService: RequisitionService,
    private authenticationService: AuthenticationService,
    private withdrawService: WithdrawService,
    private alertService: AlertService,
    private wardService: WardService,
    private router: Router
  ) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(users => {
      this.currentUser = users;
      this.decoded = jwt_decode(users.token);
    });
  }

  async ngOnInit() {
    await moment.locale('th');
    await this.getRequisition();
    this.time = moment().add(543, 'years').format('DD MMMM YYYY');
  }

  async getRequisition() {
    this.requisitionList = [];
    this.reqDetailList = [];
    try {
      // ดึงวอร์ดที่รับผิดชอบ
      const result: any = await this.wardService.getPorter(this.decoded.userId);
      if (result.rows) {
        // วนตามวอร์ดที่รับผิดชอบ , row คือวอร์ด
        for (const row of result.rows) {
          // ผ้าเช็ดมือ
          if (row.wardName === 'ผ้าเช็ดมือ') {
            this.wardCheck = true;
            const result3: any = await this.requisitionService.getNapkin();
            if (result3.rows.length !== 0) {
              if (result3.rows.length > 1) {
                for (const item of result3.rows) {
                  this.requisitionList.push({
                    requisitionCode: item.requisitionCode,
                    reqTime: moment(item.reqDate).format('HH:mm'),
                    reqDate: moment(item.reqDate).add(543, 'years').format('DD MMMM YYYY'),
                    wardName: item.wardName,
                    wardId: item.wardId,
                    description: '',
                    round: 0
                  });
                  this.reqDetailList.push({
                    Requisition_requisitionCode: item.requisitionCode,
                    clothId: item.clothId,
                    clothName: item.clothName,
                    amountClothReal: item.amountClothReal,
                    totalRound: 0
                  });
                  // console.log(this.reqDetailList);
                }
              } else {
                this.requisitionList.push({
                  requisitionCode: result3.rows[0].requisitionCode,
                  reqTime: moment(result3.rows[0].reqDate).format('HH:mm'),
                  reqDate: moment(result3.rows[0].reqDate).add(543, 'years').format('DD MMMM YYYY'),
                  wardName: result3.rows[0].wardName,
                  wardId: result3.rows[0].wardId,
                  description: '',
                  clothId: result3.rows[0].clothId,
                  clothName: result3.rows[0].clothName,
                  amountClothReal: result3.rows[0].amountClothReal,
                  round: 0
                });
              }
            }
            // ไม่ใช่ผ้าเช็ดมือ
          } else {
            // getเอาreqตามวอร์ด
            const result2: any = await this.requisitionService.getByWard(row.wardId);
            if (result2.rows.length !== 0) {
              if (result2.rows.length > 1) {
                for (const item of result2.rows) {
                  const result4: any = await this.withdrawService.getByReq(item.requisitionCode);
                  if (result4.rows.length === 0) {
                    // console.log('null 1');
                    const result6: any = await this.requisitionService.showReqWaitDetail(item.requisitionCode);
                    if (result6.rows) {
                      // tslint:disable-next-line: no-shadowed-variable
                      for (const row of result6.rows) {
                        if (row.clothName !== 'ผ้าเช็ดมือ') {
                          row.amountClothWithdraw = 0;
                          row.totalRound = 1;
                          // row.remains = row.amountClothReal;
                          // row.export = 0;
                          this.reqDetailList.push(row);
                        }
                      }
                      // tslint:disable-next-line: no-shadowed-variable
                      for (const item of this.reqDetailList) {
                        item.remains = item.amountClothReal;
                        item.export = 0;
                      }
                      // console.log(this.reqDetailList);
                    }
                    if (this.reqDetailList.length !== 0) {
                      this.requisitionList.push({
                        requisitionCode: item.requisitionCode,
                        reqTime: moment(item.reqDate).format('HH:mm'),
                        reqDate: moment(item.reqDate).add(543, 'years').format('DD MMMM YYYY'),
                        wardName: item.wardName,
                        wardId: item.wardId,
                        description: '',
                        round: 0
                      });
                    }
                  }
                }
                // มีแค่วอร์ดเดียว
              } else {
                const result5: any = await this.withdrawService.getByReq(result2.rows[0].requisitionCode);
                if (result5.rows.length === 0) {
                  const result7: any = await this.requisitionService.showReqWaitDetail(result2.rows[0].requisitionCode);
                  if (result7.rows) {
                    // tslint:disable-next-line: no-shadowed-variable
                    for (const row of result7.rows) {
                      if (row.clothName !== 'ผ้าเช็ดมือ') {
                        row.amountClothWithdraw = 0;
                        row.totalRound = 1;
                        // row.export = 0;
                        // row.remains = row.amountClothReal;
                        await this.reqDetailList.push(row);
                        console.log(this.reqDetailList);
                      }
                    }
                    for (const items of this.reqDetailList) {
                      console.log(items.amountClothReal , items.id);
                      items.remains = items.amountClothReal;
                      items.export = 0;
                    }
                  }
                  // console.log(this.reqDetailList, result2.rows[0].requisitionCode);
                  if (this.reqDetailList.length !== 0) {
                    this.requisitionList.push({
                      requisitionCode: result2.rows[0].requisitionCode,
                      reqTime: moment(result2.rows[0].reqDate).format('HH:mm'),
                      reqDate: moment(result2.rows[0].reqDate).add(543, 'years').format('DD MMMM YYYY'),
                      wardName: result2.rows[0].wardName,
                      wardId: result2.rows[0].wardId,
                      description: '',
                      round: 0
                    });
                  }
                }
              }
              // มีใบเบิกแล้ว
            } else {
              const result9: any = await this.requisitionService.getByWardStatusWD1(row.wardId);
              if (result9.rows) {
                if (result9.rows.length !== 0) {
                  if (result9.rows.length > 1) {
                    for (const item of result9.rows) {
                      const result4: any = await this.withdrawService.getByReq(item.requisitionCode);
                      if (result4.rows.length !== 0) {
                        console.log('test');
                      } else {
                        console.log(result4.rows);
                      }
                    }
                  } else {
                    const result4: any = await this.withdrawService.getByReq(result9.rows[0].requisitionCode);
                    if (result4.rows.length !== 0) {
                      const results2: any = await this.requisitionService.showReqWaitDetail(result9.rows[0].requisitionCode);
                      const results1: any = await this.withdrawService
                        .getDetailRoundByCode(result4.rows[0].withdrawCode, result4.rows[0].totalRound);
                      if (results1.rows.length > 1) {
                        for (const items of results1.rows) {
                          if (items.clothName !== 'ผ้าเช็ดมือ') {
                            this.withdrawList.push(items);
                          }
                        }
                        for (const rows of results2.rows) {
                          if (rows.clothName !== 'ผ้าเช็ดมือ') {
                            rows.Requisition_requisitionCode = result9.rows[0].requisitionCode;
                            this.reqDetailList.push(rows);
                          }
                        }
                        for (let i = 0; i < this.reqDetailList.length; i++) {
                          for (let j = 0; j < this.withdrawList.length; j++) {
                            if (this.reqDetailList[i].Cloth_clothId === this.withdrawList[j].Cloth_clothId) {
                              this.reqDetailList[i].remains = this.withdrawList[j].WithdrawDetail_remain;
                              this.reqDetailList[i].export =
                                this.reqDetailList[i].amountClothReal - this.withdrawList[j].WithdrawDetail_remain;
                            }
                          }
                        }
                        if (this.reqDetailList.length !== 0) {
                          this.requisitionList.push({
                            requisitionCode: result9.rows[0].requisitionCode,
                            reqTime: moment(result9.rows[0].reqDate).format('HH:mm'),
                            reqDate: moment(result9.rows[0].reqDate).add(543, 'years').format('DD MMMM YYYY'),
                            wardName: result9.rows[0].wardName,
                            wardId: result9.rows[0].wardId,
                            description: '',
                            round: results1.rows[0].round
                          });
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
    // console.log(this.reqDetailList);
  }

  async onShow(code) {
    this.modalShow = true;
    // console.log(code);
    this.detailList = [];
    this.reqList = [];
    this.round = 0;
    for (const row of this.reqDetailList) {
      if (row.Requisition_requisitionCode === code) {
        this.detailList.push(row);
      }
    }
    for (const row of this.requisitionList) {
      if (row.requisitionCode === code) {
        this.reqList.push(row);
      }
    }
    this.round = this.reqList[0].round + 1;
    console.log(this.reqList, this.detailList);
  }

  async onSave() {
    this.clothRemain = '';
    this.clothOver = '';
    this.uncomplete = 0;
    this.over = 0;
    this.remain = false;
    let num = 0;
    let i = 0;

    const decision: any = await this.alertService.confirm('ยืนยันการทำรายการ ?');
    if (decision.value === true) {
      try {
        const data: any = [];
        const wd: any = [];
        // กรณียังไม่มีใบเบิก
        if (this.round === 1) {
          for (const row of this.detailList) {
            row.remain = 0;
            num++;
            if (row.amountClothWithdraw < 0) {
              this.alertService.error('จำนวน ' + ' ' + row.clothName + 'ผิดพลาด');
            } else {
              row.remain = row.remains - row.amountClothWithdraw;
              console.log(row.remain, '=', row.remains, '-', row.amountClothWithdraw);
              // ค้างส่ง
              if (row.remain > 0) {
                row.statusRemain = 1;
                if (this.uncomplete === 0) {
                  this.clothRemain = this.clothRemain + row.clothName;
                } else {
                  this.clothRemain = this.clothRemain + ', ' + row.clothName;
                }
                this.uncomplete += 1;
                // ส่งครบ
              } else if (row.remain === 0) {
                row.statusRemain = 2;
                this.remain = true;
                // ส่งเกิน
              } else {
                if (this.over === 0) {
                  this.clothOver = this.clothOver + row.clothName;
                } else {
                  this.clothOver = this.clothOver + ', ' + row.clothName;
                }
                this.over += 1;
              }
            }
            i++;
          }
          if (this.over > 0) {
            const decision2: any = await this.alertService.error('จำนวน' + this.clothOver + 'เกินจำนวนที่เบิก');
          } else if (this.uncomplete > 0) {
            const decision2: any = await this.alertService.confirm('จำนวน' + this.clothRemain + 'ไม่ครบตามจำนวนที่เบิก');
            if (decision2.value) {
              this.remain = true;
            }
          }
          if (this.over === 0 && this.remain === true) {
            for (const req of this.reqList) {
              this.withdrawCode = '';
              this.withdrawCode = this.decoded.userId + moment().format('YYYYMMDDHHmmss');
              await data.push({
                withdrawCode: this.withdrawCode,
                withdrawDate: moment().format('YYYY-MM-DD HH:mm:ss'),
                withdraw_status: '0',
                Ward_wardId: req.wardId,
                Requisition_requisitionCode: req.requisitionCode,
                totalRound: 1
              });
              for (const row of this.detailList) {
                await wd.push({
                  Withdraw_withdrawCode: this.withdrawCode,
                  Cloth_clothId: row.clothId,
                  amountCloth: row.amountClothWithdraw,
                  description: req.description,
                  round: 1,
                  Users_userId: this.decoded.userId,
                  WithdrawDetail_remain: row.remain,
                  WithdrawDetail_status_remain: row.statusRemain
                });
              }
              await this.requisitionService.statusWithdraw(req.requisitionCode);
            }
            const result: any = await this.withdrawService.saveWithdraw(data);
            const result8: any = await this.withdrawService.saveWithdrawDetail(wd);
            if (result.rows && result8.rows) {
              await this.alertService.success();
              this.modalShow = false;
              await this.getRequisition();
              let val = 0;
              for (const row of this.detailList) {
                if (row.statusRemain === 2) {
                  // tslint:disable-next-line: max-line-length
                  const result1: any = await this.requisitionService.statusWithdrawSuccess(this.reqList.Requisition_requisitionCode);
                  const result6: any = await this.requisitionService.statusDetailWithdrawSuccess(row.id);
                  val++;
                  // console.log(val);
                  if (val === this.detailList.length) {
                    const result2: any = await this.withdrawService.statusWithdraw(this.withdrawCode);
                  }
                }
              }
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

}
