// Preloader: randomly generated bug-squashing build
  (function(){
    const loader = document.getElementById('loader');
    const fill = document.getElementById('loaderFill');
    const pctEl = document.getElementById('loaderPct');
    const statusEl = document.getElementById('loaderStatus');
    const captionEl = document.getElementById('loaderCaption');
    const bugField = document.getElementById('bugField');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const bugCount = Math.floor(Math.random() * 30) + 1;
    const duration = bugCount > 10
      ? 8000 + (bugCount - 10) * 650
      : 4500 + bugCount * 120;

    const bugSvg = `<svg viewBox="0 0 40 40">
      <ellipse class="shell" cx="20" cy="22" rx="11" ry="14"/>
      <circle class="spot" cx="16" cy="16" r="2"/><circle class="spot" cx="24" cy="20" r="2"/><circle class="spot" cx="16" cy="26" r="2"/>
      <line class="leg" x1="10" y1="14" x2="3" y2="10"/><line class="leg" x1="9" y1="22" x2="2" y2="22"/><line class="leg" x1="10" y1="30" x2="3" y2="34"/>
      <line class="leg" x1="30" y1="14" x2="37" y2="10"/><line class="leg" x1="31" y1="22" x2="38" y2="22"/><line class="leg" x1="30" y1="30" x2="37" y2="34"/>
      <path class="antenna" d="M15 9 L11 3"/><path class="antenna" d="M25 9 L29 3"/>
    </svg>
    <div class="bug-spark"><svg viewBox="0 0 40 40"><path d="M20 2 L20 10 M20 30 L20 38 M2 20 L10 20 M30 20 L38 20 M7 7 L13 13 M27 27 L33 33 M33 7 L27 13 M13 27 L7 33"/></svg></div>`;

    const bugs = [];
    for(let i=0;i<bugCount;i++){
      const bug=document.createElement('div');
      bug.className='bug';
      bug.innerHTML=bugSvg;
      bug.style.left=(4+Math.random()*88)+'%';
      bug.style.top=(4+Math.random()*78)+'%';
      bug.style.setProperty('--dx', `${Math.round((Math.random()*2-1)*22)}px`);
      bug.style.setProperty('--dy', `${Math.round((Math.random()*2-1)*18)}px`);
      bug.style.setProperty('--speed', `${(2+Math.random()*2.5).toFixed(2)}s`);
      bug.style.setProperty('--delay', `${(-Math.random()*2).toFixed(2)}s`);
      bugField.appendChild(bug);
      bugs.push(bug);
    }

    captionEl.innerHTML = bugCount > 10
      ? `<b>${bugCount} bugs detected</b> — ${bugCount > 20 ? 'This codebase is putting me to work.' : 'I’m squashing them before you enter.'}`
      : `<b>${bugCount} bug${bugCount===1?'':'s'} detected</b> — preparing the portfolio...`;

    if(bugCount > 10){
      statusEl.textContent = `Please be patient — ${bugCount} bugs need squashing...`;
    }

    function finishLoading(){
      document.body.classList.remove('loading');
      loader.classList.add('hide');
      setTimeout(() => loader.remove(), 650);
    }

    if(reduceMotion){
      fill.style.width='100%';
      pctEl.textContent='100%';
      statusEl.textContent='Ready.';
      captionEl.innerHTML=`<b>${bugCount} bugs scanned</b> — portfolio ready.`;
      bugs.forEach(b=>b.style.display='none');
      finishLoading();
      return;
    }

    const phases = [
      {at:0, label:'Booting environment...'},
      {at:10, label:'Scanning codebase for bugs...'},
      {at:28, label:'Analysing dependencies...'},
      {at:45, label:'Compiling source...'},
      {at:62, label:'Running unit tests...'},
      {at:78, label:'Running acceptance tests...'},
      {at:91, label:'Packaging build...'},
      {at:98, label:'Final verification...'}
    ];

    let squashed=0;
    let lastPhase='';

    function ease(t){return t<0.5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2;}

    const start=performance.now();
    function tick(now){
      const t=Math.min(1,(now-start)/duration);
      const progress=Math.round(ease(t)*100);
      fill.style.width=progress+'%';
      pctEl.textContent=progress+'%';

      let phase=phases[0];
      for(const item of phases){if(progress>=item.at) phase=item;}
      if(phase.label!==lastPhase){
        statusEl.textContent=progress>=100 ? 'Build success ✓' : phase.label;
        if(bugCount>10 && progress<96 && progress>=10) statusEl.textContent=`Please be patient — ${phase.label}`;
        lastPhase=phase.label;
      }

      const targetSquashed=Math.min(bugCount,Math.floor(progress/100*bugCount));
      while(squashed<targetSquashed){
        const bug = bugs[squashed];
        const bugNumber = squashed + 1;

        if(bug){
          bug.classList.add('squashed');

          let removed = false;
          const removeBug = () => {
            if(!removed){
              removed = true;
              bug.remove();
            }
          };

          bug.addEventListener('animationend', (e) => {
            if(e.target === bug && e.animationName === 'bugdie'){
              removeBug();
            }
          });

          // Fallback safety in case animationend does not fire
          setTimeout(removeBug, 600);
        }

        squashed = bugNumber;
        captionEl.innerHTML = squashed < bugCount
          ? `<b>${squashed} of ${bugCount}</b> bugs fixed...`
          : `<b>All ${bugCount} bugs fixed ✓</b> Build is ready.`;
      }

      if(t<1) requestAnimationFrame(tick);
      else setTimeout(finishLoading,750);
    }
    requestAnimationFrame(tick);
  })();

  // Build-pipeline scroll progress bar
  const fill = document.getElementById('pipelineFill');
  const stageEl = document.getElementById('pipelineStage');
  const pctEl = document.getElementById('pipelinePct');

  const stages = [
    { max: 20, label: '$ mvn clean install — INIT' },
    { max: 40, label: 'COMPILING...' },
    { max: 60, label: 'RUNNING TESTS...' },
    { max: 80, label: 'PACKAGING...' },
    { max: 100, label: 'BUILD SUCCESS ✓' }
  ];

  function updatePipeline(){
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;
    fill.style.width = pct + '%';
    pctEl.textContent = Math.round(pct) + '%';
    const stage = stages.find(s => pct <= s.max) || stages[stages.length - 1];
    stageEl.textContent = stage.label;
  }
  window.addEventListener('scroll', updatePipeline, { passive: true });
  window.addEventListener('resize', updatePipeline);
  updatePipeline();

  // Tab nav smooth-scroll
  document.querySelectorAll('.tabnav button').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.querySelector(btn.dataset.target);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // ---------- Recruiter contact form ----------
  // EmailJS sends the message directly from the portfolio page.
  // It does NOT open the recruiter's email application.
  //
  // Replace these three placeholders with the values from your EmailJS dashboard.
  const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';
  const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';
  const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
  const OWNER_EMAIL = 'endzipha@gmail.com';

  (function(){
    const form = document.getElementById('contactForm');
    const statusEl = document.getElementById('cf-status');
    const submitBtn = document.getElementById('cf-submit');

    if (!form || !statusEl || !submitBtn) return;

    const nameEl = document.getElementById('cf-name');
    const companyEl = document.getElementById('cf-company');
    const emailEl = document.getElementById('cf-email');
    const roleEl = document.getElementById('cf-role');
    const subjectEl = document.getElementById('cf-subject');
    const msgEl = document.getElementById('cf-message');

    const modal = document.getElementById('successModal');
    const closeBtn = document.getElementById('successClose');
    const okBtn = document.getElementById('successOk');

    if (!modal) return;

    function openSuccess(){
      modal.classList.add('show');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeSuccess(){
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';

      // Allow another message to be sent after closing the popup.
      submitBtn.disabled = false;
      submitBtn.classList.remove('sending', 'sent');

      const label = submitBtn.querySelector('.send-label');
      const icon = submitBtn.querySelector('.send-icon');

      if (label) label.textContent = 'Send message';
      if (icon) icon.textContent = '➤';
    }

    closeBtn?.addEventListener('click', closeSuccess);
    okBtn?.addEventListener('click', closeSuccess);

    modal.querySelector('.success-backdrop')?.addEventListener(
      'click',
      closeSuccess
    );

    document.addEventListener('keydown', (event) => {
      if (
        event.key === 'Escape' &&
        modal.classList.contains('show')
      ) {
        closeSuccess();
      }
    });

    form.addEventListener('submit', async function(e){
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        statusEl.textContent = 'Please check the highlighted fields.';
        statusEl.className = 'form-status err';
        return;
      }

      const payload = {
        name: nameEl.value.trim(),
        company: companyEl.value.trim(),
        email: emailEl.value.trim(),
        role: roleEl.value.trim(),
        subject: subjectEl.value.trim(),
        message: msgEl.value.trim(),
        to_email: OWNER_EMAIL
      };

      const notConfigured =
        EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY' ||
        EMAILJS_SERVICE_ID === 'YOUR_SERVICE_ID' ||
        EMAILJS_TEMPLATE_ID === 'YOUR_TEMPLATE_ID';

      /*
       * IMPORTANT:
       * There is deliberately NO mailto() fallback here.
       * If EmailJS has not been configured, the recruiter stays on
       * this page and receives an explanatory error instead of being
       * redirected to an email application.
       */
      if (notConfigured || !window.emailjs) {
        statusEl.textContent =
          'Direct sending is not configured yet. Add your EmailJS credentials in js/script.js.';
        statusEl.className = 'form-status err';
        return;
      }

      submitBtn.disabled = true;
      submitBtn.classList.add('sending');

      const label = submitBtn.querySelector('.send-label');
      const icon = submitBtn.querySelector('.send-icon');

      if (label) label.textContent = 'Sending...';
      if (icon) icon.textContent = '⏳';

      statusEl.textContent = 'Sending your message securely...';
      statusEl.className = 'form-status sending';

      try {
        emailjs.init({
          publicKey: EMAILJS_PUBLIC_KEY
        });

        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          payload
        );

        // Successful send — recruiter remains on the portfolio.
        form.reset();

        submitBtn.classList.remove('sending');
        submitBtn.classList.add('sent');

        if (icon) icon.textContent = '✓';
        if (label) label.textContent = 'Sent!';

        statusEl.textContent = '';
        statusEl.className = 'form-status ok';

        // Small delay makes the button success animation visible.
        setTimeout(openSuccess, 350);

      } catch (err) {
        console.error('EmailJS error:', err);

        statusEl.textContent =
          'We couldn’t send the message right now. Please try again.';
        statusEl.className = 'form-status err';

        submitBtn.disabled = false;
        submitBtn.classList.remove('sending', 'sent');

        if (icon) icon.textContent = '➤';
        if (label) label.textContent = 'Send message';
      }
    });
  })();

  // Animate skill meters when they scroll into view
  const meters = document.querySelectorAll('.meter-row');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const row = entry.target;
        const level = row.dataset.level;
        const barFill = row.querySelector('.meter-fill');
        barFill.style.width = level + '%';
        observer.unobserve(row);
      }
    });
  }, { threshold: 0.4 });
  meters.forEach(m => observer.observe(m));