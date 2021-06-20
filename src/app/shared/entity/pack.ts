import { Entity, purgeAttribute } from './entity';
import { EntityID } from './EntityID';

export const MIN_RETREIVAL_BONUS =15000;


export enum PackState {
    ON_MARKET = 'on_market',
    NOT_ON_MARKET = 'not_on_market',
}

export enum PackBuyState {
    ON_WAITING_BUYER = 'on_waiting_buyer',
    ON_WAITING_CONFRMATION_FOR_SELL = 'on_waiting_confirmation_for_sell',
    ON_WAITING_SELLER_CONFIRMATION_PAIEMENT = 'on_waiting_seller_confirmation_paiement',
    ON_WAITING_BUYER_CONFIRMATION_PAIEMENT = 'on_waiting_buyer_confirmation',
    ON_END_SEL = 'on_end_sel'
}

export interface PackGain {
    pourcent?: number;
    jour?: number;
}
export const gainConfig={
    "5":15,
    "10":35,
    "20":85
}

// pack representation
export class Pack extends Entity {

    amount: number = 0; // montant du pack
    bonusAmount: number = 0;
    nextAmount: number = 0; // montant a obtenir apres mise sur le marché
    payDate: string = ""; // date de l'achat
    saleDate: string = ""; // date de mise sur le marché (new Date()).toISOString();
    plan: number=0; // plan de l'achat ( 5 pour 5 jour, 10 pour 10 jours ...)
    idOwner: EntityID = new EntityID();
    buyState: PackBuyState = PackBuyState.ON_WAITING_BUYER;
    idBuyer: EntityID = new EntityID();
    state: PackState = PackState.NOT_ON_MARKET;
    wantedGain : PackGain={pourcent:0,jour:0};
    maxPayDate:String="";

    getBuyState() {
        switch (this.buyState) {
            case PackBuyState.ON_WAITING_BUYER:
                return 'Waiting for buyer';
        }
        return '';
    }
    hydrate(entity: Record<string | number, any>): void {
        for (const key of Object.keys(entity)) {
            if (Reflect.has(this, key)) {
                if (key == 'id') { this.id.setId(entity.id); }
                else if (key == 'idOwner') { this.idOwner.setId(entity.idOwner); }
                else if (key == 'idBuyer') { this.idBuyer.setId(entity.idBuyer); }
                else if(key == "wantedGain") 
                {
                    let r={};
                    if(entity[key].pourcent) r["pourcent"]=entity[key].pourcent;
                    if(entity[key].jour) r["jour"]=entity[key].jour;
                    this.wantedGain=r;
                }
                else { Reflect.set(this, key, entity[key]); }
            }
        }
    }

    toString(): Record<string | number, any> {
        let r = {};
        for (const k of Object.keys(this)) {
            if (k == 'id') { r[k] = this.id.toString(); }
            else if (k == 'idOwner') { r[k] = this.idOwner.toString(); }
            else if (k == 'idBuyer') { r[k] = this.idBuyer.toString(); }
            else if(k == 'wantedGain ') r[k]={pourcent:this.wantedGain.pourcent,jour:this.wantedGain.jour}
            else { r[k] = Reflect.get(this, k); }
        }
        return r;
    }
}

export class ReceiverPayment extends Entity {
    public name: String = '';
    public contact: String = '';
    public parttypesupplied: String = '';
}


export function packBuilder(entity: Record<string, any>): Pack {
    let pck: Pack = null;
    if (entity.options) {
        pck.hydrate(entity);
    }
// console.log('Hydrated pack ', pck);
    return pck;
}
