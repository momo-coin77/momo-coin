import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  user: any;
  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    this.user = localStorage.getItem('user-data');
    if (this.user) {
        this.router.navigate(['dashboard']);
    }
  }

  registration() {
    this.router.navigate(['register']);
  }

  login() {
    this.router.navigate(['login']);
  }

}
