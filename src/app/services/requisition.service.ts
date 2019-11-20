import { Injectable, Inject } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RequisitionService {

  constructor(private http: HttpClient, @Inject('API_URL') private apiUrl) { }

  insertReq(data) {
    return this.http.post(`http://localhost:3001/req/insertReq`, { data })
      .toPromise()
      .then(result => result)
      .catch(err => err);
  }

  insertRealReq(data) {
    return this.http.post(`http://localhost:3001/req/insertRealReq`, { data })
      .toPromise()
      .then(result => result)
      .catch(err => err);
  }

  showReqWait(wardId) {
    // return this.http.get(`${this.url}/get-annouce/${month}/${year}`)
    return this.http.get(`http://localhost:3001/req/showReqWait?wardId=${wardId}`)
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  showReqWaitDetail(wardId, requisitionCode) {
    // return this.http.get(`${this.url}/get-annouce/${month}/${year}`)
    return this.http.get(`http://localhost:3001/req/showReqWaitDetail?wardId=${wardId}&&requisitionCode=${requisitionCode}`)
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  showReqApprove() {
    return this.http.get(`${this.apiUrl}/req/showReqApprove`, {})
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  showReqDetailApprove(requisitionCode) {
    return this.http.post(`${this.apiUrl}/req/showReqDetailApprove`, {requisitionCode})
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

}
