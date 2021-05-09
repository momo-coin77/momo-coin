import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../shared/service/user/user.service';
import { AuthService } from '../../shared/service/auth/auth.service';
import { AuthenticationService } from '../../shared/service/firebase/authentification.service';
import { MustMatch } from '../../shared/service/_helpers/must-match.validator';
import { User } from '../../shared/entity/provider';
import { NotificationService } from '../../shared/service/notification/notification.service';

declare var $: any;


@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
    public static currentUser: User = new User();
    submitted: boolean = false;
    registerForm: FormGroup;
    registrationMessage: String = '';
    waitingRegistration: boolean = false;
    messageColor: String = '';
    user: any;
    i = 0; // my variable to condition the number of execution of the submit at 01 time

    constructor(
        private fireAuthService: AuthenticationService, // firebase auth
        private formBuilder: FormBuilder,
        private auth: AuthService,
        private userService: UserService,
        private router: Router,
        private formLog: FormBuilder,
        private notification: NotificationService) {
    }

    ngOnInit(): void {
        this.registerForm = this.formBuilder.group({
            'field_firstname': ['', Validators.required],
            'field_surname': ['', Validators.required],
            'field_username': ['', Validators.required],
            'user_agree': [false, Validators.requiredTrue],
            'field_country': ['', Validators.required],
            'field_city': ['', Validators.required],
            'field_network': ['', Validators.required],
            'field_phone': ['', Validators.required],
            'field_password': ['', [Validators.required, Validators.minLength(6)]],
            'field_password2': ['', Validators.required],
            'field_email': ['', [Validators.required, Validators.email]],

        }, {
            validator: MustMatch('field_password', 'field_password2')
        });
    }

    get f() {
        return this.registerForm.controls;
    }

    navigateToLogin() {
        this.router.navigate(['login']);
    }

    navigateToVerifyEmail() {
        this.router.navigate(['verify-email-address']);
    }

    /////

    setFormData(): User {
        let user: User = new User();
        user.firstname = this.registerForm.controls.field_firstname?.value;
        user.lastname = this.registerForm.controls.field_surname?.value;
        user.adresse.email = this.registerForm.controls.field_email?.value;
        user.password = this.registerForm.controls.field_password?.value;
        user.adresse.country = this.registerForm.controls.field_country?.value;

        user.adresse.city = this.registerForm.controls.field_city?.value;
        user.username = this.registerForm.controls.field_username?.value;
        user.adresse.phone = this.registerForm.controls.field_phone?.value;
        return user;
    }

    onSubmit() {
        this.submitted = true;
        this.waitingRegistration = false;

        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }
        this.waitingRegistration = true;

        setTimeout(() => {
            let user: User = this.setFormData();
            this.auth.createAccount(user)
                .then((result) => {
                    this.messageColor = 'green';
                    this.registrationMessage = 'Success';
                    this.router.navigate(['login']);
                    this.notification.showNotification('top', 'center', 'danger', 'pe-7s-close-circle', '\<b>Sorry !\</b>\<br>The server is temporarily unavailable, please try again later.');
                    // this.notification.showNotification('top', 'center', 'success', 'pe-7s-like2', '\<b>succes !\</b>\<br>Your registration went well. Please log in to begin.');
                    this.submitted = false;

                })
                .catch((error) => {
                    this.waitingRegistration = false;
                    this.messageColor = 'red';
                    this.registrationMessage = error.message;
                    this.notification.showNotification('top', 'center', 'danger', 'pe-7s-close-circle', '\<b>Sorry !\</b>\<br>The server is temporarily unavailable, please try again later.');
                    // this.notification.showNotification('top', 'center', 'danger', 'pe-7s-close-circle', '\<b>Sorry !\</b>\<br>This identifier already exist');
                    this.submitted = false;
                });
            this.fireAuthService.signUp(this.registerForm.controls.field_email?.value, this.registerForm.controls.field_password?.value);

        }, 3000);

    }

}
