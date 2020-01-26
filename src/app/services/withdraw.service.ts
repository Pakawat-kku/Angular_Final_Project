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

  getDetailById(Withdraw_withdrawId, round) {
    return this.http.post(`${this.apiUrl}/withdrawDetail/byId`, { Withdraw_withdrawId, round })
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  getDetailByCloth(Withdraw_withdrawId, Cloth_clothId, round) {
    return this.http.post(`${this.apiUrl}/withdrawDetail/byCloth`, { Withdraw_withdrawId, Cloth_clothId, round })
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  getDetailRound(Withdraw_withdrawId) {
    return this.http.post(`${this.apiUrl}/withdrawDetail/getRound`, { Withdraw_withdrawId })
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

  updateRound(round, withdrawId) {
    return this.http.post(`${this.apiUrl}/withdraw/updateRound`, { round, withdrawId })
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  getWithdrawByUserId(userId) {
    return this.http.post(`${this.apiUrl}/withdrawDetail/getWithdrawByUserId`, { userId })
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  searchByDate(dateSearch1, dateSearch2) {
    return this.http.post(`${this.apiUrl}/withdraw/searchByDate`, { dateSearch1, dateSearch2 })
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  searchByWard(wardId, dateSearch1, dateSearch2) {
    return this.http.post(`${this.apiUrl}/withdraw/searchByWard`, { wardId, dateSearch1, dateSearch2 })
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

}
