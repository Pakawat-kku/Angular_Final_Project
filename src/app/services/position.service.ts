import { Injectable, Inject } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PositionService {

  constructor(private http: HttpClient, @Inject('API_URL') private apiUrl) { }

  getPosition() {
    return this.http.get(`${this.apiUrl}/position`, {  })
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  insertPosition(data) {
    return this.http.post(`${this.apiUrl}/position`, {data})
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }
}
