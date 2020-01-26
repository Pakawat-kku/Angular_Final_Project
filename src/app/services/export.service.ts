import { Injectable, Inject } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor(private http: HttpClient, @Inject('API_URL') private apiUrl) {}

  getExportClothHos() {
    return this.http.get(`${this.apiUrl}/exportCloth/getExportClothHos`, {})
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  getExportClothCompany() {
    return this.http.get(`${this.apiUrl}/exportCloth/getExportClothCompany`, {})
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  getExportDetail() {
    return this.http.get(`${this.apiUrl}/exportCloth/exportDetail`, {})
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  showExportClothCompany(exportClothCode) {
    return this.http.post(`${this.apiUrl}/exportCloth/showExportClothCompany` , { exportClothCode })
    .toPromise()
    .then(result => result)
    .catch(error => error);
  }

  showExportClothHospital(exportClothCode) {
    return this.http.post(`${this.apiUrl}/exportCloth/showExportClothHospital` , { exportClothCode })
    .toPromise()
    .then(result => result)
    .catch(error => error);
  }

  showExportDetail(exportClothCode) {
    return this.http.post(`${this.apiUrl}/exportCloth/showExportDetail` , { exportClothCode })
    .toPromise()
    .then(result => result)
    .catch(error => error);
  }

  insertExportCloth(data) {
    return this.http.post(`${this.apiUrl}/exportCloth/insertExportCloth`, {data})
    .toPromise()
    .then(result => result)
    .catch(error => error);
  }

  insertExportDetail(data) {
    return this.http.post(`${this.apiUrl}/exportCloth/insertExportDetail`, {data})
    .toPromise()
    .then(result => result)
    .catch(error => error);
  }

//   updateCloth(data) {
//     return this.http.post(`${this.apiUrl}/cloth/update`, {data})
//     .toPromise()
//     .then(result => result)
//     .catch(error => error);
//   }

//   getSearch(search) {
//     return this.http.post(`${this.apiUrl}/cloth/search`, {search})
//     .toPromise()
//     .then(result => result)
//     .catch(error => error);
//   }

//   getStock() {
//     // return this.http.get(`${this.url}/get-annouce/${month}/${year}`)
//     return this.http
//       .get(`${this.apiUrl}/cloth/stock/`, {})
//       .toPromise()
//       .then(result => result)
//       .catch(error => error);
//   }
}
