import { Injectable, Inject } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RequisitionService {

  constructor(
     private http: HttpClient,
     @Inject('API_URL') private apiUrl
     ) {}

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

showReqWaitDetail(requisitionCode) {
  // return this.http.get(`${this.url}/get-annouce/${month}/${year}`)
  return this.http.get(`http://localhost:3001/req/showReqWaitDetail?requisitionCode=${requisitionCode}`)
  .toPromise()
  .then(result => result)
  .catch(error => error);
}

showReqWaitDetailOnly(requisitionCode) {
  // return this.http.get(`${this.url}/get-annouce/${month}/${year}`)
  return this.http.get(`http://localhost:3001/req/showReqWaitDetailOnly?requisitionCode=${requisitionCode}`)
  .toPromise()
  .then(result => result)
  .catch(error => error);
}

showReqWaitAdmin() {
  // return this.http.get(`${this.url}/get-annouce/${month}/${year}`)
  return this.http.get(`http://localhost:3001/req/showReqWaitAdmin/`, {})
  .toPromise()
  .then(result => result)
  .catch(error => error);
}

showReqWaitDetailAdmin(requisitionCode) {
  // return this.http.get(`${this.url}/get-annouce/${month}/${year}`)
  return this.http.get(`http://localhost:3001/req/showReqWaitDetailAdmin?requisitionCode=${requisitionCode}`)
  .toPromise()
  .then(result => result)
  .catch(error => error);
}

approveReq(requisitionCode) {
  return this.http.post(`http://localhost:3001/req/approveReq`, { requisitionCode })
      .toPromise()
      .then(result => result)
      .catch(err => err);
}

}
