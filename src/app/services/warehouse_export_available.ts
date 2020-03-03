import { Injectable, Inject } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
// tslint:disable-next-line: class-name
export class Warehouse_export_availableService {



  constructor(private http: HttpClient, @Inject('API_URL') private apiUrl) { }


  getWarehouse_export_available() {
    return this.http.get(`${this.apiUrl}/Warehouse_export_available/`, {})
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  getWarehouse_export_availableByCode(warehouse_export_availableCode) {
    return this.http.post(`${this.apiUrl}/Warehouse_export_available/getWarehouse_export_availableByCode`, {warehouse_export_availableCode})
        .toPromise()
        .then(result => result)
        .catch(err => err);
  }


  insertWarehouse_export_available(data) {
    return this.http.post(`${this.apiUrl}/Warehouse_export_available/insertWarehouse_export_available`, {data})
    .toPromise()
    .then(result => result)
    .catch(error => error);
  }

  updateWarehouse_export_available(data) {
    return this.http.post(`${this.apiUrl}/Warehouse_export_available/updateWarehouse_export_available`, {data})
    .toPromise()
    .then(result => result)
    .catch(error => error);
  }

  searchWarehouse_export_available(warehouse_export_availableCode) {
    return this.http.post(`${this.apiUrl}/Warehouse_export_available/searchWarehouse_export_available`, {warehouse_export_availableCode})
        .toPromise()
        .then(result => result)
        .catch(err => err);
  }

  deleteWarehouse_export_available(data) {
    return this.http.post(`${this.apiUrl}/Warehouse_export_available/deleteWarehouse_export_available`, {data})
        .toPromise()
        .then(result => result)
        .catch(err => err);
  }

}
