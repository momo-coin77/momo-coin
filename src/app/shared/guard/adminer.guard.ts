import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { AuthService } from '../service/auth/auth.service';
import { NotificationService } from '../service/notification/notification.service';

@Injectable()
export class AdminerGuard implements CanActivate {

    constructor(private authService: AuthService,
        private router: Router,
        private notif: NotificationService) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (this.authService.isAdminer) {
            return true;
        } else {
            this.notif.showNotification('top', 'center', 'danger', 'pe-7s-close-circle', '\<b>Sorry !\</b>\<br> You are not administrator');
            this.router.navigate(['/dashboard']);
        }
    }
}
