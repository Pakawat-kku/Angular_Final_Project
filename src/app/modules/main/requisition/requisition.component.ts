import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { RequisitionService } from './../../../services/requisition.service';
import { StockService } from './../../../services/stock.service';
import { throwError, fromEvent } from 'rxjs';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { NgForm, FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import * as _ from 'lodash';
import { Custom } from './custom';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { Users } from '../register/users';
import { AuthenticationService } from '../../../services//Authentication.service';
import { UsersService } from '../../../services/users.service';
import * as jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-requisition',
  templateUrl: './requisition.component.html',
  styleUrls: ['./requisition.component.scss'],

})
export class RequisitionComponent implements OnInit, OnDestroy {
  stockList: [];
  reqList: [];
  req: any;
  currentRow: any;
  modalEdit = false;
  clothId: any;
  Cloth_clothId: any;
  modalShowRequisition = false;
  showReqlist: any;
  selected: string[] = [];
  amountCloth: any;
  currentObj: { cId: any; };
  cartReq: Array<{ clothId: number, clothName: string }> = [];
  // empList: Array<Custom> = [];
  arrayList: Array<Custom> = [];
  getRepeat: any;
  currentUser: Users;
  currentUserSubscription: Subscription;
  decoded: any;
  longReqId: any;




  constructor(
    private alertService: AlertService,
    private stockService: StockService,
    private requisitionService: RequisitionService,
    private router: Router,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private userService: UsersService

  ) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(users => {
      this.currentUser = users;
      console.log('users', users);
      this.decoded = jwt_decode(users.token);
      console.log('decoded', this.decoded);

    });
  }

  ngOnInit() {
    this.getStock();
    this.getReq();
    this.longReqId = this.decoded.Ward_wardId + ' ' + moment().format('DD-MM-YYYY, HH:mm:ss ');
    console.log(this.longReqId);

  }

  async getStock() {
    try {
      const result: any = await this.stockService.getStock();
      if (result.rows) {
        console.log(result.rows);
        this.stockList = result.rows;
      }
    } catch (err) {
      console.log(err);
    }
  }

  // async getReq() {

  //   try {
  //     console.log('this.decoded.userId', this.decoded.userId);

  //     const result: any = await this.requisitionService.showReq(this.decoded.userId);
  //     console.log('showReq', result);

  //     if (result.rows) {
  //       console.log(result.rows);
  //       this.showReqlist = result.rows;
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  async getReq() {


    }

  // async onSave(row) {
  //   this.currentRow = Object.assign({}, row);
  //   this.getRepeat = _.get(row, ['clothId']);
  //   console.log('pick', this.getRepeat);
  //   const req: any = await this.requisitionService.showReq(this.decoded.userId);
  //   console.log('req', req.rows);
  //   // console.log('key', _.findKey(this.empList, ['empoloyeeID', this.getRepeat]));

  //   if (_.findKey(req.rows, ['Cloth_clothId', this.getRepeat]) < this.getRepeat) {
  //     this.alertService.reqRepeat('ซ้ำ').then(value => {
  //       console.log('value', value);
  //     });
  //     this.getReq();
  //     this.router.navigate(['main/requisition']);
  //   } else {

  //     this.clothId = this.currentRow.clothId;

  //     const obj = {
  //       requisitionCode: this.longReqId,
  //       status: '1',
  //       Ward_wardId: this.decoded.Ward_wardId,
  //       Users_userId: this.decoded.userId,

  //     };
  //     console.log(obj);

  //     // เพิ่มที่ requisition
  //     const result1 = await this.requisitionService.insertRealReq(obj);

  //     const obj1 = {
  //       Cloth_clothId: this.clothId,
  //       Requisition_requisitionCode: this.longReqId,
  //     };

  //     // เพิ่มที่ requisitionDetail
  //     const result = await this.requisitionService.insertReq(obj1);

  //     if (result.ok) {
  //       this.alertService.reqWait('บันทึกสำเร็จ').then(value => {
  //         console.log('value', value);

  //         if (value.dismiss) {
  //           this.getReq();
  //           this.router.navigate(['main/requisition']);
  //         }
  //       });
  //     }

  //   }
  // }

  async onSave(row) {
    this.currentRow = Object.assign({}, row);
    this.getRepeat = _.get(row, ['clothId']);


  }



  async onReq(form) {
    console.log('form.value', form.value);

    this.alertService
      .confirmReq()
      .then(async value => {
        if (value.value === true) {
          console.log('true');

          for (const i of _.chunk(_.values(form.value), 2)) {
            this.clothId = i[0];
            this.amountCloth = i[1];

            const obj1 = {
              Requisition_requisitionCode: this.longReqId,
              amountCloth: this.amountCloth
            };
            console.log('obj', obj1);

            // เพิ่มที่ requisitionDetail
            const result = await this.requisitionService.updateReq(this.clothId, obj1);

            const obj = {
              requisitionCode: this.longReqId,
              status: '2',
              reqDate: moment().format('YYYY-MM-DD HH:mm:ss'),
            };
            console.log(obj);

            // เพิ่มที่ requisition
            const result1 = await this.requisitionService.updateRealReq(this.longReqId, obj);
            console.log('result1', result1);


            if (result && result1) {
              console.log('result', result);

            }
          }

        } else if (value.dismiss) {
          console.log('false');
        }
        console.log('k', value);
        this.alertService.reqSuccess();
              this.getReq();
              this.ngOnInit();
              this.router.navigate(['main/requisition']);
      })

      .catch(err => {
        console.log('false', err);
      });
  }



  async ReqDelete(Cloth_clothId) {
    console.log('Cloth_clothId', Cloth_clothId);
    const result3: any = await this.requisitionService.showReq(this.decoded.userId);
    this.showReqlist = result3.rows;
    console.log('this.showReqlist', this.showReqlist);
    this.alertService
      .confirm()
      .then(async value => {
        if (value.value === true) {

          console.log('true');
           if (this.showReqlist === [0]) {

            const result2: any = await this.requisitionService.deleteReqNull(this.decoded.userId);

           } else {
          const result: any = await this.requisitionService.deleteReq(Cloth_clothId);

          if (result ) {
            console.log(result);
            // console.log(result1);
          }
        }
        } else if (value.dismiss) {
          console.log('false');
        }
        console.log('k', value);

        this.getReq();
        this.ngOnInit();
        this.router.navigate(['main/requisition']);
      })

      .catch(err => {
        console.log('false', err);
      });
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.currentUserSubscription.unsubscribe();
  }

}
