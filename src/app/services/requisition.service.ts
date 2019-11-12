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

showReq(userId) {
  // return this.http.get(`${this.url}/get-annouce/${month}/${year}`)
  return this.http.get(`http://localhost:3001/req/showReq?userId=${userId}`)
  .toPromise()
  .then(result => result)
  .catch(error => error);
}

showReqWait(wardId) {
  // return this.http.get(`${this.url}/get-annouce/${month}/${year}`)
  return this.http.get(`http://localhost:3001/req/showReqWait?wardId=${wardId}`)
  .toPromise()
  .then(result => result)
  .catch(error => error);
}

updateReq(clothId , data) {
  return this.http.post(`http://localhost:3001/req/updateReq`, { clothId , data })
      .toPromise()
      .then(result => result)
      .catch(err => err);
}

updateRealReq(reqId, data) {
  return this.http.post(`http://localhost:3001/req/updateRealReq`, {reqId, data })
      .toPromise()
      .then(result => result)
      .catch(err => err);
}

deleteReq(Cloth_clothId) {
  return this.http.post(`http://localhost:3001/req/deleteReq`, { Cloth_clothId })
      .toPromise()
      .then(result => result)
      .catch(err => err);
}

deleteRealReq(reqId) {
  return this.http.post(`http://localhost:3001/req/deleteRealReq`, { reqId })
      .toPromise()
      .then(result => result)
      .catch(err => err);
}

deleteReqNull(userId) {
  return this.http.post(`http://localhost:3001/req/deleteReqNull`, { userId })
      .toPromise()
      .then(result => result)
      .catch(err => err);
}

// deleteReqNullAmount() {
//   return this.http.post(`http://localhost:3001/req/deleteReqNullAmount`, { })
//       .toPromise()
//       .then(result => result)
//       .catch(err => err);
// }

}
