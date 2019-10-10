import { Injectable, Inject } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RequisitionService {

  constructor(private http: HttpClient, @Inject('API_URL') private apiUrl) {}

  insertReq(data) {
    return this.http.post(`http://localhost:3001/req/insertReq`, { data })
        .toPromise()
        .then(result => result)
        .catch(err => err);
}
}
