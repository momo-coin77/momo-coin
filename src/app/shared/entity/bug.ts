import { ResultStatut } from "../service/firebase/resultstatut";
import { Entity } from "./entity";
import { User } from "./user";

export class Bug extends Entity
{
    date:Date=new Date();
    user=null;
    resultAction:ResultStatut;
    stack:string="";
    getStackTrace()
    {
        function st2(f) {
            return !f ? [] : 
                st2(f.caller).concat([f.toString().split('(')[0].substring(9) + '(' + f.arguments.join(',') + ')']);
        }
        return st2(arguments.callee.caller);
    }
    toString(): Record<string | number, any> {
        let r = {};
        for (const k of Object.keys(this)) {
            if (k == "id")  r[k]=this.id.toString()
            else if(k=="date") r[k]=this.date.toISOString();
            else if(k=="user") 
            {
                if(this.user==null) r[k]="UnAuthentificated user";
                else r[k]=`${this.user.uid}, ${this.user.email}` 
            }
            else if(k=="resultAction") 
            {
                if(this.resultAction)
                {
                    r[k]=this.resultAction.toString();
                }
                else r[k]="Unknow action"
            }
            else if(k=="stack") r[k]=this.getStackTrace();
            else r[k] = Reflect.get(this, k);
        }
        return r;
    }
}