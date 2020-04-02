#!/usr/bin/env node

const nacl = require('tweetnacl');
const { baseHex } = require('./Base');

const boxKeyPair = nacl.box.keyPair();
console.log('Box PublicKey:', baseHex.pads(baseHex.encode(boxKeyPair.publicKey), 64));
console.log('Box SecretKey:', baseHex.pads(baseHex.encode(boxKeyPair.secretKey), 64));

const signKeyPair = nacl.sign.keyPair();
console.log('Sign PublicKey:', baseHex.pads(baseHex.encode(signKeyPair.publicKey), 64));
console.log('Sign SecretKey:', baseHex.pads(baseHex.encode(signKeyPair.secretKey), 128));
