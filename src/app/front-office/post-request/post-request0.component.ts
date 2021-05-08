import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-post-request0',
  templateUrl: './post-request0.component.html',
  styleUrls: ['./post-request0.component.scss']
})
export class PostRequest0Component implements OnInit {

  title = 'Select the type of request you need';
  post = 2;

  constructor() { }

  ngOnInit() {
  }

  initTitle() {
    if (this.post === 1) {
      this.title = 'Select the type of request you need';
    } else {
      this.title = 'Register a trip';
    }
  }
}
