import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {

  user: any;

  constructor (private router: Router) {}

  ngOnInit(): void {
    this.user = localStorage.getItem('user-data');
    if (this.user) {
          this.router.navigate(['dashboard']);
    }
  }


  // renvoi a la page de creation de compte
  registration() {
    this.router.navigate(['/register']);
  }


}
