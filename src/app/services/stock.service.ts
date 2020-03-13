import { Injectable, Inject } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';
import { MainService } from './main.service';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  constructor(
    private http: HttpClient,
    @Inject('API_URL') private apiUrl,
    private mainService: MainService
  ) { }

  async getCloth() {
    const headers: any = await this.mainService.getHeader();
    return this.http.get(`${this.apiUrl}/cloth/`, { headers })
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  getClothType() {
    return this.http.get(`${this.apiUrl}/clothType/`, {})
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  getClothType1(clothTypeId) {
    return this.http.get(`${this.apiUrl}/clothType/search?ClothType_clothTypeId=${clothTypeId}`)
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  async insertCloth(data) {
    const headers: any = await this.mainService.getHeader();
    return this.http.post(`${this.apiUrl}/cloth/`, { data }, { headers })
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  updateCloth(data) {
    return this.http.post(`${this.apiUrl}/cloth/update`, { data })
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  getSearch(search) {
    return this.http.post(`${this.apiUrl}/cloth/search`, { search })
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  getStock() {
    // return this.http.get(`${this.url}/get-annouce/${month}/${year}`)
    return this.http
      .get(`${this.apiUrl}/cloth/stock/`, {})
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }
}
