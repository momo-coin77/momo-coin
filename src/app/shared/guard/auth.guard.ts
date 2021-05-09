import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import { User } from '../entity/user';
import { AuthentificationService } from '../service/auth/authentification.service';
import { UserService } from '../service/user/user.service';

function myFunction(f: string) {
    alert('Hello! Only an administrator can access this! ' + f);
}

@Injectable()
export class AuthGuard implements CanActivate {
    currentUser: User;
    constructor(private router: Router,private authService: AuthentificationService) {
    }

    canActivate() {
        if (this.authService.isLoggedIn) return true;
        this.router.navigateByUrl('/login');
        return false;
    }

    canActivateChild() {
        if (this.authService.isLoggedIn) {
            // if(this.currentUser.user.title_role != "administrator"){
            if (true) {
                // console.log(this.currentUser.user.title_role);
                // myFunction(this.currentUser.titleRole);
                return;
            }
            return true;
        }

        this.router.navigate(['/login']);
        return false;
    }
}