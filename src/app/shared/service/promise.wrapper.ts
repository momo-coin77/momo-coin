export function wrapperForPromiseState(promise)
{
    if(promise.isResolved) return promise;
    let isPending = true, isRejected=false, isFulfilled = false;

    let result = promise.then(function (v){
        isFulfilled = true;
        isPending = false;
        return v;
    },
    function(e) {
        isRejected = true;
        isPending = false;
        throw e; 
    })
    result.isFulfilled = function() { return isFulfilled; };
    result.isPending = function() { return isPending; };
    result.isRejected = function() { return isRejected; };
    return result;
}