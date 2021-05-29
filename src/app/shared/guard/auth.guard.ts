import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { AuthService } from '../service/auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService,
              private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean | UrlTree> | Promise<boolean> | boolean {
      return new Promise<UrlTree | boolean>((resolve,reject)=>{
        this.authService.currentUserSubject.subscribe((user)=>{
          if(this.authService.isLoggedIn)  return resolve(true);
          resolve(this.router.parseUrl("/login"))
        })
      });
  }
}
