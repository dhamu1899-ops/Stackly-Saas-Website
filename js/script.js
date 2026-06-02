const menuBtn=document.querySelector('.hamburger');const navLinks=document.querySelector('.nav-links');if(menuBtn){menuBtn.addEventListener('click',()=>navLinks.classList.toggle('open'))}
document.querySelectorAll('.nav-links a').forEach(a=>{if(a.href===location.href)a.classList.add('active')});
const revealEls=document.querySelectorAll('.reveal,.reveal-left,.reveal-right');const io=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('show');io.unobserve(e.target)}})},{threshold:.12});revealEls.forEach(el=>io.observe(el));
document.querySelectorAll('[data-count]').forEach(el=>{let done=false;const obs=new IntersectionObserver(es=>{if(es[0].isIntersecting&&!done){done=true;let end=+el.dataset.count,cur=0,step=Math.ceil(end/60);const t=setInterval(()=>{cur+=step;if(cur>=end){cur=end;clearInterval(t)}el.textContent=cur+'+'},25)}},{threshold:.7});obs.observe(el)});
let slideIndex=0;const slides=document.querySelector('.slides');const dots=document.querySelectorAll('.dot');function showSlide(i){if(!slides)return;slideIndex=i;slides.style.transform=`translateX(-${i*100}%)`;dots.forEach((d,idx)=>d.classList.toggle('active',idx===i))}dots.forEach((d,i)=>d.addEventListener('click',()=>showSlide(i)));if(slides){setInterval(()=>showSlide((slideIndex+1)%dots.length),3800)}

// ===== Final premium interaction layer =====
const header = document.querySelector('.header');
function updateHeader(){
  if(!header) return;
  header.classList.toggle('scrolled', window.scrollY > 35);
}
updateHeader();
window.addEventListener('scroll', updateHeader, {passive:true});

// close mobile menu after clicking a link
if(navLinks){
  document.querySelectorAll('.nav-links a').forEach(link=>{
    link.addEventListener('click',()=>navLinks.classList.remove('open'));
  });
}

// add automatic reveal classes to common elements if any page misses them
const autoRevealSelectors = '.card, .split-img, .section-title, .section-lead, .eyebrow, .form, .map';
document.querySelectorAll(autoRevealSelectors).forEach((el)=>{
  if(!el.classList.contains('reveal') && !el.classList.contains('reveal-left') && !el.classList.contains('reveal-right')){
    el.classList.add('reveal');
    io.observe(el);
  }
});

// 3D tilt effect for cards on desktop
const canTilt = window.matchMedia('(min-width: 992px)').matches;
if(canTilt){
  document.querySelectorAll('.card').forEach(card=>{
    card.addEventListener('mousemove',(e)=>{
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const rotateY = ((x / r.width) - .5) * 6;
      const rotateX = ((y / r.height) - .5) * -6;
      card.style.transform = `translateY(-12px) scale(1.015) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    card.addEventListener('mouseleave',()=>{
      card.style.transform = '';
    });
  });
}


// ===== Stackly role-based login/signup and dashboards =====
function stacklyNameFromEmail(email){
  const prefix=(email||'User').split('@')[0].replace(/[._-]+/g,' ');
  return prefix.replace(/\b\w/g, c=>c.toUpperCase());
}
const loginForm=document.getElementById('loginForm');
if(loginForm){
  loginForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const role=document.getElementById('loginRole').value;
    const email=document.getElementById('loginEmail').value.trim();
    localStorage.setItem('stacklyUserEmail', email || (role==='admin'?'admin@stackly.com':'user@stackly.com'));
    localStorage.setItem('stacklyUserName', stacklyNameFromEmail(email));
    localStorage.setItem('stacklyRole', role);
    window.location.href = role==='admin' ? 'admin-dashboard.html' : 'user-dashboard.html';
  });
}
const signupForm=document.getElementById('signupForm');
if(signupForm){
  signupForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const pass=document.getElementById('signupPassword').value;
    const confirm=document.getElementById('confirmPassword').value;
    if(pass!==confirm){alert('Password and confirm password must match.');return;}
    const role=document.getElementById('signupRole').value;
    const email=document.getElementById('signupEmail').value.trim();
    const name=stacklyNameFromEmail(email);
    localStorage.setItem('stacklyUserEmail', email || 'user@stackly.com');
    localStorage.setItem('stacklyUserName', name);
    localStorage.setItem('stacklyRole', role);
    window.location.href = 'login.html';
  });
}
document.querySelectorAll('.toggle-password').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const input=btn.parentElement.querySelector('input');
    input.type=input.type==='password'?'text':'password';
  });
});
if(document.body.classList.contains('dashboard-page')){
  const name=localStorage.getItem('stacklyUserName') || 'Dhamu';
  const email=localStorage.getItem('stacklyUserEmail') || 'dhamu@gmail.com';
  const n=document.getElementById('dashName'); const em=document.getElementById('dashEmail'); const topEm=document.getElementById('topEmail');
  if(n)n.textContent=name; if(em)em.textContent=email; if(topEm)topEm.textContent=email;
  document.querySelectorAll('.dash-menu a').forEach(link=>{
    link.addEventListener('click',()=>{
      document.querySelectorAll('.dash-menu a').forEach(a=>a.classList.remove('active'));
      document.querySelectorAll('.dash-panel').forEach(p=>p.classList.remove('active'));
      link.classList.add('active');
      const panel=document.getElementById(link.dataset.panel);
      if(panel) panel.classList.add('active');
    });
  });
  document.querySelectorAll('.logout-btn').forEach(btn=>btn.addEventListener('click',()=>{ window.location.href='index.html'; }));
  // Dashboard mobile hamburger is handled by the reliable handler below.
}



// ===== Stackly launch + logo-only premium loader =====
(function(){
  const LOGO_PATH = 'assets/logo/stackly-logo.svg';

  const loader = document.createElement('div');
  loader.className = 'stackly-loader hide';
  loader.innerHTML = `
    <div class="loader-orbit-card" role="status" aria-live="polite">
      <div class="loader-orbit">
        <span class="orbit-dot dot-one"></span>
        <span class="orbit-dot dot-two"></span>
        <span class="orbit-dot dot-three"></span>
        <div class="loader-brand-core">
          <img src="${LOGO_PATH}" alt="Stackly">
        </div>
      </div>
      <h3>Stackly</h3>
      <p>Preparing your SaaS workspace...</p>
    </div>`;
  document.body.prepend(loader);

  function showLoader(){
    loader.classList.remove('hide');
    document.body.classList.add('loader-active');
  }

  function hideLoader(){
    loader.classList.add('hide');
    document.body.classList.remove('loader-active');
  }

  window.stacklyShowLoader = showLoader;

  // Show loading only on first website launch in this browser tab/session
  const launchKey = 'stacklyLaunchLoaderShown';
  if(!sessionStorage.getItem(launchKey)){
    showLoader();
    sessionStorage.setItem(launchKey, 'true');
    window.addEventListener('load',()=>setTimeout(hideLoader,3000));
  }else{
    hideLoader();
  }

  // Logo click only: show loader for 3 sec, then refresh the CURRENT page.
  // Example: About logo -> reload About, Admin dashboard logo -> reload Admin dashboard.
  document.querySelectorAll('a.logo, a.dash-logo, .footer-brand').forEach(link=>{
    link.addEventListener('click',(e)=>{
      e.preventDefault();
      showLoader();
      setTimeout(()=>location.reload(),3000);
    });
  });
})();

// ===== Mobile menu action buttons fix (Login + Get Started inside hamburger menu only) =====
(function(){
  const navLinks = document.querySelector('.nav-links');
  const hamburger = document.querySelector('.hamburger');
  if(!navLinks || !hamburger) return;

  if(!navLinks.querySelector('.mobile-menu-actions')){
    const actions = document.createElement('div');
    actions.className = 'mobile-menu-actions';
    actions.innerHTML = `
      <a class="btn btn-light" href="login.html">Login</a>
      <a class="btn btn-primary" href="signup.html">Get Started</a>
    `;
    navLinks.appendChild(actions);
  }

  hamburger.addEventListener('click',()=>{
    document.body.classList.toggle('mobile-menu-open', navLinks.classList.contains('open'));
    const icon = hamburger.querySelector('i');
    if(icon){
      icon.className = navLinks.classList.contains('open') ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    }
  });

  navLinks.querySelectorAll('a').forEach(link=>{
    link.addEventListener('click',()=>{
      document.body.classList.remove('mobile-menu-open');
      const icon = hamburger.querySelector('i');
      if(icon) icon.className = 'fa-solid fa-bars';
    });
  });
})();

// ===== Requested final fixes: required contact forms + dashboard mobile menu behavior =====
document.querySelectorAll('.redirect-404-form').forEach(form => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (form.checkValidity()) {
      window.location.href = '404.html';
    } else {
      form.reportValidity();
    }
  });
});

// Dashboard mobile: after selecting one sidebar menu, close sidebar and show only selected panel.
if (document.body.classList.contains('dashboard-page')) {
  document.querySelectorAll('.dash-menu a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.matchMedia('(max-width: 991px)').matches) {
        document.body.classList.remove('sidebar-open');
      }
    });
  });
}

// ===== FINAL FIX ONLY: reliable mobile hamburger for admin/user dashboards =====
(function(){
  if(!document.body.classList.contains('dashboard-page')) return;

  const sidebar = document.querySelector('.dash-sidebar');
  const toggle = document.querySelector('.dash-toggle');
  const menuLinks = document.querySelectorAll('.dash-menu a[data-panel]');
  if(!sidebar || !toggle) return;

  let backdrop = document.querySelector('.dash-backdrop');
  if(!backdrop){
    backdrop = document.createElement('div');
    backdrop.className = 'dash-backdrop';
    document.body.appendChild(backdrop);
  }

  if(!sidebar.querySelector('.dash-sidebar-mobile-close')){
    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'dash-sidebar-mobile-close';
    closeBtn.setAttribute('aria-label','Close dashboard menu');
    closeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    sidebar.prepend(closeBtn);
  }

  const closeSidebar = () => {
    document.body.classList.remove('sidebar-open');
    const icon = toggle.querySelector('i');
    if(icon) icon.className = 'fa-solid fa-bars';
  };

  const openSidebar = () => {
    document.body.classList.add('sidebar-open');
    const icon = toggle.querySelector('i');
    if(icon) icon.className = 'fa-solid fa-xmark';
  };

  toggle.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    document.body.classList.contains('sidebar-open') ? closeSidebar() : openSidebar();
  });

  backdrop.addEventListener('click', closeSidebar);
  sidebar.querySelector('.dash-sidebar-mobile-close').addEventListener('click', closeSidebar);

  menuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      const targetId = link.getAttribute('data-panel');
      document.querySelectorAll('.dash-menu a').forEach(item => item.classList.remove('active'));
      document.querySelectorAll('.dash-panel').forEach(panel => panel.classList.remove('active'));

      link.classList.add('active');
      const targetPanel = document.getElementById(targetId);
      if(targetPanel) targetPanel.classList.add('active');

      if(window.matchMedia('(max-width: 991px)').matches){
        closeSidebar();
        window.scrollTo({top:0, behavior:'smooth'});
      }
    });
  });
})();

// =========================================================
// QA BUG FIX PASS - 2026-05-27
// Keeps design unchanged; improves responsive behavior, accessibility and form feedback.
// =========================================================
(function(){
  const menuBtn = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if(menuBtn && navLinks){
    const setMenuState = (open) => {
      navLinks.classList.toggle('open', open);
      document.body.classList.toggle('mobile-menu-open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
      const icon = menuBtn.querySelector('i');
      if(icon) icon.className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    };

    menuBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      setMenuState(!navLinks.classList.contains('open'));
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => setMenuState(false));
    });

    document.addEventListener('keydown', (e) => {
      if(e.key === 'Escape') setMenuState(false);
    });

    window.addEventListener('resize', () => {
      if(window.matchMedia('(min-width: 992px)').matches) setMenuState(false);
    });
  }
})();

(function(){
  // Required-form validation + visible loading/disabled state.
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => {
      if(!form.checkValidity()){
        e.preventDefault();
        form.classList.add('was-validated');
        form.reportValidity();
        return;
      }
      const submitBtn = form.querySelector('button[type="submit"], .btn[type="submit"]');
      if(submitBtn){
        submitBtn.classList.add('is-loading');
        submitBtn.setAttribute('aria-disabled','true');
      }
    }, true);
  });
})();

(function(){
  // Social/internal 404 links are intentionally routed to the 404 page.
  // Add descriptive title for accessibility.
  document.querySelectorAll('.footer-social a, .mono-social a').forEach(link => {
    if(!link.getAttribute('title')){
      link.setAttribute('title', link.getAttribute('aria-label') || 'Social link');
    }
  });
})();

(function(){
  // Dashboard hamburger final reliable state and accessibility.
  if(!document.body.classList.contains('dashboard-page')) return;
  const toggle = document.querySelector('.dash-toggle');
  const sidebar = document.querySelector('.dash-sidebar');
  if(!toggle || !sidebar) return;

  const close = () => {
    document.body.classList.remove('sidebar-open');
    toggle.setAttribute('aria-expanded','false');
    const icon = toggle.querySelector('i');
    if(icon) icon.className = 'fa-solid fa-bars';
  };
  const open = () => {
    document.body.classList.add('sidebar-open');
    toggle.setAttribute('aria-expanded','true');
    const icon = toggle.querySelector('i');
    if(icon) icon.className = 'fa-solid fa-xmark';
  };

  toggle.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    document.body.classList.contains('sidebar-open') ? close() : open();
  });
  document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') close(); });
  document.querySelectorAll('.dash-menu a[data-panel]').forEach(link => {
    link.addEventListener('click', () => {
      if(window.matchMedia('(max-width: 991px)').matches) close();
    });
  });
})();

// =========================================================
// FINAL QA MENU GUARD: capture-phase handlers prevent old duplicate toggles.
// =========================================================
(function(){
  const btn = document.querySelector('.hamburger');
  const menu = document.querySelector('.nav-links');
  if(!btn || !menu) return;
  btn.addEventListener('click', function(e){
    e.preventDefault();
    e.stopImmediatePropagation();
    const open = !menu.classList.contains('open');
    menu.classList.toggle('open', open);
    document.body.classList.toggle('mobile-menu-open', open);
    btn.setAttribute('aria-expanded', String(open));
    const icon = btn.querySelector('i');
    if(icon) icon.className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
  }, true);
})();

(function(){
  if(!document.body.classList.contains('dashboard-page')) return;
  const btn = document.querySelector('.dash-toggle');
  if(!btn) return;
  btn.addEventListener('click', function(e){
    e.preventDefault();
    e.stopImmediatePropagation();
    const open = !document.body.classList.contains('sidebar-open');
    document.body.classList.toggle('sidebar-open', open);
    btn.setAttribute('aria-expanded', String(open));
    const icon = btn.querySelector('i');
    if(icon) icon.className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
  }, true);
})();


// FINAL FORGOT PASSWORD FIX: show existing premium Stackly loader, then navigate to 404.
(function(){
  document.querySelectorAll('.forgot-link').forEach(link => {
    link.addEventListener('click', function(e){
      e.preventDefault();
      e.stopImmediatePropagation();
      if(window.stacklyShowLoader){
        window.stacklyShowLoader();
        setTimeout(()=>{ window.location.href = '404.html'; }, 2000);
      }else{
        window.location.href = '404.html';
      }
    }, true);
  });
})();



// =========================================================
// Remaining QA accessibility/sticky helper fixes
// =========================================================
(function(){
  const header = document.querySelector('.header');
  const setHeader = () => {
    if(header) header.classList.toggle('scrolled', window.scrollY > 10);
  };
  setHeader();
  window.addEventListener('scroll', setHeader, {passive:true});

  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if(hamburger && navLinks){
    hamburger.setAttribute('aria-expanded', String(navLinks.classList.contains('open')));
    document.addEventListener('keydown', (e)=>{
      if(e.key === 'Escape' && navLinks.classList.contains('open')){
        navLinks.classList.remove('open');
        document.body.classList.remove('mobile-menu-open');
        hamburger.setAttribute('aria-expanded','false');
        const icon = hamburger.querySelector('i');
        if(icon) icon.className = 'fa-solid fa-bars';
        hamburger.focus();
      }
    });
  }

  document.querySelectorAll('a[target="_blank"]').forEach(link=>{
    if(!link.getAttribute('rel')){
      link.setAttribute('rel','noopener noreferrer');
    }
  });
})();



// FINAL REAL FIX - hamburger opens and closes menu
(function(){
  function getMenu(){return document.querySelector('.nav-links');}
  function closeMenu(){
    const m=getMenu();
    if(m)m.classList.remove('stackly-menu-open');
    document.body.classList.remove('stackly-menu-active');
    document.querySelectorAll('.stackly-mobile-toggle').forEach(b=>{b.classList.remove('is-open');b.setAttribute('aria-expanded','false');});
  }
  function bind(){
    document.querySelectorAll('.stackly-mobile-toggle').forEach(btn=>{
      if(btn.dataset.stacklyFixed==='true')return;
      btn.dataset.stacklyFixed='true';
      btn.addEventListener('click',function(e){
        e.preventDefault();e.stopPropagation();
        const m=getMenu(); if(!m)return;
        const opened=m.classList.contains('stackly-menu-open');
        closeMenu();
        if(!opened){m.classList.add('stackly-menu-open');document.body.classList.add('stackly-menu-active');btn.classList.add('is-open');btn.setAttribute('aria-expanded','true');}
      });
    });
    const m=getMenu();
    if(m)m.querySelectorAll('a').forEach(a=>{if(!a.dataset.closeBound){a.dataset.closeBound='true';a.addEventListener('click',closeMenu);}});
  }
  bind();document.addEventListener('DOMContentLoaded',bind);
  document.addEventListener('click',e=>{if(!e.target.closest('.stackly-mobile-toggle,.nav-links'))closeMenu();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
})();

// =========================================================
// STACKLY FINAL REQUEST FIX - reliable mobile full-page menu
// =========================================================
(function(){
  const menu = document.querySelector('.nav-links');
  const btn = document.querySelector('.hamburger');
  if(!menu || !btn) return;

  if(!menu.querySelector('.mobile-menu-actions')){
    const actions = document.createElement('div');
    actions.className = 'mobile-menu-actions';
    actions.innerHTML = '<a class="btn btn-light" href="login.html">Login</a><a class="btn btn-primary" href="signup.html">Get Started</a>';
    menu.appendChild(actions);
  }

  function setOpen(open){
    menu.classList.toggle('open', open);
    menu.classList.toggle('stackly-menu-open', open);
    document.body.classList.toggle('mobile-menu-open', open);
    document.body.classList.toggle('stackly-menu-active', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    const icon = btn.querySelector('i');
    if(icon) icon.className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
  }

  btn.addEventListener('click', function(e){
    if(!window.matchMedia('(max-width: 991px)').matches) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    setOpen(!(menu.classList.contains('open') || menu.classList.contains('stackly-menu-open')));
  }, true);

  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', e => { if(e.key === 'Escape') setOpen(false); });
  window.addEventListener('resize', () => { if(window.matchMedia('(min-width: 992px)').matches) setOpen(false); });
})();

// =========================================================
// FINAL DASHBOARD MOBILE FIX: logo left, hamburger right, logout in sidebar
// =========================================================
(function(){
  if(!document.body.classList.contains('dashboard-page')) return;

  const sidebar = document.querySelector('.dash-sidebar');
  const toggle = document.querySelector('.dash-toggle');
  const topLogout = document.querySelector('.dash-top-actions .logout-btn');
  if(!sidebar || !toggle) return;

  if(!sidebar.querySelector('.dash-mobile-logout')){
    const logout = document.createElement('button');
    logout.type = 'button';
    logout.className = 'dash-mobile-logout';
    logout.innerHTML = '<i class="fa-solid fa-right-from-bracket"></i> Logout';
    logout.addEventListener('click', function(){ window.location.href = 'index.html'; });
    const menu = sidebar.querySelector('.dash-menu');
    if(menu){ menu.appendChild(logout); }
    else{ sidebar.appendChild(logout); }
  }

  function setSidebar(open){
    document.body.classList.toggle('sidebar-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close dashboard menu' : 'Open dashboard menu');
    const icon = toggle.querySelector('i');
    if(icon) icon.className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
  }

  toggle.addEventListener('click', function(e){
    if(!window.matchMedia('(max-width: 991px)').matches) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    setSidebar(!document.body.classList.contains('sidebar-open'));
  }, true);

  document.querySelectorAll('.dash-menu a[data-panel]').forEach(link => {
    link.addEventListener('click', function(){
      if(window.matchMedia('(max-width: 991px)').matches) setSidebar(false);
    });
  });

  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') setSidebar(false); });
  window.addEventListener('resize', function(){ if(window.matchMedia('(min-width: 992px)').matches) setSidebar(false); });
})();
