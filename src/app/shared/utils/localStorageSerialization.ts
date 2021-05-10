
export function serializeData(key:string,data:any):void
{
    sessionStorage.setItem(key,JSON.stringify(data));
}
export function deSerializeData(key:string):any
{
    return JSON.parse(sessionStorage.getItem(key));
}
export function keyExist(key:string):boolean
{
   return deSerializeData(key)!=null;     
}
export function clearDataFromStorage()
{
    sessionStorage.clear();
}