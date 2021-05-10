import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-market-place',
    templateUrl: './market-place.component.html',
})

export class MarketPlaceComponent implements OnInit {

    constructor ( private router: Router){}

    ngOnInit(){
        this.router.navigate(['market/open']);
    }
}