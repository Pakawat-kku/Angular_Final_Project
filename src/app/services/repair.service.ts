import { Injectable, Inject } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class RepairService {
  constructor(private http: HttpClient, @Inject('API_URL') private apiUrl) {}

  getRepair() {
    return this.http.get(`${this.apiUrl}/repair/`, {})
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  sumByClothId(clothId) {
    return this.http.post(`${this.apiUrl}/repair/sumByClothId`, {clothId})
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  getByClothId(clothId) {
    return this.http.post(`${this.apiUrl}/repair/getByClothId`, {clothId})
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  insertRepair(data) {
    return this.http.post(`${this.apiUrl}/repair/`, {data})
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  searchByDate(dateSearch1, dateSearch2) {
    return this.http.post(`${this.apiUrl}/repair/searchByDate`, { dateSearch1, dateSearch2 })
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

}
