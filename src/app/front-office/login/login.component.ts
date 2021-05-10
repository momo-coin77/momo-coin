import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../shared/model/user';
import { AuthentificationService } from '../../shared/service/auth/authentification.service';
import { NotificationService } from '../../shared/service/notification/notification.service';
import { UserService } from '../../shared/service/user/user.service';


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    submitted: boolean = false;
    loginForm: FormGroup;
    waitingRegistration: boolean = false;
    user: any;

    constructor(
        private fireAuthService: AuthentificationService, // firebase auth
        private router: Router,
        // private authen: AuthService,
        private formLog: FormBuilder,
        private userData: UserService,
        private notification: NotificationService) {
    }

    ngOnInit(): void {
        this.user = localStorage.getItem('user-data');
        this.loginForm = this.formLog.group({
            'email': ['', [Validators.required, Validators.email]],
            'password': ['', [Validators.required, Validators.minLength(6)]]
        });
        this.waitingRegistration = false;
    }

    get f() {
        return this.loginForm.controls;
    }

    navigateToRegister() {
        this.router.navigate(['/registration']);
    }

    navigateToForgot() {
        this.router.navigate(['/forgot-password']);
    }

    submit(data) {
        this.submitted = true;
        this.waitingRegistration = false;
        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }
        this.waitingRegistration = true;
        this.fireAuthService.signIn(new User(data.email, data.password))
            .then((result) => {
                this.router.navigate(['/dashboard']);
                this.submitted = false;

            })
            .catch((error) => {
                if (error == '[object Object]') {
                    console.log('error 1: ' + error);
                    this.waitingRegistration = false;
                    this.notification.showNotification('top', 'center', 'danger', 'pe-7s-close-circle', '\<b>Sorry !\</b>\<br>Email or password is incorrect.');
                    this.submitted = false;
                } else {
                    console.log('error 2: ' + error);
                    this.waitingRegistration = false;
                    this.notification.showNotification('top', 'center', 'danger', 'pe-7s-close-circle', '\<b>No connection\</b>\<br>Check your internet connection.');
                    this.submitted = false;

                }
            });
        this.submitted = false;
    }


}
