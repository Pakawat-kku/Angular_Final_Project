import { AlertService } from './../../../services/alert.service';
import { StockService } from './../../../services/stock.service';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Router , ActivatedRoute} from '@angular/router';
import { RepairService } from 'src/app/services/repair.service';
import { AvailableService } from 'src/app/services/available.service';

import * as jwt_decode from 'jwt-decode';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../../services//Authentication.service';
import { UsersAuthorityService } from 'src/app/services/users-authority.service';
@Component({
  selector: 'app-repair',
  templateUrl: './repair.component.html',
  styleUrls: ['./repair.component.scss']
})
export class RepairComponent implements OnInit {
  repairList: any = [];
  modalEdit = false;
  currentRow: any = [];
  editRow: any;
  clothList: any = [];
  addRepair: any[] = [{
    clothId: '1',
    amount: null
  }];
  dummy: any = [];
  currentUser: any;
  currentUserSubscription: Subscription;
  decoded: any ;
  authority: any = [];

  constructor(
    private router: Router,
    private alertService: AlertService,
    private stockService: StockService,
    private repairService: RepairService,
    private availableService: AvailableService,
    private _Activatedroute: ActivatedRoute,
    private users_authorityService: UsersAuthorityService,
    private authenticationService: AuthenticationService,
  ) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(users => {
      this.currentUser = users;
      this.decoded = jwt_decode(users.token);
  });
  }

  async ngOnInit() {
    const result: any = await this.users_authorityService.getById(this.decoded.userId);
    // console.log('result.rows' , result);
    for (const item of result.rows) {
      if (item.aId === 1) {
        this.authority.one = 'true';
      } if (item.aId === 2) {
        this.authority.two = 'true';
      } if (item.aId === 3) {
        this.authority.three = 'true';
      } if (item.aId === 4) {
        this.authority.four = 'true';
      } if (item.aId === 5) {
        this.authority.five = 'true';
      } if (item.aId === 6) {
        this.authority.six = 'true';
      } if (item.aId === 7) {
        this.authority.seven = 'true';
      } if (item.aId === 8) {
        this.authority.eigth = 'true';
      } if (item.aId === 9) {
        this.authority.nine = 'true';
      } if (item.aId === 10) {
        this.authority.ten = 'true';
      }
    }
    if (this.authority.nine !== 'true') {
      this.alertService.error();
      this.router.navigate(['main/main']);
    } else {
    await this.getRepair();
    }
  }

  async getRepair() {
    try {
      const cloth: any = await this.stockService.getCloth();
      if (cloth.rows) {
        this.repairList = cloth.rows;
        this.clothList = cloth.rows;
      }
      for (const row of this.repairList) {
        const result: any = await this.repairService.sumByClothId(row.clothId);
        // console.log(result.rows);
        if (result.rows[0].amount === null) {
          row.repairAmount = 0;
        } else {
          row.repairAmount = result.rows[0].amount;
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  onAdd() {
    this.currentRow.mode = 'add';
    this.modalEdit = true;
  }

  async addNewRow() {
    await this.addRepair.push({
      clothId: '1',
      amount: null
    });
  }

  async onDelete(rowNo) {
    const result: any = await this.alertService.confirm('ยืนยันการลบ ?');
    if (result.value) {
      const data: any = [];
      this.addRepair.forEach((row, index) => {
        if (rowNo !== index) {
          data.push(row);
        }
      });
      this.addRepair = data;
    }
  }

  async onSave() {
    console.log(this.addRepair);
    let m = 0;
    const k = [];
    const saveData: any = [];
    let unRepeat = 0;
    let dumNum = 0;
    let purchNum = 0;
    let val = 0;

    for (let i = 0; i < this.addRepair.length - 1; i++) {
      for (let j = i + 1; j < this.addRepair.length; j++) {
        if (this.addRepair[i].clothId === this.addRepair[j].clothId) {
          k[m] = this.addRepair[j].clothId;
          m++;
        }
      }
    }
    let i = 0;
    for (const row of this.addRepair) {
      i++;
      if (row.amount === null || row.amount === undefined || row.amount === '') {
        this.alertService.error('รายการที่ ' + i + ' ไม่มีจำนวนผ้า');
        val++;
      } else if (row.amount <= 0) {
        this.alertService.error('รายการที่ ' + i + ' จำนวนผิดพลาด');
        val++;
      }
    }
    if (val === 0) {
      // tslint:disable-next-line: no-shadowed-variable
      for (let i = 0; i < this.addRepair.length; i++) {
        this.dummy[i] = this.addRepair[i].clothId;
      }
      purchNum = _.size(this.addRepair);
      dumNum = _.size(_.uniq(this.dummy));
      if (dumNum < purchNum) {
        unRepeat = unRepeat + 1;
      }
      if (unRepeat !== 0) {
        this.alertService.error('กรุณาตรวจสอบรายการผ้าซ้ำ');
      } else {
        for (const row of this.addRepair) {
          const data = {
            repairAmount: row.amount,
            Cloth_clothId: row.clothId,
            repairDate: moment().format('YYYY-MM-DD')
          };
          const result3: any = await this.availableService.getAvailable(row.clothId);
          if (result3.rows) {
            const obj = {
              AvailableAmount: result3.rows[0].AvailableAmount + row.amount
            };
            try {
              const result: any = await this.repairService.insertRepair(data);
              const result2: any = await this.availableService.updateAvailable(obj, row.clothId);
            } catch (error) {
              console.log(error);
            }
          await this.alertService.success('บันทึกข้อมูลสำเร็จ');
          this.modalEdit = false;
          this.getRepair();
          } else {
            await this.alertService.error();
          }
        }
      }
    }
  }

}
