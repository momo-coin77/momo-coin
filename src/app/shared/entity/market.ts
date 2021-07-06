import { Entity } from "./entity";
export enum MarketState
{
    OPEN="open",
    CLOSE="close"
}

export class MarketOpenTime extends Entity
{
    start:String="";
    end:String="";
}

export class Market extends Entity
{
    state:MarketState=MarketState.CLOSE;
    openTime:MarketOpenTime[]=[];
    hydrate(entity: Record<string | number, any>): void {
        for (const key of Object.keys(entity)) {
            if (Reflect.has(this, key)) {
                if (key == "openTime") {
                    for(const id of Object.keys(entity[key]))
                    {
                        let time=new MarketOpenTime();
                        time.hydrate(entity[key])[id];
                        this.openTime.push(time);
                    }
                }
                else Reflect.set(this, key, entity[key]);
            }
        }
    }

    toString(): Record<string | number, any> {
        let r = {};
        for (const k of Object.keys(this)) {
            if (k == "openTime")  r[k]= this.openTime.map((time:MarketOpenTime)=>{
                let t={}
                t[time.id.toString().toString()]=time.toString();
                return t;
            })
            else r[k] = Reflect.get(this, k);
        }
        return r;
    }
}