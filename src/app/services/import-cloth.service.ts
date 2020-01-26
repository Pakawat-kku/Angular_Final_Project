import { Injectable, Inject } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ImportClothService {

  constructor(private http: HttpClient, @Inject('API_URL') private apiUrl) { }

  getImportCloth() {
    return this.http.get(`${this.apiUrl}/importCloth/`, {  })
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  insertImportCloth(data) {
    return this.http.post(`${this.apiUrl}/importCloth/`, { data })
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  getImportClothWhere(importCode) {
    return this.http.post(`${this.apiUrl}/importCloth/where`, { importCode })
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  getImportClothBy(importCode) {
    return this.http.post(`${this.apiUrl}/importCloth/by`, { importCode })
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  showImportCloth(exportClothCode) {
    return this.http.post(`${this.apiUrl}/importCloth/showImportCloth`, { exportClothCode })
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  getInner(Export_exportClothCode) {
    return this.http.post(`${this.apiUrl}/importCloth/getInner`, { Export_exportClothCode })
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

}
