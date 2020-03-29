import { Users } from './../modules/main/register/users';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { MainService } from './main.service';


@Injectable({ providedIn: 'root' })

export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<Users>;
    public currentUser: Observable<Users>;
    private router: Router;

    constructor(
        private http: HttpClient,
        private alertService: AlertService,
        private mainService: MainService
    ) {
        this.currentUserSubject = new BehaviorSubject<Users>(JSON.parse(sessionStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): Users {
        return this.currentUserSubject.value;
    }

    login(username, password) {
        return this.http.post<any>(`http://203.157.88.89:3000/login/login`, { username, password })
            .pipe(map(async (users) => {
                // login successful if there's a jwt token in the response
                console.log('user', users);

                if (users && users.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    sessionStorage.setItem('currentUser', JSON.stringify(users));
                    const token = await this.mainService.tokenName;
                    sessionStorage.setItem(token, users.token);
                    this.currentUserSubject.next(users);
                } else {
                    this.alertService.error('username หรือ password ไม่ถูกต้อง');
                    this.router.navigate(['/login/login-page']);
                }
                return users;
            }));
    }


    logout() {
        // remove user from local storage and set current user to null
        sessionStorage.clear();
        // sessionStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
}
