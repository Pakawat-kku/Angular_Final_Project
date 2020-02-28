import { Injectable, Inject } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsersAuthorityService {

  constructor(private http: HttpClient, @Inject('API_URL') private apiUrl) {}

  get() {
    return this.http.get(`${this.apiUrl}/users_authority/`, {})
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  getById(Users_userId) {
    return this.http.post(`${this.apiUrl}/users_authority/getById`, {Users_userId})
    .toPromise()
    .then(result => result)
    .catch(error => error);
  }

  insert(data) {
    return this.http.post(`${this.apiUrl}/users_authority/`, {data})
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  update(data) {
    return this.http.post(`${this.apiUrl}/users_authority/update`, {data})
    .toPromise()
    .then(result => result)
    .catch(error => error);
  }

  cancel(Users_userId) {
    return this.http.post(`${this.apiUrl}/users_authority/cancel`, {Users_userId})
    .toPromise()
    .then(result => result)
    .catch(error => error);
  }

  cancelById(Users_userId, Authority_aId) {
    return this.http.post(`${this.apiUrl}/users_authority/cancelById`, {Users_userId, Authority_aId})
    .toPromise()
    .then(result => result)
    .catch(error => error);
  }
}
