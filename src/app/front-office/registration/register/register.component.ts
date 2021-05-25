import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { SponsorID } from '../../../shared/entity/sponsorid';
import { User } from '../../../shared/entity/user';
import { AuthService } from '../../../shared/service/auth/auth.service';
import { NotificationService } from '../../../shared/service/notification/notification.service';
import { SponsorService } from '../../../shared/service/sponsoring/sponsoring.service';
import { UserService } from '../../../shared/service/user/user.service';
import { MustMatch } from '../../../shared/service/_helpers/must-match.validator';


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
    sponsorId: string;
    i = 0; // my variable to condition the number of execution of the submit at 01 time

    constructor(
        private authService: AuthService, // firebase auth
        private formBuilder: FormBuilder,
        private userService: UserService,
        private router: Router,
        private formLog: FormBuilder,
        private sponsort: SponsorService,
        private notification: NotificationService) {
        this.getSponsorId();
    }

    ngOnInit(): void {
        this.registerForm = this.formBuilder.group({
            'name': new FormControl('', [Validators.required]),
            'user_agree': new FormControl(false, [Validators.requiredTrue]),
            'country': new FormControl('', [Validators.required]),
            'city': new FormControl('', [Validators.required]),
            'network': new FormControl('', [Validators.required]),
            'sponsorshipId': new FormControl(''),
            'phone': new FormControl('', [Validators.minLength(9), Validators.maxLength(9), Validators.pattern('^6[0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}$')]),
            'password': new FormControl('', [Validators.required, Validators.minLength(6)]),
            'password2': new FormControl('', [Validators.required]),
            'email': new FormControl('', [Validators.required, Validators.email]),

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

    getSponsorId() {
        this.sponsorId = this.sponsort.getSponsorId();
    }

    setFormData(): User {
        let user: User = new User();
        user.name = this.registerForm.value.name;
        user.email = this.registerForm.value.email;
        user.password = this.registerForm.value.password;
        user.country = this.registerForm.value.country;

        user.city = this.registerForm.value.city;
        user.phone = `${this.registerForm.value.phone}`;
        user.mySponsorShipId.setId(SponsorID.generateId(user).toString());
        user.parentSponsorShipId.setId(this.registerForm.value.sponsorshipId);
        user.network = this.registerForm.value.network;
        user.user_agree = true;
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
                // tslint:disable-next-line:max-line-length
                this.notification.showNotification('top', 'center', 'success', '', '\<b>Success !\</b>\<br>Account created successfully! <br>To confirm the validity of your account you have 5 hours to make your first purchase of stocks or your account will be automatically deleted.', 10000);
                this.waitingRegistration = false;
                this.submitted = false;

            })
            .catch((error) => {
                this.waitingRegistration = false;
                // tslint:disable-next-line:max-line-length
                this.notification.showNotification('top', 'center', 'danger', 'pe-7s-close-circle', '\<b>Sorry !\</b>\<br>' + error.message);
                this.submitted = false;
            });

    }

}