import { AlertService } from 'src/app/services/alert.service';
import { Component, OnInit } from '@angular/core';
import { AuthorityService } from 'src/app/services/authority.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-authority',
  templateUrl: './authority.component.html',
  styleUrls: ['./authority.component.scss']
})
export class AuthorityComponent implements OnInit {
  authorityList: any = [];
  modalEdit = false;
  currentRow: any;
  editRow: any;

  constructor(
    private alertService: AlertService,
    private router: Router,
    private authorityService: AuthorityService
  ) { }

  ngOnInit() {
    this.getAuthority();
  }

  async getAuthority() {
    try {
      const result: any = await this.authorityService.getAuthority();
      if (result.rows) {
        this.authorityList = result.rows;
      }
    } catch (err) {
      console.log(err);
    }
  }

  async onEdit(row) {
    this.currentRow = Object.assign({}, row);
    this.currentRow.mode = 'edit';
    this.modalEdit = true;
  }

  onAdd() {
    this.currentRow = {
      description: ''
    };
    this.currentRow.mode = 'add';
    this.modalEdit = true;
  }

  async onSave() {
    const obj = {
      description: this.currentRow.description
    };
    try {
      if (this.currentRow.mode === 'add') {
        const result: any = await this.authorityService.insertAuthority(obj);
        if (result.rows) {
          this.alertService.success('บันทึกสำเร็จ').then(value => {
            console.log('value', value);
            if (value.dismiss) {
              this.getAuthority();
              this.modalEdit = false;
              this.router.navigate(['main/authority']);
            }
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

}
