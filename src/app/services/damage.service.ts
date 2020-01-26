import { Injectable, Inject } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class DamageService {
  constructor(private http: HttpClient, @Inject('API_URL') private apiUrl) {}

  getDamage() {
    return this.http.get(`${this.apiUrl}/damage/`, {})
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  sumByClothId(clothId) {
    return this.http.post(`${this.apiUrl}/damage/sumByClothId`, {clothId})
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  getByClothId(clothId) {
    return this.http.post(`${this.apiUrl}/damage/getByClothId`, {clothId})
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  insertDamage(data) {
    return this.http.post(`${this.apiUrl}/damage/`, {data})
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

}
