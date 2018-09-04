#!/usr/bin/env node

const {deepClone} = require('./util');

let a, b;

a = {}; a.a = a;
console.log(deepClone(a));

a = {}; b = {}; a.b = b; b.a = a;
console.log(deepClone(a));
