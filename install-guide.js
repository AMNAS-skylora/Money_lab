// Passwordless, local-only PWA installation guidance.
// Never redirects to authentication or requests credentials.
const hint=document.querySelector('#install-hint');
if(hint){
 const standalone=window.matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
 const ios=/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
 const safari=/Safari/i.test(navigator.userAgent)&&!/CriOS|FxiOS|EdgiOS/i.test(navigator.userAgent);
 let deferredInstall=null;
 const dismissed=()=>{try{return sessionStorage.getItem('moneylab.install.dismissed')==='yes';}catch{return false;}};
 const show=()=>{hint.hidden=standalone||dismissed()||(!ios&&!deferredInstall);};
 window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();deferredInstall=event;show();});
 window.addEventListener('appinstalled',()=>{deferredInstall=null;hint.hidden=true;});
 document.querySelector('#install-dismiss')?.addEventListener('click',()=>{try{sessionStorage.setItem('moneylab.install.dismissed','yes');}catch{}hint.hidden=true;});
 document.querySelector('#install-action')?.addEventListener('click',async()=>{
  if(deferredInstall){const event=deferredInstall;deferredInstall=null;await event.prompt();show();return;}
  const message=ios?(safari?'In Safari, tap Share (square with arrow), then Add to Home Screen, then Add.':'Open this website in Safari, tap Share, then Add to Home Screen.'):'Open your browser menu and choose Install app or Add to Home Screen.';
  const status=document.querySelector('#install-hint-text');
  if(status)status.textContent=message;
  const button=document.querySelector('#install-action');
  if(button)button.textContent='Got it';
  if(button)button.onclick=()=>{hint.hidden=true;};
 });
 show();
}
