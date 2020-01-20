import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WardService {

  constructor(private http: HttpClient, @Inject('API_URL') private apiUrl) { }
  getWard() {
    return this.http.get(`${this.apiUrl}/ward`, {  })
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  insertWard(data) {
    return this.http.post(`${this.apiUrl}/ward`, {data})
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }
}
