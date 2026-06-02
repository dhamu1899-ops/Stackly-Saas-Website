
(function(){
  const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  function ensureLoader(){
    let loader=document.querySelector('.page-loader');
    if(loader) return loader;
    loader=document.createElement('div');
    loader.className='page-loader';
    loader.innerHTML='<div class="loader-card" role="status" aria-live="polite"><div class="loader-orbit"><span></span><span></span><span></span></div><strong>Stackly</strong><p>Preparing your SaaS workspace...</p></div>';
    document.body.appendChild(loader);
    return loader;
  }
  function showLoaderThen(url,delay=900){
    const loader=ensureLoader();
    loader.classList.add('active');
    setTimeout(()=>{window.location.href=url;},delay);
  }
  document.querySelectorAll('.forgot-link,a[href="#forgot"],a[href="forgot.html"]').forEach(link=>{
    link.setAttribute('href','404.html');
    link.addEventListener('click',e=>{e.preventDefault();showLoaderThen('404.html',900);});
  });
  document.querySelectorAll('a[href^="http://"],a[href^="https://"]').forEach(a=>{
    a.setAttribute('target','_blank');a.setAttribute('rel','noopener noreferrer');
  });
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'){
      document.querySelectorAll('.open,.active.show,.sidebar-open').forEach(el=>el.classList.remove('open','show','sidebar-open'));
      document.body.classList.remove('mobile-menu-open','menu-open','sidebar-open');
      document.querySelectorAll('[aria-expanded="true"]').forEach(btn=>btn.setAttribute('aria-expanded','false'));
    }
  });
  document.querySelectorAll('.hamburger,.menu-toggle,.dash-toggle,.dashboard-toggle').forEach(btn=>{
    if(!btn.hasAttribute('aria-label')) btn.setAttribute('aria-label','Open menu');
    if(!btn.hasAttribute('aria-expanded')) btn.setAttribute('aria-expanded','false');
    btn.addEventListener('click',()=>{const ex=btn.getAttribute('aria-expanded')==='true';btn.setAttribute('aria-expanded',String(!ex));});
  });
  function setError(field,msg){
    field.classList.add('is-invalid');
    let err=field.parentElement.querySelector('.field-error');
    if(!err){err=document.createElement('span');err.className='field-error';field.parentElement.appendChild(err);}
    err.textContent=msg;
  }
  function clearError(field){
    field.classList.remove('is-invalid');
    const err=field.parentElement.querySelector('.field-error');
    if(err) err.remove();
  }
  function validateForm(form){
    let ok=true;
    form.querySelectorAll('input,textarea,select').forEach(field=>{
      clearError(field);
      const type=(field.getAttribute('type')||'').toLowerCase();
      const name=(field.getAttribute('name')||field.id||field.placeholder||'').toLowerCase();
      if(field.offsetParent!==null && field.hasAttribute('required') && !field.value.trim()){
        ok=false;setError(field,'This field is required.');
      }else if((type==='email'||name.includes('email')) && field.value.trim() && !emailRegex.test(field.value.trim())){
        ok=false;setError(field,'Please enter a valid email address.');
      }
    });
    return ok;
  }
  document.querySelectorAll('form').forEach(form=>{
    form.querySelectorAll('input:not([type="hidden"]):not([type="checkbox"]):not([type="radio"]),textarea,select').forEach(field=>{
      const name=(field.name||field.id||field.placeholder||'').toLowerCase();
      if(!name.includes('search') && !field.hasAttribute('readonly')) field.setAttribute('required','required');
      if(name.includes('email') || field.type==='email') field.setAttribute('type','email');
    });
    form.addEventListener('submit',function(e){
      e.preventDefault();
      const submit=form.querySelector('button[type="submit"],input[type="submit"],.submit-btn');
      form.querySelectorAll('.form-success').forEach(el=>el.remove());
      if(!validateForm(form)){const first=form.querySelector('.is-invalid'); if(first) first.focus(); return;}
      if(submit){
        submit.classList.add('is-processing');submit.setAttribute('disabled','disabled');submit.setAttribute('aria-disabled','true');
        submit.dataset.originalText=submit.textContent;
        if(submit.tagName.toLowerCase()==='button') submit.textContent='Processing...';
      }
      setTimeout(()=>{
        const success=document.createElement('div');success.className='form-success';success.textContent='Submitted successfully.';form.prepend(success);
        if(form.classList.contains('signup-form') || location.pathname.includes('signup')){window.location.href='login.html';return;}
        if(form.classList.contains('contact-form') || location.pathname.includes('contact') || (form.id||'').toLowerCase().includes('contact')){window.location.href='404.html';return;}
        if(submit){
          submit.classList.remove('is-processing');submit.removeAttribute('disabled');submit.removeAttribute('aria-disabled');
          if(submit.dataset.originalText) submit.textContent=submit.dataset.originalText;
        }
      },700);
    });
  });
})();



// Auth/mobile hamburger requested fix
(function(){
  const toggles = document.querySelectorAll('.hamburger,.menu-toggle,.navbar-toggler');
  const menus = document.querySelectorAll('.nav-links,.nav-menu,.navbar-nav');

  toggles.forEach(toggle=>{
    if(!toggle.dataset.stacklyMobileFixed){
      toggle.dataset.stacklyMobileFixed = 'true';
      toggle.addEventListener('click', function(){
        setTimeout(()=>{
          const anyOpen = Array.from(menus).some(menu => menu.classList.contains('open') || menu.classList.contains('active') || menu.classList.contains('show'));
          document.body.classList.toggle('mobile-menu-open', anyOpen);
          toggle.setAttribute('aria-expanded', String(anyOpen));
        }, 0);
      });
    }
  });

  menus.forEach(menu=>{
    menu.querySelectorAll('a').forEach(link=>{
      link.addEventListener('click', ()=>{
        document.body.classList.remove('mobile-menu-open');
        menu.classList.remove('open','active','show');
        toggles.forEach(t=>t.setAttribute('aria-expanded','false'));
      });
    });
  });

  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape'){
      document.body.classList.remove('mobile-menu-open');
      menus.forEach(m=>m.classList.remove('open','active','show'));
      toggles.forEach(t=>t.setAttribute('aria-expanded','false'));
    }
  });
})();



// Robust mobile hamburger menu fix
(function(){
  const toggles = document.querySelectorAll('.hamburger,.menu-toggle,.navbar-toggler');
  const menus = document.querySelectorAll('.nav-links,.nav-menu,.navbar-nav');

  function isMobile(){
    return window.matchMedia('(max-width: 991px)').matches;
  }

  function closeMenus(){
    menus.forEach(menu=>menu.classList.remove('open','active','show'));
    toggles.forEach(btn=>btn.setAttribute('aria-expanded','false'));
    document.body.classList.remove('mobile-menu-open');
  }

  toggles.forEach(toggle=>{
    if(toggle.dataset.stacklyHamburgerFixed === 'true') return;
    toggle.dataset.stacklyHamburgerFixed = 'true';
    toggle.setAttribute('aria-label', toggle.getAttribute('aria-label') || 'Open navigation menu');
    toggle.setAttribute('aria-expanded','false');

    toggle.addEventListener('click', function(e){
      if(!isMobile()) return;
      e.preventDefault();
      e.stopPropagation();

      const menu = document.querySelector('.nav-links,.nav-menu,.navbar-nav');
      if(!menu) return;

      const willOpen = !(menu.classList.contains('open') || menu.classList.contains('active') || menu.classList.contains('show'));
      closeMenus();

      if(willOpen){
        menu.classList.add('open');
        document.body.classList.add('mobile-menu-open');
        toggle.setAttribute('aria-expanded','true');
      }
    });
  });

  menus.forEach(menu=>{
    menu.querySelectorAll('a').forEach(link=>{
      link.addEventListener('click', closeMenus);
    });
  });

  document.addEventListener('click', function(e){
    if(!isMobile()) return;
    const insideMenu = e.target.closest('.nav-links,.nav-menu,.navbar-nav,.hamburger,.menu-toggle,.navbar-toggler');
    if(!insideMenu) closeMenus();
  });

  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape') closeMenus();
  });

  window.addEventListener('resize', function(){
    if(!isMobile()) closeMenus();
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
