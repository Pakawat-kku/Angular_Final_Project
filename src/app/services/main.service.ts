import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MainService {
  token = sessionStorage.getItem('token');
  tokenName = 'currentUser';
  jwtHelper: JwtHelperService = new JwtHelperService();

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  getIP() {
    return this.http.get(`https://api.ipify.org?format=json`)
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  getToken() {
    return sessionStorage.getItem(this.tokenName) || localStorage.getItem(this.tokenName);
  }

  async decodeToken() {
    const token = await this.getToken();
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      return this.jwtHelper.decodeToken(token);
    } else {
      this.router.navigate(['/login']);
    }
  }

}
