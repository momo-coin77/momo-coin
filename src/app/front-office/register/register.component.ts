import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../shared/service/user/user.service';
import { AuthentificationService } from '../../shared/service/auth/authentification.service';
import { MustMatch } from '../../shared/service/_helpers/must-match.validator';
import { User } from '../../shared/model/user';
import { NotificationService } from '../../shared/service/notification/notification.service';


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
        private fireAuthService: AuthentificationService, // firebase auth
        private formBuilder: FormBuilder,
        private userService: UserService,
        private router: Router,
        private formLog: FormBuilder,
        private notification: NotificationService) {
    }

    ngOnInit(): void {
        this.registerForm = this.formBuilder.group({
            'name': ['', Validators.required],
            'user_agree': [false, Validators.requiredTrue],
            'country': ['', Validators.required],
            'city': ['', Validators.required],
            'network': ['', Validators.required],
            'sponsorshipId': ['', Validators.required],
            'phone': ['', [Validators.required, Validators.minLength(9)]],
            'password': ['', [Validators.required, Validators.minLength(6)]],
            'password2': ['', Validators.required],
            'email': ['', [Validators.required, Validators.email]],

        }, {
            validator: MustMatch('password', 'password2')
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
        user.name = this.registerForm.controls.name?.value;
        user.email = this.registerForm.controls.email?.value;
        user.password = this.registerForm.controls.password?.value;
        user.country = this.registerForm.controls.country?.value;

        user.city = this.registerForm.controls.city?.value;
        user.phone = this.registerForm.controls.phone?.value;
        return user;
    }

    onSubmit(data) {
        this.submitted = true;
        this.waitingRegistration = false;

        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }
        this.waitingRegistration = true;
            // let user: User = this.setFormData();
            this.fireAuthService.signUp(new User(data.email, data.password,data.nom))
            // this.fireAuthService.signUp(new User(data.email, tdata.password)
            .then((result) => {
                    this.messageColor = 'green';
                    this.registrationMessage = 'Success';
                    this.router.navigate(['login']);
                    this.notification.showNotification('top', 'center', 'danger', 'pe-7s-close-circle', '\<b>Sorry !\</b>\<br>The server is temporarily unavailable, please try again later.');
                    this.submitted = false;

                })
                .catch((error) => {
                    this.waitingRegistration = false;
                    this.messageColor = 'red';
                    this.registrationMessage = error.message;
                    this.notification.showNotification('top', 'center', 'danger', 'pe-7s-close-circle', '\<b>Sorry !\</b>\<br>The server is temporarily unavailable, please try again later.');
                    this.submitted = false;
                });

    }

}
