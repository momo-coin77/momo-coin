import { Component, OnInit } from '@angular/core';
import "materialize-css/dist/js/materialize.min"

declare var M:any;


@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css']
})
export class TabsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    console.log('Tabs ',M)
    var instance = M.Tabs.init(document.querySelectorAll('.tabs'), {duration:300});
  }

}
