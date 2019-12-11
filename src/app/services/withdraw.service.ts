import { Injectable, Inject } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WithdrawService {

  constructor(private http: HttpClient, @Inject('API_URL') private apiUrl) { }

  saveWithdraw(data) {
    return this.http.post(`${this.apiUrl}/withdraw/`, { data })
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  saveWithdrawDetail(data) {
    return this.http.post(`${this.apiUrl}/withdrawDetail/`, { data })
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  getWithdrawByCode(withdrawCode) {
    return this.http.post(`${this.apiUrl}/withdraw/getByCode`, { withdrawCode })
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  statusWithdraw(withdrawId) {
    return this.http.post(`${this.apiUrl}/withdraw/statusWithdraw`, { withdrawId })
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  getWithdrawByUserId(userId) {
    return this.http.post(`${this.apiUrl}/withdraw/getWithdrawByUserId`, { userId })
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

}
