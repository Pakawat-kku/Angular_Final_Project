import { Injectable, Inject } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
// tslint:disable-next-line: class-name
export class Warehouse_export_availableDetailService {



  constructor(private http: HttpClient, @Inject('API_URL') private apiUrl) { }


  getWarehouse_export_availableDetail() {
    return this.http.get(`${this.apiUrl}/warehouse_export_availableDetail/`, {})
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  getWarehouse_export_availableDetailByCode(warehouse_export_availableCode) {
    // tslint:disable-next-line: max-line-length
    return this.http.post(`${this.apiUrl}/warehouse_export_availableDetail/getWarehouse_export_availableDetailByCode`, {warehouse_export_availableCode})
        .toPromise()
        .then(result => result)
        .catch(err => err);
  }


  insertWarehouse_export_availableDetail(data) {
    // tslint:disable-next-line: max-line-length
    return this.http.post(`${this.apiUrl}/warehouse_export_availableDetail/insertWarehouse_export_availableDetail`, {data})
        .toPromise()
        .then(result => result)
        .catch(err => err);
  }


  updateWarehouse_export_availableDetail(data) {
    return this.http.post(`${this.apiUrl}/warehouse_export_availableDetail/updateWarehouse_export_availableDetail`, {data})
    .toPromise()
    .then(result => result)
    .catch(error => error);
  }

  searchWarehouse_export_availableDetail(warehouse_export_availableCode) {
    // tslint:disable-next-line: max-line-length
    return this.http.post(`${this.apiUrl}/warehouse_export_availableDetail/searchWarehouse_export_availableDetail`, {warehouse_export_availableCode})
        .toPromise()
        .then(result => result)
        .catch(err => err);
  }

  deleteWarehouse_export_availableDetail(data) {
    return this.http.post(`${this.apiUrl}/warehouse_export_availableDetail/deleteWarehouse_export_availableDetail`, {data})
        .toPromise()
        .then(result => result)
        .catch(err => err);
  }
}


