import { Injectable, Inject } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ImportDetailWeightSumService {

  constructor(private http: HttpClient, @Inject('API_URL') private apiUrl) { }

  insertImportDetailWeightSum(data) {
    return this.http.post(`${this.apiUrl}/importDetailWeightSum/`, { data })
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  showImportDetailWeightSum(importCode) {
    return this.http.post(`${this.apiUrl}/importDetailWeightSum/showImportDetailWeightSum`, { importCode })
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }
}
