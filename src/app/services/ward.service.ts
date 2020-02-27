import { Injectable, Inject } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WardService {



  constructor(private http: HttpClient, @Inject('API_URL') private apiUrl) { }


  getAllWard() {
    return this.http.get(`${this.apiUrl}/ward/`, {})
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  insertWard(data) {
    return this.http.post(`${this.apiUrl}/ward/insertWard`, {data})
    .toPromise()
    .then(result => result)
    .catch(error => error);
  }

  updateWard(data) {
    return this.http.post(`${this.apiUrl}/ward/updateWard`, {data})
    .toPromise()
    .then(result => result)
    .catch(error => error);
  }

  searchWard(searchWard) {
    return this.http.post(`${this.apiUrl}/ward/searchward`, { searchWard})
        .toPromise()
        .then(result => result)
        .catch(err => err);
  }

  deleteWard(data) {
    return this.http.post(`${this.apiUrl}/ward/deleteWard`, {data})
        .toPromise()
        .then(result => result)
        .catch(err => err);
  }

  printPdfWard() {
    return this.http.get(`${this.apiUrl}/test/ward`, {})
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }
}
