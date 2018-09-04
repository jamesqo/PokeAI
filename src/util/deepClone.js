
// Copied from es6-deep-clone package
/* eslint-disable no-new-func */
function funcCopy(src) {
    // TODO: THIS IS EXTREMELY HACKISH
    return new Function("return ", src.toString())();
}

// Copied from es6-object-assign package
function deepAssign(target) {
    if (target === undefined || target === null) {
        throw new TypeError('Cannot convert first argument to object');
    }

    var to = target;
    for (var i = 1; i < arguments.length; i++) {
        var nextSource = arguments[i];
        if (nextSource === undefined || nextSource === null) {
            continue;
        }

        var keysArray = Object.keys(nextSource);
        for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
            var nextKey = keysArray[nextIndex];
            var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
            if (desc !== undefined && desc.enumerable) {
                to[nextKey] = deepClone(nextSource[nextKey]);
            }
        }
    }
    return to;
}

function deepClone(original) {
    switch (typeof original) {
    case 'function':
        return funcCopy(original);
    case 'number':
    case 'string':
    case 'undefined':
        return original;
    case 'object':
        if (original === null) {
            return null;
        }
        return deepAssign(Object.create(Object.getPrototypeOf(original)), original);
    }
}
