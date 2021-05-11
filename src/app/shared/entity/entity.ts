import { EntityID } from "./EntityID";

export class Entity {
    id: EntityID = new EntityID();
    
    hydrate(entity: Record<string | number, any>): void {
        for (const key of Object.keys(entity)) {
            if (Reflect.has(this, key))
            {
                if(key=="id") this.id.setId(entity.id)
                else Reflect.set(this, key, entity[key]);
            }
        }
    }

    toString(): Record<string | number, any> {
        let r = {};
        for (const k of Object.keys(this)) {
            if(k=="id") this.id.toString()
            else r[k] = Reflect.get(this, k);
        }
        return r;
    }
}