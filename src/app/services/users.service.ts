import { Injectable, Inject } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';
import { Users } from '../modules/main/register/users';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient, @Inject('API_URL') private apiUrl) { }

  getUser() {
    return this.http.get(`${this.apiUrl}/users`, {})
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  getUserId(userId) {
    return this.http.post(`${this.apiUrl}/users/getUserId`, { userId })
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  searchNotApprove() {
    return this.http.get(`${this.apiUrl}/users/searchNotApprove`, {})
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  searchApprove() {
    return this.http.get(`${this.apiUrl}/users/searchApprove`, {})
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  insertUsers(data) {
    return this.http.post(`${this.apiUrl}/users`, { data })
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  approveUser(username, dateApprove) {
    return this.http.post(`${this.apiUrl}/users/approveUser`, { username, dateApprove })
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  cancelUser(username) {
    return this.http.post(`${this.apiUrl}/users/cancelUser`, { username })
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  searchByFirstname(search) {
    return this.http.post(`${this.apiUrl}/users/searchByFirstname`, { search })
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  searchByLastname(search) {
    return this.http.post(`${this.apiUrl}/users/searchByLastname`, { search })
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  searchByUsername(search) {
    return this.http.post(`${this.apiUrl}/users/searchByUsername`, { search })
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  register(user: Users) {
    return this.http.post(`auth/register`, user);
  }
}
