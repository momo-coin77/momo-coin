import { ResultStatut } from "../service/firebase/resultstatut";
import { Entity } from "./entity";
import { User } from "./user";

export class Bug extends Entity
{
    date:Date=new Date();
    user=null;
    resultAction:ResultStatut=new ResultStatut();
    error:Error;

    constructor(result:ResultStatut,error:Error)
    {
        super();
        this.resultAction.hydrate(result.toString());
        this.error = error;
    }

    toString(): Record<string | number, any> {
        let user = this.user == null ? "UnAuthentificated user" : `${this.user.uid}, ${this.user.email}`;
        
        return {
            id:this.id.toObject(),
            date:(new Date()).toISOString(),
            user,
            resultAction:this.resultAction.toString(),
            error:this.error.stack
        }
    }
}

