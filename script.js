(()=>{
  const zone=document.getElementById('exploded-zone');
  const stage=zone.querySelector('.exploded-stage');
  const assembled=zone.querySelector('.assembled-visual');
  const layers=[...zone.querySelectorAll('.ex-layer')];
  const specsWrap=zone.querySelector('.specs');
  const specs=[...zone.querySelectorAll('.spec')];
  const replay=document.getElementById('replay-btn');
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
  const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
  const smooth=v=>{v=clamp(v);return v*v*(3-2*v)};
  const positions=[-235,-117,-23,65,132,235];
  let played=false,running=false,raf=0,progress=0;
  function draw(t){
    progress=clamp(t);
    const ratio=clamp(stage.clientHeight/660,.56,1.05);
    const fit=window.innerWidth<=820?1:clamp(stage.clientHeight/660,.72,1);
    layers.forEach((el,i)=>{
      const local=smooth((progress-(.045+i*.078))/.52);
      const y=(positions[i]*ratio*local).toFixed(2);
      const alpha=smooth((progress-(.025+i*.080))/.14);
      el.style.setProperty('--dy',y+'px');
      el.style.setProperty('--a',alpha.toFixed(3));
      el.style.setProperty('--scale',(fit*(0.96+.04*local)).toFixed(3));
      if(!reduce.matches) specs[i].classList.toggle('is-visible',alpha>.72);
    });
    assembled.style.setProperty('--a',Math.max(0,1-smooth((progress-.02)/.24)).toFixed(3));
    assembled.style.setProperty('--scale',(1-.05*smooth(progress/.35)).toFixed(3));
  }
  function animate(){
    if(running) return;
    running=true;cancelAnimationFrame(raf);
    let start;
    const duration=3250;
    function tick(now){
      if(start===undefined) start=now;
      const t=clamp((now-start)/duration);
      draw(smooth(t));
      if(t<1) raf=requestAnimationFrame(tick);
      else {running=false;played=true;draw(1)}
    }
    raf=requestAnimationFrame(tick);
  }
  if(reduce.matches){
    draw(1);specs.forEach(el=>el.classList.add('is-visible'));played=true;replay.hidden=true;
  }else{
    draw(0);
    const obs=new IntersectionObserver(entries=>{
      if(entries.some(e=>e.isIntersecting)&&!played&&!running){animate();obs.disconnect()}
    },{threshold:.26});
    obs.observe(zone);
    if(replay) replay.addEventListener('click',()=>{cancelAnimationFrame(raf);running=false;played=false;draw(0);animate()});
    window.addEventListener('resize',()=>{if(!running)draw(played?1:progress)},{passive:true});
  }

  const headCopy=document.getElementById('headCopy');

  // The original stacking centres remain stable throughout hover.
  // Neighboring layers smoothly move away from the enlarged one.
  let hoveredIndex=-1;
  function setHoveredPart(step){
    const index=step==null?-1:Number(step)-1;
    if(index===hoveredIndex)return;
    hoveredIndex=index;
    const active=index>=0;
    stage.classList.toggle('is-hovering',active);
    if(specsWrap)specsWrap.classList.toggle('is-hovering',active);
    const ratio=clamp(stage.clientHeight/660,.56,1.05);
    layers.forEach((el,i)=>{
      const selected=i===index;
      el.classList.toggle('is-hovered',selected);
      let spread=0;
      if(active&&!selected){
        const direction=i<index?-1:1;
        const distance=Math.abs(i-index);
        const amount=(36+Math.min(3,distance)*12)*ratio;
        const available=Math.max(0,270*ratio-Math.abs(positions[i]*ratio));
        spread=direction*Math.min(amount,available);
      }
      el.style.setProperty('--spread',spread.toFixed(2)+'px');
    });
    specs.forEach((spec,i)=>spec.classList.toggle('is-hovered',i===index));
  }
  // A single stage pointer zone avoids oscillation caused by transparent PNG bounds.
  stage.addEventListener('pointermove',event=>{
    if(!played)return;
    const rect=stage.getBoundingClientRect();
    const ratio=clamp(stage.clientHeight/660,.56,1.05);
    const x=(event.clientX-rect.left)/rect.width;
    if(x<.20||x>.85){setHoveredPart(null);return;}
    const y=event.clientY-(rect.top+rect.height/2);
    let nearest=-1,dist=Infinity;
    positions.forEach((p,i)=>{const d=Math.abs(y-p*ratio);if(d<dist){nearest=i;dist=d}});
    setHoveredPart(dist<Math.max(45,60*ratio)?nearest+1:null);
  });
  stage.addEventListener('pointerleave',()=>setHoveredPart(null));
  if(specsWrap){
    specsWrap.addEventListener('pointermove',event=>{
      if(!played)return;
      const spec=event.target.closest('.spec');
      if(spec)setHoveredPart(spec.dataset.step);
    });
    specsWrap.addEventListener('pointerleave',()=>setHoveredPart(null));
  }
  specs.forEach(spec=>{
    spec.addEventListener('focus',()=>setHoveredPart(spec.dataset.step));
    spec.addEventListener('blur',()=>setHoveredPart(null));
  });
  const headObs=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){headCopy.classList.add('is-visible');headObs.disconnect();}
    });
  },{threshold:.12});
  headObs.observe(headCopy);
})();
