// Copied from es6-deep-clone package
/* eslint-disable no-new-func */
function funcCopy(src) {
    // TODO: THIS IS EXTREMELY HACKISH
    // Also doesn't work for simple cases like deepClone(() => {})
    return new Function("return ", src.toString())();
}

// Copied from es6-object-assign package
function deepAssign(target, cloneCache = null, ...sources) {
    if (target === undefined || target === null) {
        throw new TypeError('Cannot convert first argument to object');
    }

    var to = target;
    for (const source of sources) {
        if (source === undefined || source === null) {
            continue;
        }

        var keysArray = Object.keys(source);
        for (var index = 0, len = keysArray.length; index < len; index++) {
            var key = keysArray[index];
            var desc = Object.getOwnPropertyDescriptor(source, key);
            if (desc !== undefined && desc.enumerable) {
                to[key] = deepClone(source[key], cloneCache);
            }
        }
    }
    return to;
}

function deepClone(original, cloneCache = null) {
    if (original === null ||
        original === undefined ||
        typeof original === 'number' ||
        typeof original === 'string') {
        return original;
    }

    // This check will fire if two sibling subtrees contain the same object, e.g.
    // const a = {}; const b = {}; a.b1 = b; a.b2 = b;
    let cachedResult;
    if (cloneCache !== null && (cachedResult = cloneCache.get(original)) !== null) {
        return cachedResult;
    }

    let result;
    switch (typeof original) {
    case 'function':
        result = funcCopy(original);
        break;
    case 'object':
        result = deepAssign(Object.create(Object.getPrototypeOf(original)), original);
        break;
    default:
        throw new Error(`Unrecognized type: ${typeof original}`);
    }

    // In the case of circular references, e.g.
    // const a = {}; a.a = a;
    // we will finish cloning a.a before a, but not before we start cloning a.
    // So this check will fire in such circumstances.
    if (cloneCache !== null && (cachedResult = cloneCache.get(original)) !== null) {
        return cachedResult;
    }

    if (cloneCache === null) {
        cloneCache = new Map();
    }
    cloneCache.set(original, result);
    return result;
}

module.exports = {
    deepAssign,
    deepClone
};
