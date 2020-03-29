import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../../services//Authentication.service';
import * as jwt_decode from 'jwt-decode';
import { WardService } from './../../../services/ward.service';
import { Router , ActivatedRoute} from '@angular/router';
import { PdfService } from 'src/app/services/pdf.service';
import { UsersAuthorityService } from 'src/app/services/users-authority.service';

@Component({
  selector: 'app-ward',
  templateUrl: './ward.component.html',
  styleUrls: ['./ward.component.scss']
})
export class WardComponent implements OnInit, OnDestroy {
  currentUser: any;
  currentUserSubscription: Subscription;
  decoded: any;
  wardList: any;
  modalEdit = false;
  currentRow: any;
  editRow: any;
  authority: any = [];


  constructor(
    private alertService: AlertService,
    private wardService: WardService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private pdfSefvice: PdfService,
    private _Activatedroute: ActivatedRoute,
 
    private users_authorityService: UsersAuthorityService,
  ) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(users => {
      this.currentUser = users;
      console.log('users', users);
      this.decoded = jwt_decode(users.token);
      console.log('decoded', this.decoded);

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
    if (this.authority.six !== 'true') {
      this.alertService.error();
      this.router.navigate(['main/main']);
    } else {
    this.getWard();
    }
  }

  async getWard() {
    try {
      const result: any = await this.wardService.getAllWard();
      if (result.rows) {
        this.wardList = result.rows;
      }
    } catch (err) {
      console.log(err);
    }
  }

  async printPDF() {
    const result: any = await this.pdfSefvice.printPDF();
    if (result) {
      window.open(result.url, '_blank');
    }
  }

  onAdd() {
    this.currentRow = {
      wardName: '',
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
      wardName: this.currentRow.wardName,

    };

    try {
      if (this.currentRow.mode === 'add') {
        const resultWard: any = await this.wardService.getAllWard();

        if (_.findIndex(resultWard.rows, ['wardName', obj.wardName]) >= 0) {
          this.alertService.error('มีข้อมูลนี้อยู่แล้ว');
          this.modalEdit = false;
          this.getWard();
          this.router.navigate(['main/ward']);
        } else {
          const result: any = await this.wardService.insertWard(obj);
          if (result.rows) {
            this.alertService.success('บันทึกสำเร็จ').then(value => {
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
        if (result.rows) {

          this.alertService.success('แก้ไขสำเร็จ').then(value => {

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

      if (searchWard.length === 0) {
        this.getWard();
      } else {
        const result: any = await this.wardService.searchWard(searchWard);
        if (result.rows) {

          this.wardList = result.rows;
          console.log(this.wardList);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }


  async onDelete(row) {
    try {
      this.currentRow = Object.assign({}, row);
      const result: any = await this.wardService.deleteWard(this.currentRow);
      if (result.rows) {
        this.alertService.deleteSuccess('ลบสำเร็จ').then(value => {
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

// async printPDF() {

//         const result: any = await this.pdfSefvice.printPDF();

//         if (result) {

//           window.open(result.url, '_blank');
//         }
//   }


  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.currentUserSubscription.unsubscribe();
  }

}



