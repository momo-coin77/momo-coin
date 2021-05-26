
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class SponsorService {
    constructor(
        private router: Router) {
    }

    getSponsorId() {
        let href = this.router.url;
        let tab = href.split('/');
    // console.log(tab[2]);
        return tab[2];
    }
}