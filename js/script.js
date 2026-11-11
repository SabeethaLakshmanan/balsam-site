(function(){
  var b=document.getElementById("burger"),m=document.getElementById("menu");
  var links=[].slice.call(m.querySelectorAll("a:not(.btn)"));
  var pages=[].slice.call(document.querySelectorAll("main > div[id]"));
  var hd=document.querySelector("header");
  var titles={home:"Balsam Creative Technology | Business Growth Mentorship",services:"Career Mentoring | Balsam Creative Technology",business:"Business Growth Mentorship | Balsam Creative Technology",process:"Our process | Balsam Creative Technology",about:"About | Balsam Creative Technology",faq:"FAQ | Balsam Creative Technology",contact:"Contact | Balsam Creative Technology"};
  function close(){m.classList.remove("open");b.setAttribute("aria-expanded","false")}
  b.addEventListener("click",function(){var o=m.classList.toggle("open");b.setAttribute("aria-expanded",o)});
  document.addEventListener("keydown",function(e){if(e.key==="Escape")close()});
  document.getElementById("yr").textContent=new Date().getFullYear();

  /* photo frames: remove a photo that cannot load so the gradient shows */
  document.querySelectorAll(".ph img").forEach(function(i){
    i.addEventListener("error",function(){i.remove()});
    if(i.complete&&!i.naturalWidth)i.remove();
  });

  /* image fallbacks: if a file in /images is missing, show a built-in graphic instead of a broken icon.
     Real files with the same names are used automatically when you add them. */
  function uri(svg){return "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(svg)}
  function tile(g,bg){
    return uri('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" rx="24" fill="'+bg+'"/><text x="48" y="50" font-size="46" text-anchor="middle" dominant-baseline="central">'+g+'</text></svg>');
  }
  var peach="#FFE7D1",green="#0F4C3A";
  var fallback={
    logo:uri('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 80"><text x="0" y="38" font-family="Poppins,Arial,sans-serif" font-size="38" font-weight="800" fill="#0F4C3A">Balsam</text><text x="0" y="60" font-family="Poppins,Arial,sans-serif" font-size="17" font-weight="700" fill="#E8661B">Creative Technology</text><text x="0" y="76" font-family="Poppins,Arial,sans-serif" font-size="10" fill="#5B6560" letter-spacing="1.5">LEARN · CREATE · BUILD · GROW</text></svg>'),
    hero:uri('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 480"><ellipse cx="300" cy="430" rx="260" ry="26" fill="#EBDFCF"/><rect x="70" y="320" width="110" height="100" rx="14" fill="#F7A04A"/><rect x="200" y="250" width="110" height="170" rx="14" fill="#E8661B"/><rect x="330" y="170" width="110" height="250" rx="14" fill="#14604A"/><rect x="460" y="90" width="90" height="330" rx="14" fill="#0F4C3A"/><g font-size="44" text-anchor="middle" dominant-baseline="central"><text x="125" y="370">💡</text><text x="255" y="335">⚙️</text><text x="385" y="295">🤖</text><text x="505" y="255">🎯</text></g><polyline points="80,250 220,170 350,110 520,40" fill="none" stroke="#E8661B" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/><polygon points="540,28 500,34 524,66" fill="#E8661B"/></svg>'),
    p1:tile("🎓",peach),p2:tile("💼",green),p3:tile("🚀",peach),
    i1:tile("📈",peach),i2:tile("📣",peach),i3:tile("🤖",peach),i4:tile("✅",peach),
    t1:tile("💡",peach),t2:tile("🏢",peach),t3:tile("🛍️",peach),t4:tile("🛠️",peach),t5:tile("🏫",peach),t6:tile("👤",peach),
    d1:tile("💬",peach),d2:tile("📋",peach),d3:tile("🔍",peach),d4:tile("🗺️",peach),d5:tile("🤝",peach),d6:tile("🔁",peach)
  };
  function fixImg(img){
    if(img.closest(".ph")||img.dataset.fb)return;
    var m2=(img.getAttribute("src")||"").match(/images\/([a-z0-9]+)\./i);
    if(!m2||!fallback[m2[1]])return;
    img.dataset.fb="1";
    img.src=fallback[m2[1]];
  }
  document.querySelectorAll("img").forEach(function(img){
    img.addEventListener("error",function(){fixImg(img)});
    if(img.complete&&!img.naturalWidth)fixImg(img);
  });

  /* reveal-on-scroll */
  if("IntersectionObserver" in window){
    var rv=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");rv.unobserve(e.target)}})},{threshold:.12});
    document.querySelectorAll(".rv").forEach(function(el){rv.observe(el)});
  }else{document.querySelectorAll(".rv").forEach(function(el){el.classList.add("in")})}

  /* header shadow + reading-progress line */
  function onScroll(){
    var max=document.documentElement.scrollHeight-window.innerHeight;
    hd.classList.toggle("scrolled",window.scrollY>10);
    hd.style.setProperty("--p",max>0?Math.min(window.scrollY/max,1):0);
  }
  window.addEventListener("scroll",onScroll,{passive:true});

  /* show-only-that-section navigation */
  if("scrollRestoration" in history)history.scrollRestoration="manual";
  function isPage(id){return pages.some(function(p){return p.id===id})}
  /* a link can point to a page (#business) or to a section inside a page (#pkgs) */
  function resolve(id){
    if(isPage(id))return {page:id};
    var el=document.getElementById(id),p=el&&el.closest("main > div[id]");
    return p?{page:p.id,el:el}:{page:"home"};
  }
  function show(id,focus){
    var r=resolve(id);
    pages.forEach(function(p){p.classList.toggle("active",p.id===r.page)});
    links.forEach(function(l){l.classList.toggle("on",l.getAttribute("href")==="#"+r.page)});
    document.title=titles[r.page];
    if(r.el){
      /* make the section's reveal animations visible, then scroll to it */
      r.el.querySelectorAll(".rv").forEach(function(x){x.classList.add("in")});
      window.scrollTo(0,0);
      setTimeout(function(){r.el.scrollIntoView({behavior:"smooth",block:"start"})},60);
    }else{
      window.scrollTo(0,0);
      if(focus){var el=document.getElementById(r.page);el.setAttribute("tabindex","-1");el.focus({preventScroll:true})}
    }
    onScroll();
  }
  document.addEventListener("click",function(e){
    var a=e.target.closest&&e.target.closest('a[href^="#"]');
    if(!a)return;
    var id=a.getAttribute("href").slice(1);
    var el=document.getElementById(id);
    if(!id||!el||!el.closest("main"))return;
    e.preventDefault();close();
    if(location.hash!=="#"+id)history.pushState(null,"","#"+id);
    show(id,true);
  });
  window.addEventListener("popstate",function(){show(location.hash.slice(1)||"home",true)});
  show(location.hash.slice(1)||"home",false);
})();
