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

  // showReqWaitDetail(wardId, requisitionCode) {
  //   // return this.http.get(`${this.url}/get-annouce/${month}/${year}`)
  //   return this.http.get(`http://localhost:3001/req/showReqWaitDetail?wardId=${wardId}&&requisitionCode=${requisitionCode}`)
  //     .toPromise()
  //     .then(result => result)
  //     .catch(error => error);
  // }

  showReqApprove() {
    return this.http.get(`${this.apiUrl}/req/showReqApprove`, {})
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }
showReqWaitDetail(requisitionCode) {
  return this.http.post(`http://localhost:3001/req/showReqWaitDetail` , { requisitionCode })
  .toPromise()
  .then(result => result)
  .catch(error => error);
}

// showReqWaitDetail(requisitionCode) {
//   // return this.http.get(`${this.url}/get-annouce/${month}/${year}`)
//   return this.http.get(`http://localhost:3001/req/showReqWaitDetail?requisitionCode=${requisitionCode}`)
//   .toPromise()
//   .then(result => result)
//   .catch(error => error);
// }



  showReqDetailApprove(requisitionCode) {
    return this.http.post(`${this.apiUrl}/req/showReqDetailApprove`, { requisitionCode })
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

  statusWithdraw(requisitionCode) {
    return this.http.post(`${this.apiUrl}/req/statusWithdraw`, { requisitionCode })
      .toPromise()
      .then(result => result)
      .catch(err => err);
  }

  statusWithdrawSuccess(requisitionCode) {
    return this.http.post(`${this.apiUrl}/req/statusWithdrawSuccess`, { requisitionCode })
      .toPromise()
      .then(result => result)
      .catch(err => err);
  }

notApproveList(requisitionCode , clothId) {
  return this.http.post(`http://localhost:3001/req/notApproveList`, { requisitionCode, clothId })
      .toPromise()
      .then(result => result)
      .catch(err => err);
}

notApproveReq(requisitionCode) {
  return this.http.post(`http://localhost:3001/req/notApproveReq`, { requisitionCode })
      .toPromise()
      .then(result => result)
      .catch(err => err);
}

submitEdit(requisitionCode , clothId , amountCloth) {
  return this.http.post(`http://localhost:3001/req/editReq`, { requisitionCode, clothId , amountCloth})
      .toPromise()
      .then(result => result)
      .catch(err => err);
}

searchRequisition(searchWard) {
  return this.http.post(`http://localhost:3001/req/searchReq`, { searchWard})
      .toPromise()
      .then(result => result)
      .catch(err => err);
}

}
