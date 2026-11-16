(()=>{
  const story=document.querySelector('#nuo-detail-story');
  if(!story)return;
  const slides=[...story.querySelectorAll('.detail-slide')];
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  let current=0, timer=null, hasRevealed=false;
  function show(index){
    if(!slides.length)return;
    current=(index+slides.length)%slides.length;
    slides.forEach((slide,i)=>slide.classList.toggle('is-active',i===current));
  }
  function startCarousel(){
    if(timer||slides.length<2||reduced.matches)return;
    timer=window.setInterval(()=>show(current+1),3000);
  }
  function stopCarousel(){
    if(timer!==null){window.clearInterval(timer);timer=null;}
  }
  show(0);
  // The words reveal only once, from top to bottom; each word wipes left-to-right.
  if(!reduced.matches)story.classList.add('reveal-prepared');
  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>{
      const entry=entries[0];
      if(!entry)return;
      if(entry.isIntersecting){
        if(!hasRevealed){
          hasRevealed=true;
          story.classList.add('reveal-started');
        }
        startCarousel();
      }else stopCarousel();
    },{threshold:.2});
    observer.observe(story);
  }else{
    story.classList.add('reveal-started');
    startCarousel();
  }
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden)stopCarousel();
    else if(story.getBoundingClientRect().bottom>0&&story.getBoundingClientRect().top<innerHeight)startCarousel();
  });
})();
