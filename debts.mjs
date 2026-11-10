const KEY='moneylab.debts.v1';
const $=s=>document.querySelector(s);
const fmt=n=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR'}).format(n/100);
let rows=[];
try{const v=JSON.parse(localStorage.getItem(KEY)||'[]');if(Array.isArray(v))rows=v}catch{}
const balance=(name,direction)=>rows.filter(r=>r.person===name&&r.direction===direction).reduce((n,r)=>n+(r.action==='new'?r.amount:-r.amount),0);
const node=(tag,cls,content)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(content!==undefined)e.textContent=content;return e};
const names=()=>[...new Set(rows.map(r=>r.person))].sort((a,b)=>a.localeCompare(b));
function openForm(person='',direction='lent',action='new'){
 $('#debt-form').reset();$('#debt-person').value=person;$('#debt-direction').value=direction;$('#debt-action').value=action;
 const d=new Date();$('#debt-date').value=[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
 $('#debt-error').textContent='';formBalance();$('#debt-dialog').showModal();
}
function formBalance(){
 const person=$('#debt-person').value.trim().replace(/\s+/g,' '),direction=$('#debt-direction').value;
 const due=balance(person,direction);$('#debt-form-balance').textContent=person?'Outstanding for '+person+': '+fmt(due):'Choose an existing person or enter a new name';
}
function render(){
 const people=names(),q=$('#debt-search').value.trim().toLowerCase(),filter=$('#debt-filter').value;
 $('#debt-names').replaceChildren(...people.map(n=>{const o=node('option');o.value=n;return o}));
 let lent=0,borrowed=0;
 for(const name of people){lent+=balance(name,'lent');borrowed+=balance(name,'borrowed')}
 $('#debt-receivable').textContent=fmt(lent);$('#debt-payable').textContent=fmt(borrowed);
 $('#debt-count').textContent=people.length+' '+(people.length===1?'person':'people');
 const list=$('#debt-people');list.replaceChildren();
 const shown=people.filter(name=>{const a=balance(name,'lent'),b=balance(name,'borrowed');if(q&&!name.toLowerCase().includes(q)&&!rows.some(r=>r.person===name&&r.note?.toLowerCase().includes(q)))return false;return filter==='all'||filter==='lent'&&a>0||filter==='borrowed'&&b>0||filter==='open'&&(a>0||b>0)||filter==='settled'&&a===0&&b===0});
 for(const name of shown){
  const a=balance(name,'lent'),b=balance(name,'borrowed'),card=node('div','debt-person');
  const top=node('div','debt-person-top'),avatar=node('span','debt-avatar',name.charAt(0).toUpperCase()),details=node('div','debt-person-details'),title=node('strong',null,name),status=node('small',null,a||b?'Outstanding':'Settled');
  details.append(title,status);top.append(avatar,details);
  const amounts=node('div','debt-person-amounts');if(a)amounts.append(node('span','debt-receive','Receive '+fmt(a)));if(b)amounts.append(node('span','debt-pay','Pay '+fmt(b)));if(!a&&!b)amounts.append(node('span','debt-settled','All settled'));
  const actions=node('div','debt-person-actions');
  const add=node('button',null,'＋ Add'),repay=node('button',null,'↩ Repayment');add.type=repay.type='button';
  add.onclick=()=>openForm(name,a>0?'lent':b>0?'borrowed':'lent','new');
  repay.disabled=!(a>0||b>0);repay.onclick=()=>openForm(name,a>0?'lent':'borrowed','repay');
  actions.append(add,repay);card.append(top,amounts,actions);list.append(card);
 }
 if(!shown.length)list.append(node('p','debt-empty',people.length?'No matching people found.':'No debts yet. Tap + Record to get started.'));
 const history=$('#debt-history');history.replaceChildren();$('#debt-history-count').textContent=rows.length+' entries';
 const recent=[...rows].reverse().slice(0,30);
 for(const r of recent){const item=node('div','debt-history-row'),info=node('div'),title=node('strong',null,r.person),subtitle=node('small',null,(r.action==='repay'?'Repayment':'New debt')+' · '+(r.direction==='lent'?'Lent':'Borrowed')+' · '+r.date),amount=node('strong','debt-history-amount',fmt(r.amount));info.append(title,subtitle);if(r.note)info.append(node('small',null,r.note));item.append(info,amount);history.append(item)}
 if(!recent.length)history.append(node('p','debt-empty','Your recent debt activity will appear here.'));
}
$('#debt-add').onclick=()=>openForm();$('#debt-close').onclick=()=>$('#debt-dialog').close();
for(const id of ['#debt-person','#debt-direction','#debt-action'])$(id).addEventListener('input',formBalance);
$('#debt-search').addEventListener('input',render);$('#debt-filter').addEventListener('change',render);
$('#debt-form').onsubmit=e=>{e.preventDefault();try{
 const person=$('#debt-person').value.trim().replace(/\s+/g,' '),direction=$('#debt-direction').value,action=$('#debt-action').value,raw=$('#debt-amount').value.trim(),date=$('#debt-date').value;
 if(!person||person.length>80)throw Error('Enter a valid person');
 if(!/^\d+(\.\d{1,2})?$/.test(raw))throw Error('Enter a valid amount');
 const amount=Math.round(Number(raw)*100);if(!Number.isSafeInteger(amount)||amount<=0||amount>1e10)throw Error('Amount out of range');
 if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isFinite(Date.parse(date)))throw Error('Enter a valid date');
 const previous=balance(person,direction);if(action==='repay'&&amount>previous)throw Error('Repayment exceeds outstanding '+fmt(previous));
 const row={id:crypto.randomUUID(),person,direction,action,amount,date,note:$('#debt-note').value.trim()};
 const next=[...rows,row];localStorage.setItem(KEY,JSON.stringify(next));rows=next;$('#debt-dialog').close();render();
 }catch(err){$('#debt-error').textContent=err.message}};
render();
