import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { MainService } from './main.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private mainService: MainService
  ) { }

  async canActivate() {
    const result = await this.mainService.decodeToken();
    if (result) {
      return true;
    } else {
      return false;
    }
  }

}
