import { Injectable, Inject } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor(private http: HttpClient, @Inject('API_URL') private apiUrl) {}

  printPDF() {
    return this.http.get(`${this.apiUrl}/pdf/wardPDF`, {})
      .toPromise()
      .then(result => result)
      .catch(error => error);
  }

}
