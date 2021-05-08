import {Component, OnDestroy} from '@angular/core';

@Component({
  selector: 'app-confirm-payment',
  templateUrl: 'confirm-Payment.component.html',
  styleUrls: ['confirm-Payment.component.scss']
})
export class ConfirmPaymentComponent {
  currency: string = 'XAF';
  amount: number = 5000;
}
