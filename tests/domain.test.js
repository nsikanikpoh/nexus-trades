import test from 'node:test';
import assert from 'node:assert/strict';
import {grade,publicScenario,sameShape,scenarioSchema} from '../server/domain.js';
const scenario={title:'Solar workshop',summary:'Inspect an isolated system.',trade:'Solar',components:['a','b','c'].map(id=>({id,name:id,description:id})),steps:['a','b','c'].map(componentId=>({instruction:'Inspect',componentId})),questions:Array.from({length:5},(_,i)=>({prompt:'Question '+i,options:['a','b','c','d'],answer:i%4,explanation:'Reason'}))};
test('scores answers deterministically',()=>{assert.equal(grade(scenario,[0,1,2,3,0]).score,100);assert.equal(grade(scenario,[1,1,2,3,0]).score,80);});
test('rejects incomplete and invalid answers',()=>{assert.throws(()=>grade(scenario,[0]));assert.throws(()=>grade(scenario,[0,1,2,3,9]));});
test('hides answer keys and explanations before submission',()=>{for(const q of publicScenario(scenario).questions){assert.equal(q.answer,undefined);assert.equal(q.explanation,undefined);}});
test('translation shape preserves numbers and structure',()=>{assert.equal(sameShape({name:'Hello',score:80,items:['a']},{name:'Sannu',score:80,items:['b']}),true);assert.equal(sameShape({score:80},{score:90}),false);assert.equal(sameShape({a:['one']},{a:[]}),false);});
test('validates workshop component references and question count',()=>{assert.equal(scenarioSchema.safeParse(scenario).success,true);assert.equal(scenarioSchema.safeParse({...scenario,steps:[{instruction:'Test',componentId:'missing'},...scenario.steps]}).success,false);assert.equal(scenarioSchema.safeParse({...scenario,questions:[]}).success,false);});
