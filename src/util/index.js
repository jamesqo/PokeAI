// Copied from es6-deep-clone package
/* eslint-disable no-new-func */
function _funcCopy(src) {
    // TODO: THIS IS EXTREMELY HACKISH
    // Also doesn't work for simple cases like deepClone(() => {})
    return new Function("return ", src.toString())();
}

// Copied from es6-object-assign package
function _deepAssign(target, sources, memoMap = null) {
    if (target === undefined || target === null) {
        throw new TypeError('Cannot convert first argument to object');
    }

    var to = target;
    for (const source of sources) {
        if (source === undefined || source === null) {
            continue;
        }

        var keysArray = Object.keys(source);
        for (const key of keysArray) {
            var desc = Object.getOwnPropertyDescriptor(source, key);
            if (desc !== undefined && desc.enumerable) {
                to[key] = deepClone(source[key], memoMap);
            }
        }
    }
    return to;
}

function deepClone(original, memoMap = null) {
    if (original === null ||
        original === undefined ||
        typeof original === 'number' ||
        typeof original === 'string') {
        return original;
    }

    // In the case of circular references, e.g.
    // const a = {}; a.a = a;
    // We'll create a new object for a. When we reach a.a in the middle of cloning a,
    // we'll lookup that value and realize we're in the middle of cloning it.

    let incompleteClone;
    if (memoMap !== null && (incompleteClone = memoMap.get(original)) !== undefined) {
        return incompleteClone;
    }

    let blankSlate;

    switch (typeof original) {
    case 'function':
        return _funcCopy(original);
    case 'object':
        blankSlate = Object.create(Object.getPrototypeOf(original));

        if (memoMap === null) {
            memoMap = new Map();
        }
        memoMap.set(original, blankSlate);
        return _deepAssign(blankSlate, [original], memoMap);
    default:
        throw new Error(`Unrecognized type: ${typeof original}`);
    }
}

module.exports = {deepClone};
