#!/usr/bin/env node

const nacl = require('tweetnacl');
const { base16 } = require('./Base');

const boxKeyPair = nacl.box.keyPair();
console.log('Box PublicKey:', base16.encode(boxKeyPair.publicKey));
console.log('Box SecretKey:', base16.encode(boxKeyPair.secretKey));

const signKeyPair = nacl.sign.keyPair();
console.log('Sign PublicKey:', base16.encode(signKeyPair.publicKey));
console.log('Sign SecretKey:', base16.encode(signKeyPair.secretKey));
