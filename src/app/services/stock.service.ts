import { Injectable, Inject } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  constructor(private http: HttpClient, @Inject('API_URL') private apiUrl) {}

  getCloth() {
    return this.http.get(`${this.apiUrl}/cloth/`, {})
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  getClothType() {
    return this.http.get(`${this.apiUrl}/clothType/`, {})
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  getClothType1(cTypeId) {
    return this.http.get(`${this.apiUrl}/clothType/search?cTypeId=${cTypeId}`)
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  insertCloth(data) {
    return this.http.post(`${this.apiUrl}/cloth/`, {data})
    .toPromise()
    .then(result => result)
    .catch(error => error);
  }

  updateCloth(data) {
    return this.http.post(`${this.apiUrl}/cloth/update`, {data})
    .toPromise()
    .then(result => result)
    .catch(error => error);
  }
}
