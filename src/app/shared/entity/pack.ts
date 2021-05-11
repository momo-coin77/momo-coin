import { Entity, purgeAttribute } from './entity';

export enum PackageState {
    SERVICE_INIT_STATE = 'service_init_STATE',
    SERVICE_IN_DISCUSS_STATE = 'service_in_discuss_state',
    SERVICE_IN_TRANSACTION_STATE = 'service_in_transaction_state',
    SERICE_END = 'service_end'
}


// pack representation
export class Pack extends Entity {

    amount: number; // montant du pack
    payDate: string; // date de l'achat
    saleDate: string; // date de mise sur le marché
    plan: number; // plan de l'achat ( 5 pour 5 jour, 10 pour 10 jours ...)
    status: boolean; // état du pack ( )
    emailVerified: boolean;
    idOwner: string;
    transactions: any[]=[];
    state: PackageState = PackageState.SERVICE_INIT_STATE;
    idPack: String; // idantifaint du pack

    constructor(
        id: String = '', // idantifaint du pack
    ) {
        super();
        this.idPack = id;

        //hydrate date iso 8601
        this.saleDate = (new Date()).toISOString();

    }

    /**
     * @inheritdoc
     */
    hydrate(entity: any): void {
        this.amount = purgeAttribute(this, entity, 'amount');
        let deadline = purgeAttribute(this, entity, 'deadline');
        if (deadline) {
            this.payDate = purgeAttribute(this, deadline, 'payDate');
            this.saleDate = purgeAttribute(this, deadline, 'saleDate');
        }
        this.idPack = purgeAttribute(this, entity, 'idPack');
        this.idOwner = purgeAttribute(this, entity, 'idOwner');
        this.state = purgeAttribute(this, entity, 'state');

        this.plan = purgeAttribute(this, entity, 'plan');
        this.status = purgeAttribute(this, entity, 'status');
        this.emailVerified = purgeAttribute(this, entity, 'emailVerified');
        if (entity.transactions) {
            this.transactions = purgeAttribute(this, entity, 'transactions');
        }
    }

    /**
     * @inheritdoc
     */
    toString(): any {
        return {
            idPack: this.id,
            idOwner: this.idOwner,
            deadline: {
                payDate: this.payDate,
                saleDate: this.saleDate
            },
            amount: this.amount,
            plan: this.plan,
            state: this.state,
            emailVerified: this.emailVerified,
            status: this.status,
            transactions: this.transactions
        };
        //stringify date format ISO 8601

    }
}

export class ReceiverPayment extends Entity {
    public name: String = '';
    public contact: String = '';
    public parttypesupplied: String = '';
}

export enum PackageTypeOf {
    PERSON = 'person',
    COLIS = 'colis'
}

export function packBuilder(entity: Record<string, any>): Pack {
    let pck: Pack = null;
    if (entity.options) {
        pck.hydrate(entity);
    }
    console.log('Hydrated pack ', pck);
    return pck;
}
