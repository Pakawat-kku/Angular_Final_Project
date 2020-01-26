import { Injectable, Inject } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ImportDetailWeightService {

  constructor(private http: HttpClient, @Inject('API_URL') private apiUrl) { }

  insertImportDetailWeight(data) {
    return this.http.post(`${this.apiUrl}/importDetailWeight/`, { data })
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  showImportDetailWeight(importCode) {
    return this.http.post(`${this.apiUrl}/importDetailWeight/showImportDetailWeight`, { importCode })
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }
}
