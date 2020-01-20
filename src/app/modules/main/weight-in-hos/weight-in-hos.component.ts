import { ImportDetailWeightService } from './../../../services/import-detail-weight.service';
import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { AuthenticationService } from 'src/app/services/Authentication.service';
import * as jwt_decode from 'jwt-decode';
import { Subscription } from 'rxjs';
import { Users } from '../register/users';
import { ImportClothService } from 'src/app/services/import-cloth.service';
import { ImportDetailWeightSumService } from 'src/app/services/import-detail-weight-sum.service';

@Component({
  selector: 'app-weight-in-hos',
  templateUrl: './weight-in-hos.component.html',
  styleUrls: ['./weight-in-hos.component.scss']
})
export class WeightInHosComponent implements OnInit {
  date: any;
  time: any;
  collapsed = true;
  currentUser: Users;
  currentUserSubscription: Subscription;
  decoded: any;
  importCode: any;
  userExport: any;
  calWeight = 0.0;
  weightSum = 0.0;
  weightList: any[] = [{
    weightCloth: null,
    weightCar: null
  }];

  constructor(
    private alertService: AlertService,
    private route: Router,
    private authenticationService: AuthenticationService,
    private importClothService: ImportClothService,
    private importWeightService: ImportDetailWeightService,
    private importWeightSumService: ImportDetailWeightSumService,
  ) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(users => {
      this.currentUser = users;
      this.decoded = jwt_decode(users.token);
    });
    this.authenticationService.currentUser.subscribe(x =>
      this.currentUser = x
    );
  }

  ngOnInit() {
    moment.locale('th');
    this.date = moment().add(543, 'years').format('DD MMMM YYYY');
    this.time = moment().format('hh:mm');
  }

  calculateWeight() {
    this.weightSum = 0.0;
    for (let i = 0; i < this.weightList.length; i++) {
      if (this.weightList[i].weightCloth === null
        || this.weightList[i].weightCar === null
        || this.weightList[i].weightCloth === undefined
        || this.weightList[i].weightCar === undefined) {
        this.alertService.error('รายการที่ ' + (i + 1) + ' กรอกข้อมูลไม่ครบ');
      } else if (this.weightList[i].weightCloth < this.weightList[i].weightCar) {
        this.alertService.error('รายการที่ ' + (i + 1) + ' น้ำหนักรถมากกว่าน้ำหนักผ้า');
      } else {
        this.calWeight = 0.0;
        this.calWeight = this.weightList[i].weightCloth - this.weightList[i].weightCar;
        this.weightSum += this.calWeight;
      }
    }
  }

  async addNewRow(rowNo) {
    await this.weightList.push({
      weightCloth: null,
      weightCar: null
    });
  }

  async onDelete(rowNo) {
    const result: any = await this.alertService.confirm('ยืนยันการลบ ?');
    if (result.value) {
      const data: any = [];
      this.weightList.forEach((row, index) => {
        if (rowNo !== index) {
          data.push(row);
        }
      });
      this.weightList = data;
      this.calculateWeight();
    }
  }

  async onSave() {
    if (this.userExport === '' || this.userExport === undefined) {
      this.alertService.error('ไม่มีชื่อผู้ส่งผ้า');
    } else {
      this.calculateWeight();
      this.importCode = this.decoded.userId + moment().format('DDMMYYYYhhmmss');
      const result_alert: any = await this.alertService.confirm('น้ำหนักผ้าสะอาด ' + this.weightSum + ' กก.');
      if (result_alert.value) {
        const data = {
          importCode: this.importCode,
          importDate: moment().format('YYYY-MM-DD HH:mm:ss'),
          importUserExport: this.userExport,
          importUserImport: this.decoded.firstname + ' ' + this.decoded.lastname
        };
        const data2 = {
          importDetailWeightSumTotal: this.weightSum,
          ImportCloth_importCode: this.importCode
        };
        const result: any = await this.importClothService.insertImportCloth(data);
        const toSum: any = await this.importWeightSumService.insertImportDetailWeightSum(data2);
        for (let i = 0; i < this.weightList.length; i++) {
          this.calWeight = 0.0;
          this.calWeight = this.weightList[i].weightCloth - this.weightList[i].weightCar;
          const obj = {
            importDetailWeightCloth: this.weightList[i].weightCloth,
            importDetailWeightCar: this.weightList[i].weightCar,
            importDetailWeightSum: this.calWeight,
            Import_importCode: this.importCode
          };
          const toWeight: any = await this.importWeightService.insertImportDetailWeight(obj);
        }
        if (result.statusCode === 200 && toSum.statusCode === 200) {
          this.alertService.success('ทำรายการเรียบร้อย');
          this.route.navigate(['main/overview-import-cloth']);
        }

      }
    }
  }

}
