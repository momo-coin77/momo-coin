import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../shared/service/user/user.service';
import { MustMatch } from '../../shared/service/_helpers/must-match.validator';
import { NotificationService } from '../../shared/service/notification/notification.service';
import { User } from '../../shared/entity/user';
import { AuthService } from '../../shared/service/auth/auth.service';


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
        private authService: AuthService, // firebase auth
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
            'sponsorshipId': [''],
            'phone': ['', [
                Validators.minLength(5),
                Validators.pattern("^6[0-9]{2}-[0-9]{2}-[0-9]{2}-[0-9]{2}$")]],
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

        user.city = this.registerForm.controls.city.value;
        user.phone = `${this.registerForm.controls.phone.value}`;
        user.sponsorshipId=this.registerForm.controls.sponsorshipId.value;
        user.network = this.registerForm.controls.network.value;
        user.user_agree=true;
        return user;
    }

    onSubmit(data) {
        this.submitted = true;

        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }
        this.waitingRegistration = true;
            let user: User = this.setFormData();
            this.authService.signInNewUser(user)
            .then((result) => {
                    this.router.navigate(['login']);
                    this.notification.showNotification('top', 'center', 'success', '', '\<b>Success !\</b>\<br>Account created successfully');
                    this.waitingRegistration = false;
                    this.submitted = false;

                })
                .catch((error) => {
                    this.waitingRegistration = false;
                    this.notification.showNotification('top', 'center', 'danger', 'pe-7s-close-circle', '\<b>Sorry !\</b>\<br>'+error.message);
                    this.submitted = false;
                });

    }

}
