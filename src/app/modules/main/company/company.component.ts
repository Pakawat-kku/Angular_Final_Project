import { CompanyService } from './../../../services/company.service';
import { AlertService } from './../../../services/alert.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {
companyList: any = [];
modalEdit = false;
currentRow: any;
editRow: any;

  constructor(
    private alertService: AlertService,
    private router: Router,
    private companyService: CompanyService
  ) { }

  ngOnInit() {
    this.getCompany();
  }

  async getCompany() {
    const result: any = await this.companyService.getCompany();
    if (result.rows) {
      this.companyList = result.rows;
    }
  }

  onAdd() {
    this.currentRow = {
      companyName: '',
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
      companyName: this.currentRow.companyName
    };
    console.log('obj', obj);

    try {
      if (this.currentRow.mode === 'add') {
        const results: any = await this.companyService.getCompany();
        if (_.findIndex(results.rows, ['companyName', obj.companyName]) >= 0) {
          this.alertService.error('มีข้อมูลนี้อยู่แล้ว');
          this.modalEdit = false;
          this.getCompany();
          this.router.navigate(['main/company']);
        } else {
          const result: any = await this.companyService.insertCompany(obj);
          if (result.rows) {
            this.alertService.success('บันทึกสำเร็จ').then(value => {
              if (value.dismiss) {
                this.modalEdit = false;
                this.getCompany();
                this.router.navigate(['main/company']);
              }
            });
          } else {
            this.alertService.error('เกิดข้อผิดพลาด');
          }
        }

      } else if (this.currentRow.mode === 'edit') {
        // tslint:disable-next-line: no-shadowed-variable
        const obj = {
          idCompany: this.currentRow.idCompany,
          companyName: this.currentRow.companyName,
        };
        const result: any = await this.companyService.updateCompany(obj);
        console.log(obj);
        if (result.rows) {
          console.log('edit: ', result.rows);
          this.alertService.success('แก้ไขสำเร็จ').then(value => {
            if (value.dismiss) {
              this.modalEdit = false;
              this.getCompany();
              this.router.navigate(['main/company']);
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
