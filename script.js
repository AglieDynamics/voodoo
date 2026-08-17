(function(){
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('js');

  /* nav */
  var nav=document.getElementById('nav'), burger=document.getElementById('burger'),
      links=document.getElementById('navlinks');
  var toTop=document.getElementById('totop');
  addEventListener('scroll',function(){
    nav.classList.toggle('solid',scrollY>40);
    toTop.classList.toggle('show',scrollY>innerHeight*0.9);
  },{passive:true});
  toTop.addEventListener('click',function(){
    window.scrollTo({top:0,behavior:reduce?'auto':'smooth'});
  });
  burger.addEventListener('click',function(){
    var open=links.classList.toggle('open');
    burger.classList.toggle('on',open); burger.setAttribute('aria-expanded',open);
  });
  links.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){
    links.classList.remove('open'); burger.classList.remove('on');
    burger.setAttribute('aria-expanded','false');});});

  /* hero video: pause it entirely if the visitor asked for less motion */
  var v=document.getElementById('heroVid');
  if(v){
    if(reduce){ v.removeAttribute('autoplay'); v.pause(); }
    else { var p=v.play(); if(p&&p.catch) p.catch(function(){}); }
  }

  /* reveals */
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){e.target.classList.add('in'); io.unobserve(e.target);} });
  },{threshold:.12,rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('.rv').forEach(function(el,i){
    el.style.transitionDelay=(Math.min(i,5)*55)+'ms'; io.observe(el);
  });
  function sweep(){ document.querySelectorAll('.rv:not(.in)').forEach(function(el){
    if(el.getBoundingClientRect().top < innerHeight*1.15) el.classList.add('in'); }); }
  addEventListener('scroll',sweep,{passive:true});
  addEventListener('load',function(){sweep();setTimeout(sweep,400);});
  setTimeout(sweep,600);

  /* counters */
  var cio=new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(!e.isIntersecting) return;
      var el=e.target, target=parseFloat(el.dataset.count),
          suf=el.dataset.suffix||'', pre=el.dataset.prefix||'';
      cio.unobserve(el);
      if(reduce){ el.textContent=pre+target+suf; return; }
      var t0=null;
      requestAnimationFrame(function step(ts){
        if(!t0) t0=ts;
        var p=Math.min((ts-t0)/1400,1);
        el.textContent=pre+Math.round(target*(1-Math.pow(1-p,3)))+suf;
        if(p<1) requestAnimationFrame(step);
      });
    });
  },{threshold:.5});
  document.querySelectorAll('[data-count]').forEach(function(el){cio.observe(el);});

  /* contact */
  var note=document.getElementById('formnote');
  document.getElementById('send').addEventListener('click',function(){
    var n=document.getElementById('f-name').value.trim(),
        m=document.getElementById('f-email').value.trim();
    if(!n||m.indexOf('@')<1){
      note.style.color='var(--coral)';
      note.textContent='Add a name and a valid email so we can reply.'; return;
    }
    note.style.color='var(--gold)';
    note.textContent='Received, '+n.split(' ')[0]+'. We reply within two working days.';
    ['f-name','f-email','f-msg'].forEach(function(id){document.getElementById(id).value='';});
  });
})();
