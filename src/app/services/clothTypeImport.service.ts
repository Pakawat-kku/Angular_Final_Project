import { Injectable, Inject } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ClothTypeImportService {

  constructor(private http: HttpClient, @Inject('API_URL') private apiUrl) { }

  getClothTypeImport() {
    return this.http.get(`${this.apiUrl}/clothTypeImport/`, {})
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

}
