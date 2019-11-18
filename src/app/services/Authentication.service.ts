import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';

import { Users } from '../modules/main/register/users';

@Injectable({ providedIn: 'root' })

export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<Users>;
    public  currentUser: Observable<Users>;
    private router: Router;

    constructor(
        private http: HttpClient,
        private alertService: AlertService,

    ) {
        this.currentUserSubject = new BehaviorSubject<Users>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): Users {
        return this.currentUserSubject.value;
    }

    login(username, password) {
        return this.http.post<any>(`http://localhost:3001/login/login`, { username, password })
            .pipe(map(users => {
                // login successful if there's a jwt token in the response

                if (users && users.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(users));
                    this.currentUserSubject.next(users);
                } else {
                    this.alertService.error('username หรือ password');
                    this.router.navigate(['/login/login-page']);
                }
                return users;
            }));
    }


    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
}
