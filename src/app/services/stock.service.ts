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

  getClothType1(clothTypeId) {
    return this.http.get(`${this.apiUrl}/clothType/search?ClothType_clothTypeId=${clothTypeId}`)
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
  getClothById(clothId) {
    return this.http.post(`${this.apiUrl}/cloth/getClothById`, {clothId})
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

  getSearch(search) {
    return this.http.post(`${this.apiUrl}/cloth/search`, {search})
    .toPromise()
    .then(result => result)
    .catch(error => error);
  }

  getStock() {
    // return this.http.get(`${this.url}/get-annouce/${month}/${year}`)
    return this.http
      .get(`${this.apiUrl}/cloth/stock/`, {})
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }
}
