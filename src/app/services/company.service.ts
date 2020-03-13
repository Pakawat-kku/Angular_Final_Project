import { Injectable, Inject } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';
import { MainService } from './main.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(
    private http: HttpClient,
    @Inject('API_URL') private apiUrl,
    private mainService: MainService
    ) {}

  getCompany() {
    return this.http.get(`${this.apiUrl}/company/`, {})
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  async insertCompany(data) {
    const headers: any = await this.mainService.getHeader();
    return this.http.post(`${this.apiUrl}/company/`, { data }, { headers })
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

  async updateCompany(data) {
    const headers: any = await this.mainService.getHeader();
    return this.http.post(`${this.apiUrl}/company/update`, { data }, { headers })
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }
}
