import { Entity, purgeAttribute } from './entity';
import { Zone as Location, Document, Vehicle } from './provider'

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

export class ColisPackage extends Pack {
    static TYPE = 'TransportColisService';

    is_weak: Boolean = false;
    typeof: String = '';
    size_heigth: Number = 0.0;
    size_depth: Number = 0.0;
    size_width: Number = 0.0;
    size_piece_nber: Number = 0;
    size_piece_length: Number = 0;
    package_name: String = '';
    receiver: ReceiverColis = new ReceiverColis();

    hydrate(entity: any): void {

        let options = purgeAttribute(this, entity, 'options');
        this.is_weak = purgeAttribute(this, options, 'is_weak');
        this.typeof = purgeAttribute(this, options, 'typeof');
        this.package_name = purgeAttribute(this, options, 'package_name');
        if (entity.hasOwnProperty('size')) {
            this.size_heigth = purgeAttribute(this, options.size, 'heigth');
            this.size_depth = purgeAttribute(this, options.size, 'depth');
            this.size_width = purgeAttribute(this, options.size, 'width');
            this.size_piece_nber = purgeAttribute(this, options.size, 'piece_nber');
            this.size_piece_nber = purgeAttribute(this, options.size, 'length');
        }
        if (entity.options.receiver) {
            this.receiver.hydrate(entity.options.receiver);
            this.receiver.id = this.receiver.id == null ? '' : this.receiver.id;
        }
        super.hydrate(entity)
    }

    /**
     * @inheritdoc
     */
    toString(): any {
        let stringifyO = super.toString();

        stringifyO['options'] = {
            ...stringifyO['options'],
            is_weak: this.is_weak,
            typeof: this.typeof,
            size: {
                heigth: this.size_heigth,
                depth: this.size_heigth,
                width: this.size_width,
                piece_nber: this.size_piece_nber,
                length: this.size_piece_length
            },
            package_name: this.package_name,
            receiver: this.receiver.toString()
        };
        stringifyO['type'] = ColisPackage.TYPE;
        return stringifyO;
    }
}

export class ReceiverColis extends Entity {
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
        if (entity.options.typeof != PackageTypeOf.PERSON) pck = new ColisPackage();
        pck.hydrate(entity);
    }
    console.log('Hydrated pack ', pck)
    return pck;
}