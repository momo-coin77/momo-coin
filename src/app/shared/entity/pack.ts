import { Entity, purgeAttribute } from './entity';
import { EntityID } from './EntityID';

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

export class PackGain {
    pourcent: number = 0;
    jour: number = 0;
}

export class Pack5Gain extends PackGain {
    pourcent: number = 20;
    jour: number = 5;
}

export class Pack10Gain extends PackGain {
    pourcent: number = 45;
    jour: number = 10;
}

// pack representation
export class Pack extends Entity {

    amount: number = 0; // montant du pack
    nextAmount: number = 0; // montant a obtenir apres mise sur le marché
    payDate: string = ''; // date de l'achat
    saleDate: string = '' // date de mise sur le marché (new Date()).toISOString();
    plan: number; // plan de l'achat ( 5 pour 5 jour, 10 pour 10 jours ...)
    idOwner: EntityID = new EntityID();
    buyState: PackBuyState = PackBuyState.ON_WAITING_BUYER;
    idBuyer: EntityID = new EntityID();
    state: PackState = PackState.NOT_ON_MARKET;

    getBuyState()
    {
        switch(this.buyState)
        {
            case PackBuyState.ON_WAITING_BUYER:
                return "Waiting for buyer"
        }
        return "";
    }
    hydrate(entity: Record<string | number, any>): void {
        for (const key of Object.keys(entity)) {
            if (Reflect.has(this, key)) {
                if (key == 'id') { this.id.setId(entity.id); }
                else if (key == 'idOwner') { this.idOwner.setId(entity.idOwner); }
                else if (key == 'idBuyer') { this.idBuyer.setId(entity.idBuyer); }
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
    console.log('Hydrated pack ', pck);
    return pck;
}
