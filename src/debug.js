#!/usr/bin/env node

const {deepClone} = require('./util');

let a, b, a_clone;

a = {}; a.a = a;
console.log(deepClone(a));

a = {}; b = {}; a.b = b; b.a = a;
console.log(deepClone(a));

a = {}; b = {}; a.b1 = b; a.b2 = b;
a_clone = deepClone(a);
console.log(a_clone.b1 === a_clone.b2);
