import { Injectable, Inject } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ImportDetailAmountService {

  constructor(private http: HttpClient, @Inject('API_URL') private apiUrl) {}

  getImportDetailAmount() {
    return this.http.get(`${this.apiUrl}/importDetailAmount/`, {})
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  insertImportDetailAmount(data) {
    return this.http.post(`${this.apiUrl}/importDetailAmount/`, {data})
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

}
