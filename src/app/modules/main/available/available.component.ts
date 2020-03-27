import { Component, OnInit } from '@angular/core';
import { StockService } from './../../../services/stock.service';
import { AvailableService } from './../../../services/available.service';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { WareHouseService } from './../../../services/wareHouse.service';

import * as jwt_decode from 'jwt-decode';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../../services//Authentication.service';
import { UsersAuthorityService } from 'src/app/services/users-authority.service';
@Component({
  selector: 'app-available',
  templateUrl: './available.component.html',
  styleUrls: ['./available.component.scss']
})
export class AvailableComponent implements OnInit {
  available: any = [];
  stock: any = [];
  currentRow: any;
  modalEdit = false;
  notHave: any;
  currentUser: any;
  currentUserSubscription: Subscription;
  decoded: any = { status_approve: false };
  authority: any = [];

  constructor(
    private alertService: AlertService,
    private router: Router,
    private wareHouseService: WareHouseService,
    private stockService: StockService,
    private availableService: AvailableService,
    private authenticationService: AuthenticationService,
    private users_authorityService: UsersAuthorityService,

  )  {
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
    if (this.authority.five !== 'true') {
      this.alertService.error();
      this.router.navigate(['main/main']);
    } else {
    await this.getAvailable();
  }
}

  async getAvailable() {
    try {
      const result1: any = await this.stockService.getCloth();
      this.stock = result1.rows;


      for (const item of this.stock) {
        const result: any = await this.availableService.getAvailable(item.clothId);
        const result2: any = await this.wareHouseService.getWareHouse(item.clothId);

        if (result.rows.length === 0) {
          item.AvailableAmount = 0;
        } else {
          item.AvailableAmount = result.rows[0].AvailableAmount;
        }
        if ( result2.rows.length === 0) {
          item.warehouseAmount = 0;
        } else {
          item.warehouseAmount = result2.rows[0].warehouseAmount;
        }

      }

    } catch (err) {
      console.log(err);
    }

  }

  onAdd(row) {
    this.currentRow = Object.assign({}, row);
    this.currentRow = {
      clothId: this.currentRow.clothId,
      clothName: this.currentRow.clothName,
      AvailableAmount: this.currentRow.AvailableAmount
    };
    this.currentRow.mode = 'add';
    this.modalEdit = true;
  }

//   async onSave() {
//     // console.log(this.notHave);
//     console.log('currentRow', this.currentRow);
//     try {
//       const result2: any = await this.wareHouseService.getWareHouse(this.currentRow.clothId);
//       const result4: any = await this.availableService.getAvailable(this.currentRow.clothId);
//       console.log('result4' , result4);

//         // if (result4.rows.length === 0) {
//         //   result4.rows.AvailableAmount = 0;
//         // }

//       console.log('result4' , result4);

//       if (result2.rows.length === 0) {
//         const obj = {
//           Cloth_clothId: this.currentRow.clothId,
//           AvailableAmount: this.currentRow.AvailableAmount,
//         };
//         console.log('obj', obj);

//         const result: any = await this.availableService.insertAvailable(obj);
//         console.log('result.rows', result.rows);
//       } else {
//         const obj1 = {
//           AvailableAmount: result4.rows[0].AvailableAmount + this.currentRow.AvailableAmount,
//         };
//         console.log('obj1', obj1);

//         const result: any = await this.availableService.updateAvailable(this.currentRow.clothId , obj1);

//         const obj2 = {
//           warehouseAmount: result2.rows[0].warehouseAmount - this.currentRow.AvailableAmount,
//         };
//         console.log('obj2', obj2);
//         const result3: any = await this.wareHouseService.updateWareHouse(this.currentRow.clothId , obj2);

//         console.log('result.rows', result.rows);
//       }

//    } catch (err) {
//     console.log(err);
//   }
// }

}
