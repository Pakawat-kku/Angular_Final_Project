import { Injectable, Inject } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthorityService {

  constructor(private http: HttpClient, @Inject('API_URL') private apiUrl) {}

  getAuthority() {
    return this.http.get(`${this.apiUrl}/authority/`, {})
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  insertAuthority(data) {
    return this.http.post(`${this.apiUrl}/authority/`, {data})
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  updateAuthority(data) {
    return this.http.post(`${this.apiUrl}/authority/update`, {data})
    .toPromise()
    .then(result => result)
    .catch(error => error);
  }
}
