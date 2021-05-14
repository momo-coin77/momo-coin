import { Component, OnInit } from '@angular/core';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { interval, Subscription } from 'rxjs';

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  private updateSubscription: Subscription;
  activeUser: number; // valeur fictive du nombre d'utilisateurs en ligne.
  stockholders: number = 27;  // valeur fictive du nombre total d'utilisateurs. créé la
  // fonctionnalité dans les service (utilisable par la suite dans admin) mais laisser ici fictif.
  balence: number = 0; // somme de toutes les montants de chaqueq pack avec son id
  bonusBalence: number = 0; // Bonus de pa
  saleBalence: number = 0;

  constructor() {
  }

  randomNumber(m?: number, k?: number, c?: number) {
    if (!m) { m = 100; }
    // if (!k) { k = 0; }
    // if (!c) { c = 0; }
    let mm = Math.floor((Math.random() * m) + 1);
    // let kk = Math.floor((Math.random() * k) + 1);
    // let cc = Math.floor((Math.random() * c) + 1);
    let d = new Date();
    let val = 10
    let hh = d.getHours();
    if (hh > 21) {
      val = 10;
    }
    if (hh < 7) {
      val = 5;
    }
    let number = val + mm;
    console.log('random: ' + number);
    return number;
  }

  ngOnInit(): void {
    this.updateSubscription = interval(8000).subscribe(
      (val) => {
        this.activeUser = this.randomNumber(10);
      });
  }
}
