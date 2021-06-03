import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/service/auth/auth.service';
import { NotificationService } from '../../shared/service/notification/notification.service';
// import { AuthentificationService } from 'src/app/shared/services/authentication.service';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
    user: any;
    submitted: boolean;
    source = { title: 'ENTER YOUR EMAIL ADDRESS AND RESET YOUR PASSWORD', btnText: 'Send' };
    data = [
        { controlName: 'email', type: 'email', label: 'Email', dim: 'col-md-12' },
    ]
    forgotForm: FormGroup;
    constructor(private router: Router,
        private auth: AuthService,
        private formLog: FormBuilder,
        private notif: NotificationService) { }

    ngOnInit(): void {
        this.user = localStorage.getItem('user-data');
        if (this.user) {
            this.router.navigate(['dashboard']);
        }
        this.forgotForm = this.formLog.group({
            'email': ['', Validators.compose([Validators.required])],

        });
    }

    navigateToLogin() {
        this.router.navigate(['/login']);
    }
    navigateToRegister() {
        this.router.navigate(['/register']);
    }

    submit() {
    // console.log(event)
    this.auth.SendResetPassword(this.forgotForm.value.email);
    this.navigateToLogin();
    this.notif.showNotification('top', 'center', 'success', '', '\<br>Account created successfully! <br>Check your email to reset your password.', 3000);
    }

    get f() {
        return this.forgotForm.controls;
    }
}
