#!/usr/bin/env node

const nacl = require('tweetnacl');
const { encode16 } = require('./codec');

const boxKeyPair = nacl.box.keyPair();
console.log('Box PublicKey:', encode16(boxKeyPair.publicKey));
console.log('Box SecretKey:', encode16(boxKeyPair.secretKey));

const signKeyPair = nacl.sign.keyPair();
console.log('Sign PublicKey:', encode16(signKeyPair.publicKey));
console.log('Sign SecretKey:', encode16(signKeyPair.secretKey));
