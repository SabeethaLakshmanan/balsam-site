/* =====================================================================
   BALSAM: site script
   Part 1: navigation, page switching, image fallbacks, reveal-on-scroll
   Part 2: enquiry form, package selector, growth planner, mentor finder
   ===================================================================== */
(function(){
  "use strict";
  var b=document.getElementById("burger"),m=document.getElementById("menu");
  var links=[].slice.call(m.querySelectorAll("a:not(.btn)"));
  var pages=[].slice.call(document.querySelectorAll("main > div[id]"));
  var hd=document.querySelector("header");
  var titles={home:"Balsam Creative Technology | Business Growth Mentorship",services:"Career Mentoring | Balsam Creative Technology",mentors:"Find a Mentor | Balsam Creative Technology",business:"Business Growth Mentorship | Balsam Creative Technology",process:"Our Process | Balsam Creative Technology",about:"About | Balsam Creative Technology",faq:"FAQ | Balsam Creative Technology",contact:"Contact | Balsam Creative Technology"};
  function close(){m.classList.remove("open");b.setAttribute("aria-expanded","false")}
  b.addEventListener("click",function(){var o=m.classList.toggle("open");b.setAttribute("aria-expanded",o?"true":"false")});
  document.addEventListener("keydown",function(e){if(e.key==="Escape")close()});
  window.addEventListener("resize",function(){if(window.innerWidth>1180)close()});
  document.getElementById("yr").textContent=new Date().getFullYear();

  /* photo frames: remove a photo that cannot load so the gradient shows */
  document.querySelectorAll(".ph img").forEach(function(i){
    i.addEventListener("error",function(){i.remove()});
    if(i.complete&&!i.naturalWidth)i.remove();
  });

  /* skill photos (chips and mentor cards): hide one that cannot load, instead of a broken-image icon */
  document.addEventListener("error",function(e){
    var i=e.target;
    if(i&&i.tagName==="IMG"&&i.matches(".chip-ph,.mic img")&&!i.dataset.fb){
      i.dataset.fb="1";
      i.src=i.dataset.art||uri('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#16213E"/><stop offset="1" stop-color="#C79A3B"/></linearGradient></defs><rect width="64" height="64" fill="url(#g)"/></svg>');
    }
  },true);

  /* image fallbacks: if a file in /images is missing, show a built-in graphic (colours match the site theme) */
  function uri(svg){return "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(svg)}
  function tile(g,bg){
    return uri('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" rx="24" fill="'+bg+'"/><text x="48" y="50" font-size="46" text-anchor="middle" dominant-baseline="central">'+g+'</text></svg>');
  }
  var soft="#F6EBD2",navy="#16213E";
  var fallback={
    logo:uri('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 80"><text x="0" y="38" font-family="Georgia,serif" font-size="38" font-weight="700" fill="#16213E">Balsam</text><text x="0" y="60" font-family="Arial,sans-serif" font-size="17" font-weight="700" fill="#8A6410">Creative Technology</text><text x="0" y="76" font-family="Arial,sans-serif" font-size="10" fill="#5A6174" letter-spacing="1.5">LEARN · CREATE · BUILD · GROW</text></svg>'),
    hero:uri('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 480"><ellipse cx="300" cy="430" rx="260" ry="26" fill="#E4DDCE"/><rect x="70" y="320" width="110" height="100" rx="14" fill="#E8C46F"/><rect x="200" y="250" width="110" height="170" rx="14" fill="#C79A3B"/><rect x="330" y="170" width="110" height="250" rx="14" fill="#2B3A5E"/><rect x="460" y="90" width="90" height="330" rx="14" fill="#16213E"/><g font-size="44" text-anchor="middle" dominant-baseline="central"><text x="125" y="370">💡</text><text x="255" y="335">⚙️</text><text x="385" y="295">🤖</text><text x="505" y="255">🎯</text></g><polyline points="80,250 220,170 350,110 520,40" fill="none" stroke="#C79A3B" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/><polygon points="540,28 500,34 524,66" fill="#C79A3B"/></svg>'),
    individuals:tile("🎓",soft),
    p1:tile("🎓",soft),p2:tile("💼",navy),p3:tile("🚀",soft),
    i1:tile("📈",soft),i2:tile("📣",soft),i3:tile("🤖",soft),i4:tile("✅",soft),
    t1:tile("💡",soft),t2:tile("🏢",soft),t3:tile("🛍️",soft),t4:tile("🛠️",soft),t5:tile("🏫",soft),t6:tile("👤",soft),
    d1:tile("💬",soft),d2:tile("📋",soft),d3:tile("🔍",soft),d4:tile("🗺️",soft),d5:tile("🤝",soft),d6:tile("🔁",soft)
  };
  function fixImg(img){
    if(img.closest(".ph")||img.dataset.fb)return;
    var mm=(img.getAttribute("src")||"").match(/images\/([a-z0-9]+)\./i);
    if(!mm||!fallback[mm[1]])return;
    img.dataset.fb="1";
    img.src=fallback[mm[1]];
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

  /* show-only-that-page navigation */
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
    links.forEach(function(l){
      var on=l.getAttribute("href")==="#"+r.page;
      l.classList.toggle("on",on);
      if(on)l.setAttribute("aria-current","page");else l.removeAttribute("aria-current");
    });
    document.title=titles[r.page]||titles.home;
    if(r.el){
      r.el.querySelectorAll(".rv").forEach(function(x){x.classList.add("in")});
      window.scrollTo(0,0);
      setTimeout(function(){r.el.scrollIntoView({behavior:"smooth",block:"start"})},60);
    }else{
      window.scrollTo(0,0);
      if(focus){var pg=document.getElementById(r.page);pg.setAttribute("tabindex","-1");pg.focus({preventScroll:true})}
    }
    onScroll();
  }
  document.addEventListener("click",function(e){
    var a=e.target.closest&&e.target.closest('a[href^="#"]');
    if(!a)return;
    var id=a.getAttribute("href").slice(1);
    if(!id||id==="main")return;           /* skip link: browser default */
    var el=document.getElementById(id);
    if(!el||!el.closest("main"))return;
    e.preventDefault();close();
    if(location.hash!=="#"+id)history.pushState(null,"","#"+id);
    show(id,true);
  });
  window.addEventListener("popstate",function(){show(location.hash.slice(1)||"home",true)});
  show(location.hash.slice(1)||"home",false);
})();

(function(){
  "use strict";

  /* ---------- helpers ---------- */
  var $=function(s,r){return (r||document).querySelector(s)};
  var $$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
  function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
  function save(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
  function load(k){try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}}
  function drop(k){try{localStorage.removeItem(k)}catch(e){}}
  function copyText(text,done){
    function fallback(){
      var t=document.createElement("textarea");t.value=text;t.style.cssText="position:fixed;opacity:0";
      document.body.appendChild(t);t.select();
      var ok=false;try{ok=document.execCommand("copy")}catch(e){}
      document.body.removeChild(t);done(ok);
    }
    if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(text).then(function(){done(true)},fallback)}
    else fallback();
  }

  /* One source of truth for the WhatsApp number: read it from the floating button in index.html */
  var floatBtn=$(".wa-float"),numMatch=floatBtn&&floatBtn.getAttribute("href").match(/wa\.me\/(\d+)/);
  var WA=numMatch?numMatch[1]:"919790128152";
  function waUrl(text){return "https://wa.me/"+WA+"?text="+encodeURIComponent(text)}
  function openWA(url){var w=window.open(url,"_blank");if(w){try{w.opener=null}catch(e){}}return !!w}

  var WHO={student:"a student",grad:"a graduate / job seeker",pro:"a working professional",biz:"a business owner"};

  /* =================================================================
     1. ENQUIRY FORM
     ================================================================= */
  var Enq=(function(){
    var form=$("#enq-form");
    if(!form)return {fill:function(){}};
    var el={
      name:$("#q-name"),phone:$("#q-phone"),who:$("#q-who"),interest:$("#q-interest"),
      pkg:$("#q-pkg"),pkgWrap:$("#q-pkg-wrap"),biz:$("#q-biz"),bizWrap:$("#q-biz-wrap"),
      goal:$("#q-goal"),count:$("#q-count"),chips:$("#q-chips"),preview:$("#q-preview"),status:$("#q-status")
    };

    var INTERESTS={
      ind:["Career clarity","Skill development","Interview & confidence","Digital Marketing Mentorship","Graphic Designing Mentorship","SAP Mentorship","AutoCAD Mentorship","Data Analysis Mentorship","Artificial Intelligence Mentorship","Animation Mentorship","Not sure yet"],
      biz:["Business Growth Mentorship","Marketing & branding","AI & automation","Not sure yet"]
    };
    var GOALS={
      student:["Choose the right career after my course","Build skills for my dream role","Make a 30-60-90 day plan"],
      grad:["Get my first job","Improve my resume and interview answers","Decide which role to target"],
      pro:["Switch to a new field","Prepare for a promotion","Learn the skills my target role needs"],
      biz:["Get more customers","Plan my marketing and branding","Use AI to save time in my business"]
    };
    var KEY="balsam_enquiry",touched=false;

    function timeValue(){var r=$('input[name="q-time"]:checked');return r?r.value:""}
    function vals(){
      return {name:el.name.value,phone:el.phone.value,who:el.who.value,interest:el.interest.value,
        pkg:el.pkg.value,biz:el.biz.value,goal:el.goal.value,time:timeValue()};
    }
    function cleanPhone(p){
      var c=p.replace(/[^\d+]/g,"");
      if(/^\+?91\d{10}$/.test(c))return c.replace(/^\+?91/,"");
      if(/^0\d{10}$/.test(c))return c.slice(1);
      return c.replace(/\D/g,"");
    }
    function validate(v){
      var e={};
      if(v.name.trim().length<2)e.name="Please enter your name.";
      if(!/^[6-9]\d{9}$/.test(cleanPhone(v.phone)))e.phone="Enter a valid 10-digit mobile number.";
      if(!v.who)e.who="Please choose one.";
      if(!v.interest)e.interest="Please choose what you are interested in.";
      if(v.goal.trim().length<10)e.goal="Tell us your goal in a few words (at least 10 characters).";
      return e;
    }
    function message(v){
      var L=["Hello Balsam Creative Technology,"];
      if(v.name.trim())L.push("My name is "+v.name.trim()+".");
      if(v.who)L.push("I am "+WHO[v.who]+".");
      if(v.interest&&v.interest!=="Not sure yet")L.push("I'm interested in: "+v.interest+".");
      if(v.interest==="Not sure yet")L.push("I'm not sure yet which programme suits me.");
      if(v.who==="biz"){
        if(v.pkg&&v.pkg!=="Not sure yet")L.push("Package: "+v.pkg+".");
        if(v.biz.trim())L.push("My business: "+v.biz.trim()+".");
      }
      if(v.goal.trim())L.push("My goal: "+v.goal.trim());
      if(v.time)L.push("Best time to talk: "+v.time+".");
      var d=cleanPhone(v.phone);
      if(/^[6-9]\d{9}$/.test(d))L.push("My number: +91 "+d);
      return L.join("\n");
    }
    function showErrors(errs){
      $$("[data-f]",form).forEach(function(box){
        var k=box.getAttribute("data-f"),msg=errs[k]||"",span=$("[data-err]",box),field=$("input,select,textarea",box);
        if(span)span.textContent=touched?msg:"";
        box.classList.toggle("has-err",touched&&!!msg);
        if(field)field.setAttribute("aria-invalid",touched&&msg?"true":"false");
      });
    }
    function buildInterests(keep){
      var who=el.who.value,list=(who==="biz"?INTERESTS.biz:INTERESTS.ind);
      el.interest.innerHTML='<option value="">Select…</option>'+list.map(function(o){return '<option>'+esc(o)+'</option>'}).join("");
      if(keep&&list.indexOf(keep)>-1)el.interest.value=keep;
    }
    /* suggested goals are real buttons, so keyboard and screen-reader users can use them */
    function buildChips(){
      var list=GOALS[el.who.value]||[];
      el.chips.innerHTML=list.map(function(g){
        return '<button type="button" class="chip-btn" data-goal="'+esc(g)+'">+ '+esc(g)+'</button>';
      }).join("");
    }
    function onWho(keepInterest){
      var biz=el.who.value==="biz";
      el.pkgWrap.hidden=!biz;el.bizWrap.hidden=!biz;
      buildInterests(keepInterest);buildChips();
    }
    function refresh(){
      var v=vals(),msg=message(v),hasAny=v.name||v.who||v.goal;
      el.preview.textContent=hasAny?msg:"Your message will appear here as you fill in the form.";
      el.preview.classList.toggle("empty",!hasAny);
      el.count.textContent=el.goal.value.length+" / 400";
      if(touched)showErrors(validate(v));
    }
    function fill(o){
      if(o.notBiz&&el.who.value==="biz"){el.who.value="";onWho()}
      if(o.who){el.who.value=o.who;onWho(o.interest)}
      if(o.interest){var ok=$$("option",el.interest).some(function(x){return x.value===o.interest});if(ok)el.interest.value=o.interest}
      if(o.pkg)el.pkg.value=o.pkg;
      if(o.goal)el.goal.value=o.goal.slice(0,400);
      refresh();
    }

    el.who.addEventListener("change",function(){onWho(el.interest.value);refresh()});
    form.addEventListener("input",refresh);
    form.addEventListener("change",refresh);
    el.chips.addEventListener("click",function(e){
      var t=e.target.closest&&e.target.closest("[data-goal]");if(!t)return;
      var g=t.getAttribute("data-goal"),cur=el.goal.value.trim();
      if(cur&&!/[.!?]$/.test(cur))cur+=".";
      el.goal.value=((cur?cur+" ":"")+g).slice(0,400);
      refresh();el.goal.focus();
    });
    $("#q-copy").addEventListener("click",function(){
      var btn=this;
      copyText(message(vals()),function(ok){btn.textContent=ok?"Copied ✓":"Press Ctrl+C to copy";setTimeout(function(){btn.textContent="Copy message"},1800)});
    });
    form.addEventListener("submit",function(e){
      e.preventDefault();touched=true;
      var v=vals(),errs=validate(v);showErrors(errs);
      var first=Object.keys(errs)[0];
      if(first){
        var box=$('[data-f="'+first+'"]',form),f=box&&$("input,select,textarea",box);
        if(f)f.focus();
        el.status.textContent="Please fix the highlighted fields.";return;
      }
      var url=waUrl(message(v)),opened=openWA(url);
      el.status.innerHTML=opened?"WhatsApp is opening with your message. If it did not open, <a class=\"textlink\" href=\""+url+"\" target=\"_blank\" rel=\"noopener noreferrer\">tap here</a>."
                                :"Your browser blocked the pop-up. <a class=\"textlink\" href=\""+url+"\" target=\"_blank\" rel=\"noopener noreferrer\">Tap here to open WhatsApp</a>.";
      drop(KEY);
    });

    /* the form always starts empty: clear anything older versions saved in this browser */
    drop(KEY);
    onWho();
    refresh();
    return {fill:fill};
  })();

  /* =================================================================
     2. PACKAGES  (cards / compare / select)
     ================================================================= */
  (function(){
    var cards=$("#pkg-cards");if(!cards)return;
    var cmp=$("#pkg-compare"),bar=$("#pickbar"),nameEl=$("#pickname"),views=$$(".seg button");
    var NAMES=["Starter","Growth","Premium"],sel=null;
    drop("balsam_pkg");  /* a package choice is no longer remembered between visits */

    /* the compare table reads prices from the cards, so prices are edited in one place only */
    NAMES.forEach(function(n){
      var p=$('[data-pkg-card="'+n+'"] .price'),txt=p?p.textContent.replace(/\s*\/\s*/," / ").replace(/\s+/g," ").trim():"";
      $$('[data-price="'+n+'"]').forEach(function(c){c.textContent=txt});
    });

    function setView(v){
      cards.hidden=v!=="cards";cmp.hidden=v!=="compare";
      views.forEach(function(x){x.setAttribute("aria-pressed",x.getAttribute("data-view")===v?"true":"false")});
    }
    views.forEach(function(x){x.addEventListener("click",function(){setView(x.getAttribute("data-view"))})});

    function paint(){
      $$("[data-pkg-card]").forEach(function(c){c.classList.toggle("picked",c.getAttribute("data-pkg-card")===sel)});
      $$("[data-pkg]").forEach(function(x){
        var on=x.getAttribute("data-pkg")===sel;
        x.setAttribute("aria-pressed",on?"true":"false");
        x.textContent=on?"Selected ✓":x.getAttribute("data-label");
      });
      bar.hidden=!sel;if(sel)nameEl.textContent=sel;
    }
    function choose(n){
      sel=(sel===n)?null:n;
      if(sel){Enq.fill({who:"biz",interest:"Business Growth Mentorship",pkg:sel})}
      else{Enq.fill({pkg:"Not sure yet"})}
      paint();
    }
    $$("[data-pkg]").forEach(function(x){x.addEventListener("click",function(){choose(x.getAttribute("data-pkg"))})});
    $("#pickclear").addEventListener("click",function(){if(sel)choose(sel)});
    setView("cards");
    paint();
  })();

  /* =================================================================
     3. GROWTH PLANNER
     ================================================================= */
  (function(){
    var form=$("#plan-form");if(!form)return;
    var out=$("#plan-out"),errEl=$("#pl-err"),countEl=$("#pl-count");
    var boxes=$$("#pl-focus input");
    var AREAS={
      customers:{label:"Get more customers",metric:"New enquiries per week",
        p1:["Define your ideal customer and main offer in one clear sentence","List 20 past or likely customers and ask 5 of them why they chose you"],
        p2:["Run one simple lead source (referrals, a local listing or social media) every week","Reply to every enquiry within 24 hours and follow up after 3 days"],
        p3:["Put more effort into the source that brought the most enquiries","Ask happy customers for reviews and referrals every month"]},
      marketing:{label:"Marketing & branding",metric:"Enquiries coming from your profiles",
        p1:["Make your name, logo, contact details and offer the same on every profile","Write a clear “who we help and how” message"],
        p2:["Post two useful posts a week that show real work or tips","Create one simple page or catalogue that explains your services"],
        p3:["Check which posts brought enquiries and repeat the best ones","Plan the next quarter’s content in one sheet"]},
      ai:{label:"AI & automation",metric:"Hours saved per week",
        p1:["List the repeated tasks that take you more than 2 hours a week","Pick the 2 most routine tasks that are easiest to automate"],
        p2:["Try one AI tool for drafting replies, posts or quotes, and check every output before use","Automate one routine such as reminders, forms or confirmations"],
        p3:["Measure the hours saved and keep only what works","Write simple steps so your team can repeat the workflow"]},
      sales:{label:"Sales process",metric:"Enquiry-to-sale conversion",
        p1:["Write down every step from enquiry to payment","Find where most enquiries drop off"],
        p2:["Prepare short answers to the questions and objections you hear most","Track every lead in one sheet with the next step and date"],
        p3:["Test one change in your offer or follow-up and compare the results","Set a monthly sales target and review it every week"]},
      ops:{label:"Operations",metric:"On-time delivery rate",
        p1:["Map how an order or service is delivered today","Mark the 3 biggest delays or mistakes"],
        p2:["Write a checklist for each repeated job","Give each step a clear owner and deadline"],
        p3:["Review mistakes every month and update the checklists","Plan your capacity for the busiest weeks"]},
      team:{label:"Team productivity",metric:"Tasks completed on time",
        p1:["List each person’s role and weekly priorities","Hold a 15-minute weekly meeting to set tasks"],
        p2:["Use one shared task list with owners and dates","Agree how work is handed over and checked"],
        p3:["Give feedback every month using the numbers","Train one person to handle routine work independently"]}
    };
    var STAGE={
      start:{label:"Just starting",lead:"Write down your offer, your ideal customer and your 3-month goal"},
      stuck:{label:"Running but stuck",lead:"Review the last 90 days: what worked, what stalled and why"},
      scale:{label:"Ready to scale",lead:"Pick the 2 numbers that matter most and record today’s baseline"}
    };
    var PKG={Starter:"Business Clarity",Growth:"Business Accelerator",Premium:"Business Transformation"};
    var lastText="";

    /* allow at most 3 focus areas */
    function limit(){
      var n=boxes.filter(function(x){return x.checked}).length;
      boxes.forEach(function(x){x.disabled=!x.checked&&n>=3});
      countEl.textContent=n>=3?"3 of 3 chosen":"Choose up to 3";
      if(n)errEl.textContent="";
    }
    boxes.forEach(function(x){x.addEventListener("change",limit)});

    function suggest(n,hours,stage){
      var pts=n+(hours==="10"?2:hours==="5"?1:0)+(stage==="scale"?1:0);
      return pts<=2?"Starter":pts<=4?"Growth":"Premium";
    }
    function build(){
      var type=$("#pl-type").value,stage=$('input[name="pl-stage"]:checked').value,hours=$('input[name="pl-hours"]:checked').value;
      var picked=boxes.filter(function(x){return x.checked}).map(function(x){return x.value});
      var P=[[],[],[]];
      P[0].push(STAGE[stage].lead);
      picked.forEach(function(k){P[0]=P[0].concat(AREAS[k].p1);P[1]=P[1].concat(AREAS[k].p2);P[2]=P[2].concat(AREAS[k].p3)});
      var cap=picked.length===1?3:picked.length===2?5:6;
      P=P.map(function(a){return a.slice(0,cap)});
      var titles=[["Days 1–30","Foundation"],["Days 31–60","Build"],["Days 61–90","Scale and review"]];
      return {type:type,stage:STAGE[stage].label,hours:hours==="10"?"10+":hours,picked:picked,P:P,titles:titles,
        metrics:picked.map(function(k){return AREAS[k].metric}),pkg:suggest(picked.length,hours,stage)};
    }
    function toText(r){
      var L=["My 90-day growth plan — Balsam Creative Technology","",
        r.type+" · "+r.stage+" · about "+r.hours+" hours a week","Focus: "+r.picked.map(function(k){return AREAS[k].label}).join(", "),""];
      r.P.forEach(function(tasks,i){L.push(r.titles[i][0]+" — "+r.titles[i][1]);tasks.forEach(function(t){L.push("• "+t)});L.push("")});
      L.push("Numbers to track: "+r.metrics.join("; "));
      L.push("Suggested package: "+r.pkg+" ("+PKG[r.pkg]+")");
      return L.join("\n");
    }
    function render(r){
      lastText=toText(r);
      var focusNames=r.picked.map(function(k){return AREAS[k].label}).join(", ");
      out.innerHTML=
        '<div class="plan-head"><h3 tabindex="-1" id="plan-title">Your 90-day growth plan</h3>'+
        '<p>'+esc(r.type)+' · '+esc(r.stage)+' · about '+esc(r.hours)+' hours a week<br>Focus: '+esc(focusNames)+'</p></div>'+
        '<div class="phases">'+r.P.map(function(tasks,i){
          return '<div class="phase"><h4>'+esc(r.titles[i][1])+'<small>'+esc(r.titles[i][0])+'</small></h4><ul>'+tasks.map(function(t){return "<li>"+esc(t)+"</li>"}).join("")+'</ul></div>';
        }).join("")+'</div>'+
        '<div class="label">Numbers to track</div><div class="metrics">'+r.metrics.map(function(x){return "<span>"+esc(x)+"</span>"}).join("")+'</div>'+
        '<div class="rec"><b>Suggested package: '+esc(r.pkg)+' — '+esc(PKG[r.pkg])+'</b><p>Based on your focus areas and the time you can give. Your mentor confirms the right scope with you.</p></div>'+
        '<div class="plan-actions"><button type="button" class="btn ghost" id="pl-copy">Copy plan</button>'+
        '<a class="btn wa" target="_blank" rel="noopener noreferrer" href="'+esc(waUrl("Hello Balsam Creative Technology,\nI made this plan with your Growth Planner and would like to discuss it.\n\n"+lastText))+'">Send on WhatsApp ↗</a>'+
        '<a class="btn" id="pl-use" href="#contact">Use in enquiry form</a></div>';
      $("#pl-copy",out).addEventListener("click",function(){
        var btn=this;copyText(lastText,function(ok){btn.textContent=ok?"Copied ✓":"Press Ctrl+C to copy";setTimeout(function(){btn.textContent="Copy plan"},1800)});
      });
      $("#pl-use",out).addEventListener("click",function(){
        Enq.fill({who:"biz",interest:"Business Growth Mentorship",pkg:r.pkg,goal:"I want to improve: "+focusNames+" ("+r.type+", "+r.stage.toLowerCase()+")."});
      });
      $("#plan-title",out).focus();
    }
    form.addEventListener("submit",function(e){
      e.preventDefault();
      if(!boxes.some(function(x){return x.checked})){errEl.textContent="Please choose at least one area to improve.";boxes[0].focus();return}
      render(build());
    });
    limit();
  })();

  /* =================================================================
     4. FIND A MENTOR  (search + category chips + cards)
     To add or edit a track, change the TRACKS list below. Nothing else.
     Photos live in images/skills/ (lowercase file names).
     To show a real mentor on a card, add:  mentor:{name:"Full Name",role:"10 years in SAP"}
     ================================================================= */
  (function(){
    var grid=$("#m-grid");if(!grid)return;
    var search=$("#m-search"),clearBtn=$("#m-clear"),catsEl=$("#m-cats"),
        countEl=$("#m-count"),emptyEl=$("#m-empty");

    var CATS=["All","Creative","Marketing","Engineering & ERP","Data & AI"];

    var TRACKS=[
      {id:"dm",name:"Digital Marketing",img:"images/skills/digital-marketing.jpg",cat:"Marketing",interest:"Digital Marketing Mentorship",
       tagline:"Plan, run and measure campaigns that bring real customers.",
       tools:["SEO","Social media","Google Ads","Meta Ads","Email"],
       learn:["Build a content and campaign plan","Run and review a live campaign","Read analytics and improve results"],
       levels:["Beginner","Intermediate","Advanced"],
       keywords:"seo social media ads instagram facebook content branding marketing"},
      {id:"gd",name:"Graphic Designing",img:"images/skills/graphic-designing.jpg",cat:"Creative",interest:"Graphic Designing Mentorship",
       tagline:"Design logos, posts and brand visuals that look professional.",
       tools:["Photoshop","Illustrator","Canva","Figma"],
       learn:["Learn layout, colour and typography","Design a logo and brand kit","Build a portfolio of real pieces"],
       levels:["Beginner","Intermediate"],
       keywords:"logo poster branding ui ux photoshop illustrator canva coreldraw design"},
      {id:"an",name:"Animation",img:"images/skills/animation.jpg",cat:"Creative",interest:"Animation Mentorship",
       tagline:"Bring ideas to life with 2D animation and motion graphics.",
       tools:["After Effects","Blender","Adobe Animate"],
       learn:["Understand timing, motion and storyboarding","Create a short animated piece","Prepare a showreel"],
       levels:["Beginner","Intermediate"],
       keywords:"2d 3d motion graphics video vfx cartoon character"},
      {id:"sap",name:"SAP",img:"images/skills/sap.jpg",cat:"Engineering & ERP",interest:"SAP Mentorship",
       tagline:"Learn how SAP runs business processes, step by step.",
       tools:["SAP FICO","SAP MM"],
       learn:["Understand core ERP processes and navigation","Practise one module with real scenarios","Prepare for interviews and certification"],
       levels:["Beginner","Intermediate"],
       keywords:"erp finance fico mm sd abap hana certification"},
      {id:"cad",name:"AutoCAD",img:"images/skills/autocad.jpg",cat:"Engineering & ERP",interest:"AutoCAD Mentorship",
       tagline:"Draw accurate 2D and 3D technical drawings.",
       tools:["2D drafting","3D modelling","Dimensioning","Plotting"],
       learn:["Master drawing, editing and dimension tools","Prepare drawings to professional standards","Build a portfolio of drawings"],
       levels:["Beginner","Intermediate","Advanced"],
       keywords:"cad drafting civil mechanical architecture engineering drawing autodesk"},
      {id:"da",name:"Data Analysis",img:"images/skills/data-analysis.jpg",cat:"Data & AI",interest:"Data Analysis Mentorship",
       tagline:"Turn raw data into clear answers and dashboards.",
       tools:["Excel","SQL","Power BI","Python"],
       learn:["Clean and organise data","Find patterns with formulas and queries","Build a dashboard and explain it"],
       levels:["Beginner","Intermediate","Advanced"],
       keywords:"excel sql power bi tableau python analytics dashboard statistics"},
      {id:"ai",name:"Artificial Intelligence",img:"images/skills/ai.jpg",cat:"Data & AI",interest:"Artificial Intelligence Mentorship",
       tagline:"Use AI tools well and learn the basics of machine learning.",
       tools:["AI tools","Prompting","Python","Machine learning"],
       learn:["Understand what AI can and cannot do","Use AI tools to work faster","Build a small AI project"],
       levels:["Beginner","Intermediate","Advanced"],
       keywords:"ai ml machine learning chatgpt automation python prompt generative"}
    ];

    var state={q:"",cat:"All"};

    /* build the controls */
    function catCount(c){return c==="All"?TRACKS.length:TRACKS.filter(function(t){return t.cat===c}).length}
    function buildCats(){
      catsEl.innerHTML=CATS.map(function(c){
        return '<button type="button" class="chip-btn" data-cat="'+esc(c)+'" aria-pressed="'+(state.cat===c)+'">'+esc(c)+'<small>'+catCount(c)+'</small></button>';
      }).join("");
    }

    function tokens(){return state.q.toLowerCase().split(/\s+/).filter(Boolean)}
    function haystack(t){
      return [t.name,t.cat,t.tagline,t.tools.join(" "),t.learn.join(" "),t.keywords,t.mentor?t.mentor.name+" "+(t.mentor.role||""):""].join(" ").toLowerCase();
    }
    function matches(t){
      if(state.cat!=="All"&&t.cat!==state.cat)return false;
      var tk=tokens(),h=haystack(t);
      return tk.every(function(w){return h.indexOf(w)>-1});
    }
    /* wrap the searched words in <mark>, escaping everything else */
    function hl(text){
      var tk=tokens();if(!tk.length)return esc(text);
      var re=new RegExp("("+tk.map(function(w){return w.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}).join("|")+")","ig");
      return text.split(re).map(function(p,i){return i%2?"<mark>"+esc(p)+"</mark>":esc(p)}).join("");
    }
    function card(t,i){
      return '<article class="mcard" style="animation-delay:'+Math.min(i,8)*0.04+'s">'+
        '<div class="mtop"><span class="mic" aria-hidden="true"><img src="'+esc(t.img)+'" data-art="'+esc(art(t))+'" alt="" width="400" height="170"></span><span class="mtag">'+esc(t.cat)+'</span></div>'+
        '<h3>'+hl(t.name)+'</h3><p class="mline">'+hl(t.tagline)+'</p>'+
        '<div class="tools" aria-label="Tools and topics">'+t.tools.map(function(x){return "<span>"+hl(x)+"</span>"}).join("")+'</div>'+
        '<ul class="list">'+t.learn.map(function(x){return "<li>"+esc(x)+"</li>"}).join("")+'</ul>'+
        (t.mentor?'<p class="mmentor"><b>Mentor:</b> '+esc(t.mentor.name)+(t.mentor.role?' · '+esc(t.mentor.role):'')+'</p>':'')+
        '<div class="mact"><a class="btn" href="#contact" data-enq="'+esc(t.id)+'">Enquire about '+esc(t.name)+'</a></div></article>';
    }
    function render(){
      var list=TRACKS.filter(matches);
      grid.innerHTML=list.map(card).join("");
      emptyEl.hidden=list.length>0;
      grid.hidden=list.length===0;
      countEl.textContent=list.length===TRACKS.length?"Showing all "+TRACKS.length+" mentorship tracks":"Showing "+list.length+" of "+TRACKS.length+" tracks";
      clearBtn.hidden=!state.q;
      $$("[data-cat]",catsEl).forEach(function(b){b.setAttribute("aria-pressed",b.getAttribute("data-cat")===state.cat?"true":"false")});
    }
    function reset(){
      state={q:"",cat:"All"};
      search.value="";render();
    }

    /* events */
    search.addEventListener("input",function(){state.q=search.value.trim();render()});
    search.addEventListener("keydown",function(e){if(e.key==="Escape"&&search.value){search.value="";state.q="";render()}});
    clearBtn.addEventListener("click",function(){search.value="";state.q="";render();search.focus()});
    catsEl.addEventListener("click",function(e){
      var b=e.target.closest&&e.target.closest("[data-cat]");if(!b)return;
      state.cat=b.getAttribute("data-cat");render();
    });
    $("#m-reset").addEventListener("click",reset);
    /* "Enquire" fills the enquiry form, then the normal #contact navigation runs */
    grid.addEventListener("click",function(e){
      var a=e.target.closest&&e.target.closest("[data-enq]");if(!a)return;
      var id=a.getAttribute("data-enq"),t=TRACKS.filter(function(x){return x.id===id})[0];
      if(t)Enq.fill({notBiz:true,interest:t.interest,goal:"I would like mentorship in "+t.name+"."});
    });
    /* Home skill chips: open Find a Mentor already filtered to that skill */
    document.addEventListener("click",function(e){
      var c=e.target.closest&&e.target.closest("[data-skill]");if(!c)return;
      state={q:c.getAttribute("data-skill"),cat:"All"};
      search.value=state.q;render();
    });

    /* Built-in artwork for every track. It shows automatically whenever the photo file
       in images/skills/ is missing or empty. A real photo, once added, is used instead. */
    function art(t){
      var icons={dm:"📣",gd:"🎨",an:"🎬",sap:"📊",cad:"📐",da:"📈",ai:"🤖"};
      var cols={dm:["#16213E","#C79A3B"],gd:["#2B1B4E","#D9923B"],an:["#4A1F4F","#E8C46F"],sap:["#10304A","#5FA8D3"],cad:["#1F2A44","#B8C4D6"],da:["#0F3D3E","#E8C46F"],ai:["#16213E","#7C8CFF"]};
      var c=cols[t.id]||["#16213E","#C79A3B"];
      var svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 300"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="'+c[0]+'"/><stop offset="1" stop-color="'+c[1]+'"/></linearGradient></defs><rect width="600" height="300" fill="url(#g)"/><circle cx="500" cy="40" r="120" fill="#fff" opacity=".08"/><circle cx="80" cy="280" r="100" fill="#fff" opacity=".07"/><text x="300" y="150" font-size="110" text-anchor="middle" dominant-baseline="central">'+(icons[t.id]||"⭐")+'</text></svg>';
      return "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(svg);
    }
    /* Home skill chips use the same artwork when their photo is missing */
    $$(".chip-ph").forEach(function(i){
      var a=i.closest("[data-skill]"),n=a&&a.getAttribute("data-skill");
      var t=TRACKS.filter(function(x){return x.name===n})[0];
      if(t){i.dataset.art=art(t);if(i.complete&&!i.naturalWidth)i.src=i.dataset.art}
    });

    buildCats();render();
  })();
})();