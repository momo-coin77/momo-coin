import { Injectable } from '@angular/core';
import { ConfigAppService } from '../config-app/config-app.service';

@Injectable({
    providedIn: 'root'
})
export class MembershipService {
    constructor(private configAppService:ConfigAppService){}

    // amountPack : valeur du pack acheté par le user
    // iduser : id du user
    // sponsorshipId : id du parrain du user
    // amBonSponsor = amount bonus sponsor : valeur actuel argent bonus du parrain récupéré avant avec son ID
    membership(amountPack: number, amBonSponsor): number {
        let nextAmount = amountPack * this.configAppService.bonus.getValue().bonus / 100;
        let bonus = amBonSponsor + nextAmount;
        return bonus; // implémenter la fonction d'ajout de bonus au parrain


    }
}