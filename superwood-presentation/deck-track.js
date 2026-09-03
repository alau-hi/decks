/* Shared engagement tracker for every deck on this site.
   Loaded by each deck's HTML as <script src="/deck-track.js" defer></script>.
   Counts go to Vercel Analytics (deck_open, section_view — 2 data props max on
   Pro); per-slide dwell seconds beacon to /api/track, cumulative per session so
   the server can overwrite one record per session without double-counting.
   The deck id comes from the URL path and the slide order from the DOM, so a
   deck never needs per-deck configuration here. Off this site (e.g. a deck's
   own staging host) the file 404s and nothing runs. */
(function(){
  var PREFIXES={supermills:'/supermills-america-overview'};
  var deck='superwood';
  for(var id in PREFIXES){ var p=PREFIXES[id]; if(location.pathname===p||location.pathname.indexOf(p+'/')===0){deck=id;} }
  var params=new URLSearchParams(location.search);
  var viewer=params.get('v')||params.get('to')||params.get('viewer')||'anonymous';
  var session=Math.random().toString(36).slice(2,10)+Math.random().toString(36).slice(2,10);
  function track(name,data){try{window.va&&window.va('event',{name:name,data:Object.assign({viewer:viewer},data||{})});}catch(e){}}
  track('deck_open',{ref:document.referrer||'direct'});
  var deckEl=document.getElementById('deck');
  var sections=document.querySelectorAll('section');
  var order=[],seen={};
  sections.forEach(function(s){ var n=(s.dataset.nav||s.id||'').trim().slice(0,60); if(n&&!seen[n]){seen[n]=1;order.push(n);} });
  var current=null,enterT=0,totals={};
  /* Idle cutoff: time on a slide only counts up to IDLE_MS after the last
     interaction, so an abandoned-but-visible tab stops inflating dwell. */
  var IDLE_MS=180000,lastActive=performance.now();
  function flush(){ if(current){ var end=Math.min(performance.now(),lastActive+IDLE_MS); var s=Math.round((end-enterT)/1000); if(s>0){ totals[current]=(totals[current]||0)+s; } enterT=performance.now(); } }
  function activity(){ if(performance.now()-lastActive>IDLE_MS){ flush(); } lastActive=performance.now(); }
  ['pointerdown','pointermove','wheel','keydown','touchstart'].forEach(function(ev){ document.addEventListener(ev,activity,{passive:true}); });
  var sio=new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(e.isIntersecting && e.intersectionRatio>=0.6){
        flush();
        current=(e.target.dataset.nav||e.target.id);
        enterT=performance.now();
        track('section_view',{section:current});
      }
    });
  },{root:deckEl,threshold:0.6});
  sections.forEach(function(s){sio.observe(s);});
  function scrNow(){ try{ return { w:innerWidth, h:innerHeight, sw:screen.width, sh:screen.height, dpr:devicePixelRatio||1, o:matchMedia('(orientation: portrait)').matches?'p':'l' }; }catch(e){ return null; } }
  function send(){
    flush();
    if(!Object.keys(totals).length)return;
    try{navigator.sendBeacon('/api/track',new Blob([JSON.stringify({viewer:viewer,session:session,deck:deck,order:order,totals:totals,scr:scrNow()})],{type:'application/json'}));}catch(e){}
  }
  setInterval(function(){ if(!document.hidden) send(); },30000);
  document.addEventListener('visibilitychange',function(){
    if(document.hidden){ send(); } else { enterT=performance.now(); }
  });
  window.addEventListener('pagehide',send);
})();
