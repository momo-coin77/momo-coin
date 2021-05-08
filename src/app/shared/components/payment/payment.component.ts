import { Component, OnInit } from '@angular/core';
import { Provider, User } from '../../../shared/entity/provider';
import { AuthService } from '../../../shared/service/auth/auth.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  userPhone: String = '';
  userCountry: String = '';
  cameroon: boolean = false;
  gabon: boolean = false;
  nigeria: boolean = false;
  southAfrica: boolean = false;

  constructor(private authService: AuthService) { }

  ngOnInit() {

    this.authService.currentUserSubject.subscribe((user: Provider) => {
      this.userPhone = user.adresse.phone;
      this.userCountry = user.adresse.country;
    });
    if (this.userCountry == 'Cameroon') {
      this.cameroon = true;
    }
    if (this.userCountry == 'Gabon') {
      this.gabon = true;
    }
    if (this.userCountry == 'Nigeria') {
      this.nigeria = true;
    }
    if (this.userCountry == 'South Africa') {
      this.southAfrica = true;
    }
  }
}
