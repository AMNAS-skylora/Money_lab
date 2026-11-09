import test from 'node:test';import assert from 'node:assert/strict';import {paise,balances,validate,add} from '../ledger.mjs';
const base=()=>({version:1,rate:25,goal:{name:'Goal',amount:5000000,date:'2027-02-09'},rows:[]});
const row=(type,amount,id=type)=>({id,type,amount,date:'2026-11-09',note:''});
test('paise avoids decimal drift and rejects invalid amounts',()=>{assert.equal(paise('0.29'),29);assert.equal(paise('25.50'),2550);for(const x of ['-1','0','1.001','NaN','Infinity','1e3',''])assert.throws(()=>paise(x));});
test('income allocation, expense and withdrawal preserve total',()=>{let d=add(base(),row('income',100000));d=add(d,row('save',25000));d=add(d,row('expense',8000));d=add(d,row('withdraw',5000));assert.deepEqual(balances(d.rows),{available:72000,saved:20000});});
test('cannot spend or save unavailable funds',()=>{for(const t of ['expense','save','withdraw'])assert.throws(()=>add(base(),row(t,100)));});
test('dependent income cannot be deleted',()=>{let d=add(base(),row('income',100));d=add(d,row('save',100));assert.throws(()=>validate({...d,rows:d.rows.slice(1)}));});
test('backup rejects unknown type, duplicate IDs and invalid dates',()=>{for(const r of [{...row('income',100),type:'bogus'},{...row('income',100),date:'2026-02-30'},{...row('income',100),amount:1.5}])assert.throws(()=>add(base(),r));const d=add(base(),row('income',100));assert.throws(()=>add(d,row('income',200)));});
test('JSON backup round-trips',()=>{const d=add(base(),row('income',2500));assert.deepEqual(validate(JSON.parse(JSON.stringify(d))),d);});
