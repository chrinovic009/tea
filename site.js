(function(){
  var EN=(document.documentElement.lang||"").slice(0,2)==="en";
  var burger=document.getElementById("burger"),menu=document.getElementById("menu");
  function closeMenu(){if(menu){menu.classList.remove("open")}if(burger){burger.setAttribute("aria-expanded","false")}}
  if(burger&&menu){
    burger.addEventListener("click",function(){var o=menu.classList.toggle("open");burger.setAttribute("aria-expanded",o)});
    menu.querySelectorAll("a").forEach(function(a){a.addEventListener("click",closeMenu)});
  }

  /* Onglets des pôles (accueil) */
  var poles=document.querySelectorAll(".poles button");
  poles.forEach(function(b){b.addEventListener("click",function(){
    poles.forEach(function(x){x.setAttribute("aria-selected",x===b)});
    var mc=document.getElementById("cards-mc"),rh=document.getElementById("cards-rh");
    if(mc&&rh){mc.hidden=b.dataset.pole!=="mc";rh.hidden=b.dataset.pole!=="rh"}
  })});

  /* Candidature */
  if(location.hash==="#candidature"){var dd=document.getElementById("dom");if(dd)dd.value="Candidature"}
  document.querySelectorAll('[data-sujet="cand"]').forEach(function(a){a.addEventListener("click",function(){var d=document.getElementById("dom");if(d)d.value="Candidature"})});

  /* Tableau du parc (page location d'engins) */
  var tb=document.getElementById("fleet");
  if(tb){
    var fleet=EN?{
      ter:[["Crawler hydraulic excavator","30–50 t","Bucket 2.0–3.2 m³","With operator","ok"],["Wheel loader","20–25 t","Bucket 3.5–4.5 m³","With / without operator","ok"],["Bulldozer","D6 – D8","Blade 4–7 m³","With operator","w"],["Motor grader","14–16 t","Blade 3.7–4.3 m","With operator","ok"],["Single-drum roller","12–16 t","Width 2.1 m","With / without operator","ok"]],
      tra:[["6×4 tipper truck","30–40 t","16–20 m³","With driver","ok"],["Articulated dump truck","25–40 t","15–24 m³","With operator","w"],["Low-bed trailer","Low-loader","Up to 60 t","With driver","ok"],["Tanker truck","Water / fuel","20,000–35,000 L","With driver","ok"]],
      lev:[["Mobile crane","All-terrain","25–50 t","With crane operator","w"],["Telehandler","All-terrain","4 t · 17 m","With / without operator","ok"],["Generator","Diesel","100–500 kVA","Without operator","ok"],["Lighting tower","Mobile","4 × 400 W LED","Without operator","ok"]]
    }:{
      ter:[["Pelle hydraulique sur chenilles","30–50 t","Godet 2,0–3,2 m³","Avec opérateur","ok"],["Chargeuse sur pneus","20–25 t","Godet 3,5–4,5 m³","Avec / sans opérateur","ok"],["Bulldozer","D6 – D8","Lame 4–7 m³","Avec opérateur","w"],["Niveleuse","14–16 t","Lame 3,7–4,3 m","Avec opérateur","ok"],["Compacteur monocylindre","12–16 t","Largeur 2,1 m","Avec / sans opérateur","ok"]],
      tra:[["Camion benne 6×4","30–40 t","16–20 m³","Avec chauffeur","ok"],["Tombereau articulé","25–40 t","15–24 m³","Avec opérateur","w"],["Semi porte-engins","Surbaissé","Jusqu'à 60 t","Avec chauffeur","ok"],["Camion citerne","Eau / carburant","20 000–35 000 L","Avec chauffeur","ok"]],
      lev:[["Grue mobile","Tout-terrain","25–50 t","Avec grutier","w"],["Chariot télescopique","Tout-terrain","4 t · 17 m","Avec / sans opérateur","ok"],["Groupe électrogène","Diesel","100–500 kVA","Sans opérateur","ok"],["Tour d'éclairage","Mobile","4 × 400 W LED","Sans opérateur","ok"]]
    };
    var tabs=document.querySelectorAll(".tabs button");
    function show(cat){
      tb.innerHTML=fleet[cat].map(function(r){return '<tr><td>'+r[0]+'</td><td>'+r[1]+'</td><td class="n">'+r[2]+'</td><td>'+r[3]+'</td><td><span class="pill '+r[4]+'">'+(r[4]==="ok"?(EN?"Available":"Disponible"):(EN?"On request":"Sur réservation"))+'</span></td></tr>'}).join("");
      tabs.forEach(function(b){b.setAttribute("aria-selected",b.dataset.cat===cat)});
    }
    tabs.forEach(function(b){b.addEventListener("click",function(){show(b.dataset.cat)})});
    show("ter");
  }

  /* Formulaire de contact (accueil) */
  var form=document.getElementById("devis");
  if(form){form.addEventListener("submit",function(e){
    e.preventDefault();
    var ok=document.getElementById("ok"),nom=document.getElementById("nom"),mail=document.getElementById("mail");
    ok.hidden=false;
    if(!nom.value.trim()||!/\S+@\S+\.\S+/.test(mail.value)){
      ok.textContent=EN?"Please enter your name and a valid email address so we can reply.":"Indiquez votre nom et une adresse e-mail valide pour qu'on puisse vous répondre.";
      (nom.value.trim()?mail:nom).focus();return;
    }
    var subj=document.getElementById("dom").options[document.getElementById("dom").selectedIndex].text;
    var btn=form.querySelector('button[type="submit"]');
    var T=EN?{sending:"Sending…",ok:"Thank you "+nom.value.trim()+". Your message has been sent. We will get back to you shortly.",wait:"Please wait a few seconds before sending another message.",fail:"Your message could not be sent. Please call us on +243 82 03 95 363 or email info@tea-rdc.com."}
           :{sending:"Envoi en cours…",ok:"Merci "+nom.value.trim()+". Votre message a bien été envoyé. Nous vous répondrons rapidement.",wait:"Patientez quelques secondes avant d'envoyer un autre message.",fail:"Votre message n'a pas pu être envoyé. Appelez-nous au +243 82 03 95 363 ou écrivez à info@tea-rdc.com."};
    var fd=new FormData(form);fd.set("objet",subj);fd.set("lang",EN?"en":"fr");
    ok.textContent=T.sending;if(btn)btn.disabled=true;
    fetch(form.getAttribute("action")||"contact.php",{method:"POST",body:fd,headers:{"Accept":"application/json"}})
      .then(function(r){return r.json().then(function(d){return{status:r.status,d:d}})})
      .then(function(x){
        if(x.d&&x.d.ok){ok.textContent=T.ok;form.reset();}
        else if(x.status===429){ok.textContent=T.wait;}
        else{ok.textContent=T.fail;}
      })
      .catch(function(){
        /* Pas de serveur PHP (aperçu, GitHub Pages) : message d'aperçu */
        ok.textContent=EN?"Thank you "+nom.value.trim()+". Your message (“"+subj+"”) is ready. Preview: sending works once the site is hosted on Infomaniak.":"Merci "+nom.value.trim()+". Votre message (« "+subj+" ») est prêt. Aperçu : l'envoi fonctionne une fois le site hébergé sur Infomaniak.";
      })
      .then(function(){if(btn)btn.disabled=false;});
  })}

  /* ==== Animations ==== */
  var reduce=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
  var header=document.querySelector("header");
  var top=document.createElement("button");top.className="totop";top.type="button";top.setAttribute("aria-label",EN?"Back to top":"Revenir en haut");top.textContent="↑";
  top.addEventListener("click",function(){window.scrollTo({top:0,behavior:reduce?"auto":"smooth"})});
  document.body.appendChild(top);
  function onScroll(){var y=window.scrollY||0;if(header)header.classList.toggle("scrolled",y>40);top.classList.toggle("show",y>600)}
  window.addEventListener("scroll",onScroll,{passive:true});onScroll();

  /* Apparition au défilement : seuls les éléments hors de l'écran au chargement sont masqués */
  if(!reduce&&"IntersectionObserver" in window){
    var sel=[".presta-grid li",".icard",".vmb",".q",".join",".dom-grid .dom",".member",".dom",".vals li",".steps li",".reel .center",".cta-photo h2",".cta-lines",".gallery figure",".statement p",".fig",".photo",".about>div",".pillar",".behind h2",".vm",".center",".poles",".card",".cta-box",".talent>div",".job",".office",".cp-card",".cp-end",".presta li",".member",".lead-p",".page-body h2",".aside .box",".tablewrap",".foot-note",".values li"];
    var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.remove("rv-pre");io.unobserve(en.target)}})},{rootMargin:"0px 0px -8% 0px"});
    var vh=window.innerHeight;
    document.querySelectorAll(sel.join(",")).forEach(function(el){
      if(el.getBoundingClientRect().top<vh*0.95)return;
      var sib=el.parentElement?Array.prototype.indexOf.call(el.parentElement.children,el):0;
      el.classList.add("rv","rv-pre");el.style.transitionDelay=Math.min(sib,6)*80+"ms";
      io.observe(el);
    });
  }

  /* Chiffres clés qui défilent */
  var figs=document.querySelectorAll(".fig b[data-to]");
  function count(el){var to=+el.dataset.to,t0=null,d=1400;
    if(reduce){el.textContent=to;return}
    function step(t){if(!t0)t0=t;var p=Math.min((t-t0)/d,1);el.textContent=Math.round(to*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(step)}
    requestAnimationFrame(step)}
  if(figs.length){
    if("IntersectionObserver" in window){var fo=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){count(en.target);fo.unobserve(en.target)}})},{threshold:.6});figs.forEach(function(f){fo.observe(f)})}
  }
})();
