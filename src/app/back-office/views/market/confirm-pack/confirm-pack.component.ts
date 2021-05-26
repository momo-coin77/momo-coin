import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-confirm-pack',
  templateUrl: './confirm-pack.component.html',
  styleUrls: ['./confirm-pack.component.css']
})
export class ConfirmPackComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  
  pop() {
    // setTimeout(() =>{
  // console.log("teste pop");
    return confirm("Press a button!");
  // }, 3000);
  }
}
