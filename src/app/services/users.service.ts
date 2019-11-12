import { Injectable, Inject } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';
import { Users } from '../modules/main/register/users';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient, @Inject('API_URL') private apiUrl) {}

  insertUsers(data) {
    return this.http.post(`http://localhost:3001/users/insertUsers`, {data})
    .toPromise()
    .then(result => result)
    .catch(error => error);
  }

  register(user: Users) {
    return this.http.post(`auth/register`, user);
    }
}
