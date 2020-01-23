import { Component, OnInit  , OnDestroy } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../../services//Authentication.service';
import * as jwt_decode from 'jwt-decode';
import { WardService } from './../../../services/ward.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ward',
  templateUrl: './ward.component.html',
  styleUrls: ['./ward.component.scss']
})
export class WardComponent implements OnInit , OnDestroy {
  currentUser: any;
  currentUserSubscription: Subscription;
  decoded: any;
  wardList: any;
  modalEdit = false;
  currentRow: any;
  editRow: any;

  constructor(
    private alertService: AlertService,
    private wardService: WardService,
    private router: Router,
    private authenticationService: AuthenticationService,

  ) {
      this.currentUserSubscription = this.authenticationService.currentUser.subscribe(users => {
      this.currentUser = users;
      console.log('users' , users );
      this.decoded = jwt_decode(users.token);
      console.log('decoded', this.decoded);

  });
  }

  ngOnInit() {
    this.getWard();
  }

  async getWard() {
    try {
      const result: any = await this.wardService.getAllWard();
      if (result.rows) {
        console.log('ward', result.rows);
        this.wardList = result.rows;
      }
    } catch (err) {
      console.log(err);
    }
  }

  onAdd() {
    this.currentRow = {
      wardName: '',
    };
    console.log('this.currentRow', this.currentRow);

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
      wardName: this.currentRow.wardName,

    };
    console.log('obj', obj);

    try {
      if (this.currentRow.mode === 'add') {
        const resultWard: any = await this.wardService.getAllWard();
        console.log('resultWard', resultWard);


        console.log('find', _.findIndex(resultWard.rows, ['wardName', obj.wardName]));

        if (_.findIndex(resultWard.rows, ['wardName', obj.wardName]) >= 0) {
            this.alertService.error('มีข้อมูลนี้อยู่แล้ว');
            this.modalEdit = false;
            this.getWard();
            this.router.navigate(['main/ward']);
        } else {
          const result: any = await this.wardService.insertWard(obj);
          if (result.rows) {
            console.log('add : ', result.rows);
            this.alertService.success('บันทึกสำเร็จ').then(value => {
              console.log('value', value);
              if (value.dismiss) {
                this.modalEdit = false;
                this.getWard();
                this.router.navigate(['main/ward']);
              }
            });
          } else {
            this.alertService.error('เกิดข้อผิดพลาด');
          }
        }

      } else if (this.currentRow.mode === 'edit') {
        // tslint:disable-next-line: no-shadowed-variable
        const obj = {
          wardId: this.currentRow.wardId,
          wardName: this.currentRow.wardName,
        };
        const result: any = await this.wardService.updateWard(obj);
        console.log(obj);
        if (result.rows) {
          console.log('edit: ', result.rows);
          this.alertService.success('แก้ไขสำเร็จ').then(value => {
            console.log('value', value);
            if (value.dismiss) {
              this.modalEdit = false;
              this.getWard();
              this.router.navigate(['main/ward']);
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


  async search(searchWard) {
    try {
      console.log('searchWard : ', searchWard);

      const result: any = await this.wardService.searchWard(searchWard);
      if (result.rows) {
        console.log('search ', result.rows);
        this.wardList = result.rows;
        console.log(this.wardList);
      }
    } catch (error) {
      console.log(error);
    }
  }


  async onDelete(row) {
    try {
    this.currentRow = Object.assign({}, row);
    console.log(this.currentRow);
    const result: any = await this.wardService.deleteWard(this.currentRow);
    if (result.rows) {
      console.log('delete: ', result.rows);
      this.alertService.deleteSuccess('ลบสำเร็จ').then(value => {
        console.log('value', value);
        if (value.dismiss) {
          this.getWard();
          this.router.navigate(['main/ward']);
        }
      });
    } else {
      this.alertService.error('เกิดข้อผิดพลาด');
    }
} catch (err) {
  console.log(err);
}
}

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.currentUserSubscription.unsubscribe();
}

}



