import { Injectable, Inject } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  constructor(private http: HttpClient, @Inject('API_URL') private apiUrl) { }

  insertPurchase(data) {
    return this.http.post(`${this.apiUrl}/purchase/`, { data })
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  insertPurchaseDetail(data) {
    return this.http.post(`${this.apiUrl}/purchaseDetail/`, { data })
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  getPurchaseDetailById(purchaseId) {
    return this.http.post(`${this.apiUrl}/purchaseDetail/getById`, { purchaseId })
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  getPurchaseById(purchaseId) {
    return this.http.post(`${this.apiUrl}/purchase/getById`, { purchaseId })
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  getPurchase(totalPrice, purchaseDate) {
    return this.http.post(`${this.apiUrl}/purchase/get`, { totalPrice, purchaseDate })
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  getAllPurchase() {
    return this.http.get(`${this.apiUrl}/purchase/`, {})
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

}
