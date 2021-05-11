import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../shared/entity/user';
import { AuthService } from '../../shared/service/auth/auth.service';
import { FireBaseConstant } from '../../shared/service/firebase/firebase-constant';
import { ResultStatut } from '../../shared/service/firebase/resultstatut';
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
    waitingLogin: boolean = false;

    constructor(
        private authService:AuthService,
        private router: Router,
        // private authen: AuthService,
        private formLog: FormBuilder,
        private userData: UserService,
        private notification: NotificationService) {
    }

    ngOnInit(): void {
        this.loginForm = this.formLog.group({
            'email': ['', [Validators.required, Validators.email]],
            'password': ['', [Validators.required, Validators.minLength(6)]]
        });
        this.waitingLogin = false;
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

    submit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }
        this.waitingLogin = true;
        let user:User=new User();
        user.email=this.loginForm.value.email;
        user.password=this.loginForm.value.password;

        this.authService.signIn(user)
            .then((result) => {
                this.router.navigate(['/dashboard']);
                this.submitted = false;
                this.waitingLogin =false;
            })
            .catch((error:ResultStatut) => {
                this.waitingLogin = false;
                this.notification.showNotification('top', 'center', 'danger', 'pe-7s-close-circle', '\<b>Sorry !\</b>\<br>'+error.message);
                this.submitted = false;
               
            });
    }


}
