import { Injectable, Inject } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WareHouseService {

  constructor(private http: HttpClient, @Inject('API_URL') private apiUrl) {}


  getWareHouse(clothId) {
    return this.http.post(`${this.apiUrl}/wareHouse/`, {clothId})
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  getAllWareHouse() {
    return this.http.post(`${this.apiUrl}/wareHouse/allWarehouse`, {})
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

  insertWareHouse(data) {
    return this.http.post(`${this.apiUrl}/wareHouse/insertWareHouse`, {data})
    .toPromise()
    .then(result => result)
    .catch(error => error);
  }

  updateWareHouse(clothId , data) {
    return this.http.post(`${this.apiUrl}/wareHouse/updateWareHouse`, {clothId , data})
    .toPromise()
    .then(result => result)
    .catch(error => error);
  }

  getSearch(search) {
    return this.http.post(`${this.apiUrl}/wareHouse/search`, {search})
    .toPromise()
    .then(result => result)
    .catch(error => error);
  }
}
