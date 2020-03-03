import { Component, OnInit } from '@angular/core';
import { StockService } from './../../../services/stock.service';
import { WareHouseService } from './../../../services/wareHouse.service';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.scss']
})
export class WarehouseComponent implements OnInit {
  clothList: any[];
  clothTypeList: any[];
  clothType1List: any[] = [];
  modalEdit = false;
  currentRow: any;
  editRow: any;
  stock: any = [];
  notHave = 0;
  title = 'angularselect2';

  constructor(
    private alertService: AlertService,
    private router: Router,
    private stockService: StockService,
    private wareHouseService: WareHouseService,
  ) { }

  async ngOnInit() {
    await this.getWareHouse();
    await this.getClothType();

  }

  async getWareHouse() {
    try {
      const result1: any = await this.stockService.getCloth();
      this.stock = result1.rows;
      // console.log('this.stock', this.stock);
      for (const item of this.stock) {
        const result: any = await this.wareHouseService.getWareHouse(item.clothId);
        // console.log('result', result.rows);
        if (result.rows.length === 0) {
          item.warehouseAmount = 0;
        } else {
          item.warehouseAmount = result.rows[0].warehouseAmount;
        }
      }
    } catch (err) {
      console.log(err);
    }
    // console.log(this.stock);
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
      const result: any = await this.wareHouseService.getSearch(search);
      if (result.rows) {
        console.log('get search ', result.rows);
        this.stock = result.rows;
      }
    } catch (error) {
      console.log(error);
    }
}

  onAdd(row) {
    this.currentRow = Object.assign({}, row);
    this.currentRow = {
      clothId: this.currentRow.clothId,
      clothName: this.currentRow.clothName,
      warehouseAmount: this.currentRow.warehouseAmount
    };
    this.currentRow.mode = 'add';
    this.modalEdit = true;
    if (this.currentRow.warehouseAmount === 0) {
      this.notHave = this.notHave + 1;
    } else {
      this.notHave = 0;
    }
  }

  async onSave() {
    console.log(this.notHave);

    const result: any = await this.wareHouseService.getWareHouse( this.currentRow.clothId);
    console.log(result.rows);

    console.log('this.currentRow.warehouseAmount', this.currentRow.warehouseAmount);

    if (this.notHave === 1 && result.rows.length === 0) {
      const obj = {
        Cloth_clothId: this.currentRow.clothId,
        warehouseAmount: this.currentRow.warehouseAmount,
      };
      console.log('obj', obj);
 
      try {
          const result: any = await this.wareHouseService.insertWareHouse(obj);
          console.log('result.rows', result.rows);

          if (result.rows) {
            this.alertService.success('บันทึกสำเร็จ').then(value => {
              console.log('value', value);
              if (value.dismiss) {
                this.getWareHouse();
                this.modalEdit = false;
                this.router.navigate(['main/warehouse']);
                this.notHave = 0;

              }
            });
          } else {
            this.alertService.error('เกิดข้อผิดพลาด');

        }
      } catch (err) {
        console.log(err);
      }

    } else {

      const obj = {
        warehouseAmount: this.currentRow.warehouseAmount,
      };
      console.log('obj', obj);

      try {

          const result: any = await this.wareHouseService.updateWareHouse(this.currentRow.clothId, obj);
          console.log('result.rows', result.rows);
          if (result.rows) {
            this.alertService.success('บันทึกสำเร็จ').then(value => {
              console.log('value', value);
              if (value.dismiss) {
                this.getWareHouse();
                this.modalEdit = false;
                this.router.navigate(['main/warehouse']);
                this.notHave = 0;

              }
            });
          } else {
            this.alertService.error('เกิดข้อผิดพลาด');

        }
      } catch (err) {
        console.log(err);
      }
    }
  }
}
