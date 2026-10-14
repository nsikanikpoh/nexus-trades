import test from 'node:test';
import assert from 'node:assert/strict';
import { isAllowedOrigin } from '../server/origin.js';
test('allows Vite origin even when proxy rewrites backend Host',()=>{
 assert.equal(isAllowedOrigin('http://localhost:5173',{host:'localhost:3001'}),true);
 assert.equal(isAllowedOrigin('http://127.0.0.1:5173',{host:'localhost:3001'}),true);
});
test('allows explicit public origin behind production proxy',()=>{
 const config={production:true,appOrigin:'https://learn.example.com',host:'internal:3001'};
 assert.equal(isAllowedOrigin('https://learn.example.com',config),true);
 assert.equal(isAllowedOrigin('https://evil.example',config),false);
 assert.equal(isAllowedOrigin('http://localhost:5173',config),false);
 assert.equal(isAllowedOrigin('http://learn.example.com',config),false);
 assert.equal(isAllowedOrigin('https://learn.example.com:444',config),false);
});
test('rejects malformed, null, suffix-spoofed, and path-bearing origins',()=>{
 for(const origin of ['null','garbage','https://learn.example.com.evil.test','https://learn.example.com/path'])assert.equal(isAllowedOrigin(origin,{appOrigin:'https://learn.example.com',production:true}),false);
});
test('supports same-origin hosting and clients with no origin',()=>{
 assert.equal(isAllowedOrigin('https://learn.example.com',{production:true,host:'learn.example.com',protocol:'https'}),true);
 assert.equal(isAllowedOrigin(undefined,{production:true}),true);
});
