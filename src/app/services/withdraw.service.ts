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

  getWithdraw() {
    return this.http.get(`${this.apiUrl}/withdraw/`, {})
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

  changeActiveOff(withdrawCode) {
    return this.http.post(`${this.apiUrl}/withdraw/changeActiveOff`, { withdrawCode })
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  statusWithdraw(withdrawCode) {
    return this.http.post(`${this.apiUrl}/withdraw/statusWithdraw`, { withdrawCode })
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

  searchByDateDetail(wardId) {
    return this.http.post(`${this.apiUrl}/withdraw/searchByDateDetail`, { wardId })
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

  searchByCode(withdrawCode, dateSearch1, dateSearch2) {
    return this.http.post(`${this.apiUrl}/withdraw/searchByCode`, { withdrawCode, dateSearch1, dateSearch2 })
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  getByReq(requisitionCode) {
    return this.http.post(`${this.apiUrl}/withdraw/getByReq`, { requisitionCode })
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  getDetailByCode(Withdraw_withdrawCode) {
    return this.http.post(`${this.apiUrl}/withdrawDetail/byCode`, { Withdraw_withdrawCode })
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  getDetailRoundByCode(Withdraw_withdrawCode, round) {
    return this.http.post(`${this.apiUrl}/withdrawDetail/roundByCode`, { Withdraw_withdrawCode, round })
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  updateRoundCode(round, withdrawCode) {
    return this.http.post(`${this.apiUrl}/withdraw/updateRoundCode`, { round, withdrawCode })
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  getWithdrawByCodeNapkin(withdrawCode) {
    return this.http.post(`${this.apiUrl}/withdraw/getByCodeNapkin`, { withdrawCode })
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  getDetailRoundByCodeUser(Withdraw_withdrawCode) {
    return this.http.post(`${this.apiUrl}/withdrawDetail/getRoundByCodeUser`, { Withdraw_withdrawCode })
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  checkPerMonth(date1, date2) {
    return this.http
      .post(`${this.apiUrl}/withdraw/checkMonth`, { date1, date2 })
      .toPromise()
      .then(result => result)
      .catch(err => err);
  }

}
