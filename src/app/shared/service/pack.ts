export class Pack {
    idPack: string; // idantifaint du pack
    amount: number; // montant du pack
    dateStart: string; // date de l'achat
    dateEnd: string; // date de mise sur le marché
    plan: number; // plan de l'achat ( 5 pour 5 jour, 10 pour 10 jours ...)
    status: string; // état du pack ( )
    emailVerified: boolean;
}