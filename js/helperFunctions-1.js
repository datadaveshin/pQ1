// Helper Functions
function $$each(collection, callback) {
    if (typeof collection === 'string') {
        collection = collection.split("")
        for (let i = 0; i < collection.length; i++) {
            callback(collection[i], i, collection.join(""), collection['0'], collection[collection.length-1], 0, collection.length - 1, collection.length);
        }
    }
    else if (Array.isArray(collection)) {
        for (let i = 0; i < collection.length; i++) {
            callback(collection[i], i, collection, collection['0'], collection[collection.length-1], 0, collection.length - 1, collection.length);
        }
    }
    else if (typeof collection === 'object') {
        for (let key in collection) {
            callback(collection[key], key, collection, collection[Object.keys(collection)[0]], collection[(Object.keys(collection)[Object.keys(collection).length - 1])], Object.keys(collection)[0], Object.keys(collection)[Object.keys(collection).length - 1], Object.keys(collection).length);
        }
    }
}


function $$filter(collection, predicate) {
    let isString = false
    if (typeof collection === 'string') {
        isString = true
        collection = collection.split("")
    }
    var retArr = [];
    $$each(collection, function(item) {
        if (predicate(item)) {
            retArr.push(item);
        }
    })
    return isString ? retArr.join("") : retArr;
}

/*
Copyright David Shin 2016
All Rights Reserved
*/
