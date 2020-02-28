import { Injectable, Inject } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AvailableService {

  constructor(private http: HttpClient, @Inject('API_URL') private apiUrl) {}

  getAvailable(clothId) {
    return this.http.post(`${this.apiUrl}/available/`, {clothId})
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

  insertAvailable(data) {
    return this.http.post(`${this.apiUrl}/available/insertAvailable`, {data})
    .toPromise()
    .then(result => result)
    .catch(error => error);
  }

  updateAvailable(clothId , data) {
    return this.http.post(`${this.apiUrl}/available/updateAvailable`, {clothId , data})
    .toPromise()
    .then(result => result)
    .catch(error => error);
  }

  getSearch(search) {
    return this.http.post(`${this.apiUrl}/available/search`, {search})
    .toPromise()
    .then(result => result)
    .catch(error => error);
  }
}
