
import { StockService } from './../../../services/stock.service';
import { Component, OnInit } from '@angular/core';
import { Router , ActivatedRoute} from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import * as jwt_decode from 'jwt-decode';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../../services//Authentication.service';
import { UsersAuthorityService } from 'src/app/services/users-authority.service';


@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent implements OnInit {
  clothList: any[];
  clothTypeList: any[];
  clothType1List: any[] = [];
  modalEdit = false;
  currentRow: any;
  editRow: any;
  currentUser: any;
  currentUserSubscription: Subscription;
  decoded: any ;
  authority: any = [];

  constructor(
    private alertService: AlertService,
    private router: Router,
    private stockService: StockService,
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
    if (this.authority.four !== 'true') {
      this.alertService.error();
      this.router.navigate(['main/main']);
    } else {
    this.getCloth();
    this.getClothType();
    }
  }

  async getCloth() {
    try {
      const result: any = await this.stockService.getCloth();
      if (result.rows) {
        console.log('cloth', result.rows);
        this.clothList = result.rows;
        console.log('check', this.clothList);
      }
    } catch (err) {
      console.log(err);
    }
  }
  async getClothType() {
    try {
      const result: any = await this.stockService.getClothType();
      if (result.rows) {
        console.log('cloth type', result.rows);
        this.clothTypeList = result.rows;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async letSearch(search) {
    try {
      console.log('search : ', search);
      const result: any = await this.stockService.getSearch(search);
      if (result.rows) {
        console.log('get search ', result.rows);
        this.clothList = result.rows;
      }
    } catch (error) {
      console.log(error);
    }
  }

  onAdd() {
    this.currentRow = {
      clothName: '',
      ClothType_clothTypeId: '',
      clothClassifier: ''
    };
    this.currentRow.mode = 'add';
    this.modalEdit = true;
  }

  async onEdit(row) {
    this.currentRow = Object.assign({}, row);
    this.currentRow.mode = 'edit';
    this.modalEdit = true;
  }

  async onSave() {
    const obj = {
      clothName: this.currentRow.clothName,
      ClothType_clothTypeId: this.currentRow.ClothType_clothTypeId,
      clothClassifier: this.currentRow.clothClassifier
    };
    try {
      if (this.currentRow.mode === 'add') {
        const result: any = await this.stockService.insertCloth(obj);
        if (result.rows) {
          console.log('add : ', result.rows);
          this.alertService.success('บันทึกสำเร็จ').then(value => {
            console.log('value', value);
            if (value.dismiss) {
              this.getCloth();
              this.modalEdit = false;
              this.router.navigate(['main/stock']);
            }
          });
        } else {
          this.alertService.error('เกิดข้อผิดพลาด');
        }
      } else if (this.currentRow.mode === 'edit') {
        // tslint:disable-next-line: no-shadowed-variable
        const obj = {
          clothName: this.currentRow.clothName,
          ClothType_clothTypeId: this.currentRow.ClothType_clothTypeId,
          clothClassifier: this.currentRow.clothClassifier,
          clothId: this.currentRow.clothId
        };
        const result: any = await this.stockService.updateCloth(obj);
        console.log(obj);
        if (result.rows) {
          console.log('edit: ', result.rows);
          this.alertService.success('บันทึกสำเร็จ').then(value => {
            console.log('value', value);
            if (value.dismiss) {
              this.getCloth();
              this.modalEdit = false;
              this.router.navigate(['main/stock']);
            }
          });
        } else {
          this.alertService.error('เกิดข้อผิดพลาด');
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
}
