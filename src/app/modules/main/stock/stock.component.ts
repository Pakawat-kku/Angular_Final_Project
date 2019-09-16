import { StockService } from './../../../services/stock.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';



@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent implements OnInit {
clothList: any[];
clothTypeList: any[];
modalEdit = false;
currentRow: any;
editRow: any;

  constructor(
    private alertService: AlertService,
    private router: Router,
    private stockService: StockService
  ) { }

  ngOnInit() {
    this.getCloth();
    this.getClothType();
  }

  async getCloth() {
    try {
      const result: any = await this.stockService.getCloth();
      if (result.rows) {
        console.log('cloth', result.rows);
        this.clothList = result.rows;
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

  onAdd() {
    this.currentRow = {
      cName: '',
      cTypeId: '',
      cAmount: ''
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
      cName: this.currentRow.cName,
      cTypeId: this.currentRow.cTypeId,
      cAmount: this.currentRow.cAmount
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
        const obj = {
          cName: this.currentRow.cName,
          cTypeId: this.currentRow.cTypeId,
          cAmount: this.currentRow.cAmount,
          cId: this.currentRow.cId
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
