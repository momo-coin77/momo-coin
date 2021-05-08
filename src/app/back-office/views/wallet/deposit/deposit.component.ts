import { Component, OnInit } from '@angular/core';
import { Provider } from '../../../../shared/entity/provider';
import { AuthService } from '../../../../shared/service/auth/auth.service';

declare var $: any;

@Component({
  templateUrl: 'deposit.component.html',
  styleUrls: ['./deposit.component.scss']
})

export class DepositComponent implements OnInit {

  balence: string = '000';
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

  showNotification(from, align, colortype, icon, text) {

    $.notify({
      icon: icon,
      message: text
    }, {
      type: colortype,
      timer: 1000,
      placement: {
        from: from,
        align: align
      }
    });
  }
}
