import { ImportDetailWeightService } from './../../../services/import-detail-weight.service';
import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { AuthenticationService } from 'src/app/services/Authentication.service';
import * as jwt_decode from 'jwt-decode';
import { Subscription } from 'rxjs';
import { Users } from '../register/users';
import { ImportClothService } from 'src/app/services/import-cloth.service';
import { ImportDetailWeightSumService } from 'src/app/services/import-detail-weight-sum.service';
import { CompanyService } from './../../../services/company.service';
import { ExportService } from './../../../services/export.service';
import { LocaleHelperService } from '@clr/angular/forms/datepicker/providers/locale-helper.service';

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
  exportClothCode: string;
  companyList: any;
  exportCloth: any;
  exportClothHospital: any;
  exportClothType: any;
  exportClothTypeHos: any;
  importCarId: any;
  pass = 0;
  importUserExport: any;

  constructor(
    private alertService: AlertService,
    private authenticationService: AuthenticationService,
    private importClothService: ImportClothService,
    private importWeightService: ImportDetailWeightService,
    private _Activatedroute: ActivatedRoute,
    private companyService: CompanyService,
    private importWeightSumService: ImportDetailWeightSumService,
    private exportService: ExportService,
    private router: Router,


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
    this.exportClothCode = this._Activatedroute.snapshot.paramMap.get('exportClothCode');
    console.log('this.exportClothCode', this.exportClothCode);
    this.getCompany();
    this.getExportCloth();
  }

  async getExportCloth() {
    try {
      console.log('exportClothCode', this.exportClothCode);

      const result: any = await this.exportService.showExportClothCompany(this.exportClothCode);
      const result1: any = await this.exportService.showExportClothHospital(this.exportClothCode);

      console.log('result', result);

      if (result.rows) {
        console.log(result.rows);
        this.exportCloth = result.rows;
        for (const item of this.exportCloth) {
          item.date = moment(item.exportClothDate).format('DD');
          item.month = moment(item.exportClothDate).format('MMMM');
          item.year = moment(item.exportClothDate).add(543, 'years').format('YYYY');
          item.time = moment(item.exportClothDate).format('HH:mm');
          item.day = item.date + '  ' + item.month + '  ' + item.year;
          this.exportClothType = item.exportClothType;

        }
        console.log('this.exportCloth', this.exportCloth);

        this.exportClothHospital = result1.rows;
        for (const item of this.exportClothHospital) {
          item.date = moment(item.exportClothDate).format('DD');
          item.month = moment(item.exportClothDate).format('MMMM');
          item.year = moment(item.exportClothDate).add(543, 'years').format('YYYY');
          item.time = moment(item.exportClothDate).format('HH:mm');
          item.day = item.date + '  ' + item.month + '  ' + item.year;
          item.percent = item.exportClothTotalWeight.toFixed(2) * 0.95;
          item.percent = parseFloat(item.percent).toFixed(2);
          this.exportClothTypeHos = item.exportClothType;

        }
        console.log('this.exportClothHospital', this.exportClothHospital);
      }
      console.log('exportClothType', this.exportClothType);
      console.log('exportClothTypeHos', this.exportClothTypeHos);

    } catch (err) {
      console.log(err);
    }
  }

  async getCompany() {
    const result: any = await this.companyService.getCompany();
    if (result.rows) {
      this.companyList = result.rows;
      console.log('company', this.companyList);
    }
  }

  calculateWeight() {
    for (let i = 0; i < this.weightList.length; i++) {
      if (this.weightList[i].weightCloth === null
        || this.weightList[i].weightCar === null
        || this.weightList[i].weightCloth === undefined
        || this.weightList[i].weightCar === undefined) {
        this.alertService.error('รายการที่ ' + (i + 1) + ' กรอกข้อมูลไม่ครบ');
      } else if (this.weightList[i].weightCloth < this.weightList[i].weightCar) {
        this.alertService.error('รายการที่ ' + (i + 1) + ' น้ำหนักรถมากกว่าน้ำหนักผ้า');
      } else {
        this.weightSum = 0.0;
        for (let i = 0; i < this.weightList.length; i++) {
          this.calWeight = 0.0;
          this.calWeight = this.weightList[i].weightCloth - this.weightList[i].weightCar;
          this.weightSum += this.calWeight;
        }
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

    this.importCode = this.decoded.userId + moment().format('DDMMYYYYhhmmss');
    this.calculateWeight();
    console.log('this.importCarId' , this.importCarId);

    if (this.exportClothTypeHos === '1') {
      for (let i = 0; i < this.weightList.length; i++) {
        if (this.weightList[i].weightCloth === null
          || this.weightList[i].weightCar === null
          || this.weightList[i].weightCloth === undefined
          || this.weightList[i].weightCar === undefined) {
          this.alertService.error('รายการที่ ' + (i + 1) + ' กรอกข้อมูลไม่ครบ');
        } else if (this.weightList[i].weightCloth < this.weightList[i].weightCar) {
          this.alertService.error('รายการที่ ' + (i + 1) + ' น้ำหนักรถมากกว่าน้ำหนักผ้า');
        // tslint:disable-next-line: max-line-length
        } else if (this.weightList[i].weightCloth <= 0 || this.weightList[i].weightCar <= 0) {
          this.alertService.error('รายการที่ ' + (i + 1) + ' มีข้อผิดพลาดกรุณาตรวจสอบ');
        // } else if (this.importCarId === '' || this.importCarId === undefined) {
        //   this.alertService.error('กรุณาใส่ทะเบียนรถ');
        } else if (this.importUserExport === '' || this.importUserExport === undefined ) {
          this.alertService.error('กรุณาใส่ชื่อผู้รับ');
        } else {
          this.pass = this.pass + 1;
        }
      }
    } else {
      for (let i = 0; i < this.weightList.length; i++) {
        if (this.weightList[i].weightCloth === null
          || this.weightList[i].weightCar === null
          || this.weightList[i].weightCloth === undefined
          || this.weightList[i].weightCar === undefined) {
          this.alertService.error('รายการที่ ' + (i + 1) + ' กรอกข้อมูลไม่ครบ');
        } else if (this.weightList[i].weightCloth < this.weightList[i].weightCar) {
          this.alertService.error('รายการที่ ' + (i + 1) + ' น้ำหนักรถมากกว่าน้ำหนักผ้า');
        // tslint:disable-next-line: max-line-length
        } else if (this.weightList[i].weightCloth <= 0 || this.weightList[i].weightCar <= 0) {
          this.alertService.error('รายการที่ ' + (i + 1) + ' มีข้อผิดพลาดกรุณาตรวจสอบ');
        } else if (this.importCarId === '' || this.importCarId === undefined) {
          this.alertService.error('กรุณาใส่ทะเบียนรถ');
        } else if (this.importUserExport === '' || this.importUserExport === undefined ) {
          this.alertService.error('กรุณาใส่ชื่อผู้รับ');
        } else {
          this.pass = this.pass + 1;
        }
      }
    }

    if (this.pass > 0) {
    if (this.exportClothType === '2' || this.exportClothTypeHos === '2') {
      console.log('this.importCarId' , this.importCarId);
      const result_alert: any = await this.alertService.confirm('น้ำหนักผ้าสะอาด ' + this.weightSum + ' กก.');
      if (result_alert.value) {
        const data = {
          importCode: this.importCode,
          importDate: moment().format('YYYY-MM-DD HH:mm:ss'),
          importUserExport: this.importUserExport,
          importUserImport: this.decoded.firstname + ' ' + this.decoded.lastname,
          Company_idCompany: this.exportCloth[0].Company_idCompany,
          Export_exportClothCode: this.exportClothCode,
          importCarId: this.importCarId
        };
        console.log('data', data);

        const data2 = {
          importDetailWeightSumTotal: this.weightSum,
          ImportCloth_importCode: this.importCode
        };
        console.log('data1', data2);

        const result: any = await this.importClothService.insertImportCloth(data);
        const toSum: any = await this.importWeightSumService.insertImportDetailWeightSum(data2);
        for (let i = 0; i < this.weightList.length; i++) {
          this.calWeight = 0.0;
          this.calWeight = this.weightList[i].weightCloth - this.weightList[i].weightCar;
          const obj = {
            importDetailWeightCloth: this.weightList[i].weightCloth,
            importDetailWeightCar: this.weightList[i].weightCar,
            importDetailWeightSum: this.calWeight,
            Import_importCode: this.importCode,

          };
          console.log('obj', obj);

          const toWeight: any = await this.importWeightService.insertImportDetailWeight(obj);
        }
        if (result.statusCode === 200 && toSum.statusCode === 200) {
          this.alertService.success('ทำรายการเรียบร้อย');
          // this.route.navigate(['main/overview-import-cloth']);
          await this.router.navigate(['main/export-cloth-bill/' + this.exportClothCode]);

        }
      }
    } else {
      const result_alert: any = await this.alertService.confirm('น้ำหนักผ้าสะอาด ' + this.weightSum + ' กก.');
      if (result_alert.value) {
        const data = {
          importCode: this.importCode,
          importDate: moment().format('YYYY-MM-DD HH:mm:ss'),
          importUserExport: this.importUserExport,
          importUserImport: this.decoded.firstname + ' ' + this.decoded.lastname,
          Company_idCompany: this.exportClothHospital[0].Company_idCompany,
          Export_exportClothCode: this.exportClothCode,
          importCarId: this.importCarId,
        };
        console.log('data', data);

        const data2 = {
          importDetailWeightSumTotal: this.weightSum,
          ImportCloth_importCode: this.importCode
        };
        console.log('data1', data2);

        const result: any = await this.importClothService.insertImportCloth(data);
        const toSum: any = await this.importWeightSumService.insertImportDetailWeightSum(data2);
        for (let i = 0; i < this.weightList.length; i++) {
          this.calWeight = 0.0;
          this.calWeight = this.weightList[i].weightCloth - this.weightList[i].weightCar;
          const obj = {
            importDetailWeightCloth: this.weightList[i].weightCloth,
            importDetailWeightCar: this.weightList[i].weightCar,
            importDetailWeightSum: this.calWeight,
            Import_importCode: this.importCode,

          };
          console.log('obj', obj);

          const toWeight: any = await this.importWeightService.insertImportDetailWeight(obj);
        }
        this.pass = 0;
        if (result.statusCode === 200 && toSum.statusCode === 200) {
          this.alertService.success('ทำรายการเรียบร้อย');
          // this.route.navigate(['main/overview-import-cloth']);
          await this.router.navigate(['main/export-cloth-bill/' + this.exportClothCode]);

        }
      }
    }
    }

  }

}
