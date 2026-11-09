// Money Lab: accessible, paise-exact split simulator for tiny incomes.
const host=document.querySelector('#home .buckets');
if(host){
 const panel=document.createElement('section');
 panel.className='split-studio';
 panel.setAttribute('aria-label','Income split preview');
 panel.innerHTML=`<div class="split-studio-head"><div><span class="split-eyebrow">SMART ALLOCATION</span><h2>Every rupee has a plan.</h2><p>Preview exactly where your next income goes.</p></div><span class="split-sparkle" aria-hidden="true">✦</span></div><label class="split-input-label" for="split-studio-amount">Income amount <span>₹</span></label><input id="split-studio-amount" type="number" inputmode="decimal" min=".01" step=".01" value="10" aria-describedby="split-studio-note"><div class="split-presets"><button type="button" data-split-value="1">₹1</button><button type="button" data-split-value="10">₹10</button><button type="button" data-split-value="100">₹100</button><button type="button" data-split-value="1000">₹1,000</button></div><div class="split-meter" aria-hidden="true"><span></span><span></span><span></span></div><div class="split-amounts"><div><small>Savings · <b id="split-studio-savings-percent">20%</b></small><strong id="split-studio-savings">₹2</strong></div><div><small>Current · <b id="split-studio-current-percent">30%</b></small><strong id="split-studio-current">₹3</strong></div><div><small>Next month · <b id="split-studio-next-percent">50%</b></small><strong id="split-studio-next">₹5</strong></div></div><p id="split-studio-note">Preview only · Save income to record it.</p><button type="button" class="split-add">＋ Record this income</button>`;
 host.insertAdjacentElement('afterend',panel);
 const css=document.createElement('style');
 css.textContent=`.split-studio{margin:16px 0 22px;padding:22px;border-radius:26px;background:linear-gradient(145deg,#122f2a,#164d3e 65%,#256c53);color:white;box-shadow:0 18px 40px #123e302c;overflow:hidden}.split-studio-head{display:flex;align-items:start;justify-content:space-between}.split-studio-head h2{font-size:22px;letter-spacing:-.7px;margin:7px 0}.split-studio-head p{font-size:13px;color:#d3e7dd;margin:0 0 18px}.split-eyebrow{font-size:10px;font-weight:800;letter-spacing:2px;color:#9ce7b7}.split-sparkle{font-size:35px;color:#c4f0ad;animation:split-glow 3s ease-in-out infinite}.split-input-label{display:block;font-size:12px;color:#d2e5d8}.split-input-label span{float:right}.split-studio input{width:100%;margin:8px 0 12px;padding:14px 16px;border:1px solid #ffffff55;border-radius:15px;background:#ffffff17;color:#fff;font-size:28px;font-weight:750;box-sizing:border-box;outline-offset:3px}.split-presets{display:flex;gap:8px;margin-bottom:18px}.split-presets button{flex:1;min-width:0;padding:9px 2px;border:1px solid #ffffff40;border-radius:12px;color:white;background:#ffffff15;font-size:12px}.split-presets button:active,.split-add:active{transform:scale(.97)}.split-meter{display:flex;gap:3px;height:9px;border-radius:15px;overflow:hidden}.split-meter span{transition:flex .45s ease}.split-meter span:nth-child(1){background:#8be6bd}.split-meter span:nth-child(2){background:#8cc7ff}.split-meter span:nth-child(3){background:#c8a9ff}.split-amounts{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;margin-top:14px}.split-amounts div{min-width:0}.split-amounts small{display:block;color:#d3e6de;font-size:10px}.split-amounts strong{display:block;font-size:clamp(15px,4.5vw,22px);margin-top:5px;overflow-wrap:anywhere;font-variant-numeric:tabular-nums}.split-studio #split-studio-note{font-size:11px;color:#d3e6de;margin:15px 0}.split-add{width:100%;padding:13px;border:0;border-radius:14px;background:#e0f9e7;color:#123d30;font-weight:800;font-size:14px;transition:transform .2s}@keyframes split-glow{50%{opacity:.5;transform:rotate(25deg) scale(1.1)}}@media(prefers-reduced-motion:reduce){.split-studio *{animation:none!important;transition:none!important}}`;
 document.head.append(css);
 const input=panel.querySelector('input'),fmt=new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',minimumFractionDigits:0,maximumFractionDigits:2});
 function percent(k,fallback){const v=Number(document.querySelector('#split-'+k)?.value);return Number.isInteger(v)&&v>=0&&v<=100?v:fallback;}
 function draw(){
  const s=percent('savings',20),c=percent('current',30),n=percent('next',50),valid=s+c+n===100;
  const raw=input.value,ok=/^\d+(\.\d{1,2})?$/.test(raw)&&Number(raw)>0&&Number(raw)<=100000000;
  const cents=ok?Math.round(Number(raw)*100):0,sv=Math.floor(cents*s/100),nx=Math.floor(cents*n/100),cu=cents-sv-nx;
  for(const [key,value,pct] of [['savings',sv,s],['current',cu,c],['next',nx,n]]){
   panel.querySelector('#split-studio-'+key).textContent=fmt.format(value/100);
   panel.querySelector('#split-studio-'+key+'-percent').textContent=pct+'%';
  }
  [s,c,n].forEach((p,i)=>panel.querySelectorAll('.split-meter span')[i].style.flex=String(Math.max(p,.001)));
  panel.querySelector('.split-add').disabled=!ok||!valid;
  panel.querySelector('#split-studio-note').textContent=!valid?'Set percentages totaling 100% in Settings.':!ok?'Enter a positive amount with up to 2 decimals.':'Exact to the paise · Rounding remainder goes to Current · Preview only';
 }
 input.addEventListener('input',draw);
 panel.querySelectorAll('[data-split-value]').forEach(b=>b.addEventListener('click',()=>{input.value=b.dataset.splitValue;draw();}));
 for(const k of ['savings','current','next'])document.querySelector('#split-'+k)?.addEventListener('input',draw);
 panel.querySelector('.split-add').addEventListener('click',()=>{const btn=document.querySelector('[data-entry="income"]');btn?.click();const field=document.querySelector('#entry-amount');if(field){field.value=input.value;field.dispatchEvent(new Event('input',{bubbles:true}));}});
 draw();
}
