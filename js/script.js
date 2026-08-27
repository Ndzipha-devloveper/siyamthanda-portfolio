// Preloader: randomized realistic bug-squashing build
(function(){
  const loader = document.getElementById('loader');
  const fill = document.getElementById('loaderFill');
  const pctEl = document.getElementById('loaderPct');
  const statusEl = document.getElementById('loaderStatus');
  const captionEl = document.getElementById('loaderCaption');
  const bugField = document.getElementById('bugField');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if(!loader || !fill || !pctEl || !statusEl || !captionEl || !bugField) return;

  const bugCount = Math.floor(Math.random() * 30) + 1;
  const duration = bugCount > 10
    ? 8000 + (bugCount - 10) * 650
    : 4500 + bugCount * 120;

  const aliveExpressions = ['happy','smiling','grinning','laughing','cheeky','excited','playful','content','winking','cool'];
  const deathExpressions = ['sad','crying','angry','scared','shocked','dizzy','frustrated','defeated','pained','terrified'];

  function createBugSvg(){
    const uid = Math.random().toString(36).slice(2);
    return `<svg class="bug-art" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <radialGradient id="shell-${uid}" cx="32%" cy="20%" r="86%">
          <stop offset="0" stop-color="#3b4650"/>
          <stop offset=".28" stop-color="#202a32"/>
          <stop offset=".62" stop-color="#0b1117"/>
          <stop offset="1" stop-color="#020509"/>
        </radialGradient>
        <linearGradient id="green-${uid}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#d4ff72"/>
          <stop offset=".42" stop-color="#9ee657"/>
          <stop offset="1" stop-color="#4e9b3e"/>
        </linearGradient>
        <radialGradient id="eye-${uid}" cx="35%" cy="28%">
          <stop offset="0" stop-color="#ffffff"/>
          <stop offset=".55" stop-color="#e8eef2"/>
          <stop offset="1" stop-color="#87939d"/>
        </radialGradient>
        <filter id="glow-${uid}" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="2.2" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      <g class="bug-legs">
        <path class="leg leg-back" d="M28 39 10 28 4 30"/>
        <path class="leg" d="M25 51 6 48 1 52"/>
        <path class="leg leg-front" d="M28 64 10 73 5 79"/>
        <path class="leg leg-back" d="M72 39 90 28 96 30"/>
        <path class="leg" d="M75 51 94 48 99 52"/>
        <path class="leg leg-front" d="M72 64 90 73 95 79"/>
      </g>

      <path class="antenna" d="M39 25C32 16 27 10 29 4"/>
      <path class="antenna" d="M61 25C68 16 73 10 71 4"/>
      <circle class="antenna-tip" cx="29" cy="4" r="2.2"/>
      <circle class="antenna-tip" cx="71" cy="4" r="2.2"/>

      <ellipse class="shell" cx="50" cy="54" rx="28" ry="35" fill="url(#shell-${uid})"/>
      <ellipse class="shell-highlight" cx="41" cy="35" rx="10" ry="15"/>
      <path class="shell-edge" d="M27 43C25 57 29 73 39 82"/>
      <path class="shell-edge right" d="M73 43C75 57 71 73 61 82"/>
      <path class="shell-line" d="M50 21V87"/>

      <path class="marking m1" d="M28 34c5-5 10-7 17-8l-4 8-10 4Z"/>
      <path class="marking m2" d="M72 34c-5-5-10-7-17-8l4 8 10 4Z"/>
      <path class="marking m3" d="M26 49c5-3 10-4 16-3l-4 8-11 2Z"/>
      <path class="marking m4" d="M74 49c-5-3-10-4-16-3l4 8 11 2Z"/>
      <path class="marking m5" d="M30 66c4-2 8-3 12-2l-4 8-8 1Z"/>
      <path class="marking m6" d="M70 66c-4-2-8-3-12-2l4 8 8 1Z"/>

      <g class="face">
        <g class="eyes eye-left">
          <ellipse class="eye-white" cx="40" cy="49" rx="8.5" ry="10" fill="url(#eye-${uid})"/>
          <ellipse class="pupil" cx="41" cy="50" rx="3.5" ry="5"/>
          <circle class="eye-glint" cx="42" cy="47" r="1.5"/>
        </g>
        <g class="eyes eye-right">
          <ellipse class="eye-white" cx="60" cy="49" rx="8.5" ry="10" fill="url(#eye-${uid})"/>
          <ellipse class="pupil" cx="59" cy="50" rx="3.5" ry="5"/>
          <circle class="eye-glint" cx="60" cy="47" r="1.5"/>
        </g>
        <path class="brow brow-left" d="M33 38Q40 33 47 38"/>
        <path class="brow brow-right" d="M53 38Q60 33 67 38"/>

        <path class="mouth mouth-smile" d="M40 65Q50 74 60 65"/>
        <path class="mouth mouth-grin" d="M39 64Q50 73 61 64Q60 76 50 77Q40 76 39 64Z"/>
        <path class="mouth mouth-open" d="M41 64Q50 70 59 64Q58 78 50 78Q42 78 41 64Z"/>
        <path class="mouth mouth-cheeky" d="M42 65Q50 69 58 64"/>
        <path class="mouth mouth-frown" d="M40 71Q50 63 60 71"/>
        <path class="mouth mouth-angry" d="M41 70Q50 64 59 70L56 73Q50 69 44 73Z"/>
        <ellipse class="mouth mouth-shocked" cx="50" cy="69" rx="5" ry="7"/>
        <path class="mouth mouth-dizzy" d="M43 68Q47 73 50 68Q53 63 57 68"/>

        <path class="tear tear-left" d="M35 58Q32 63 35 66Q38 63 35 58Z"/>
        <path class="tear tear-right" d="M65 58Q62 63 65 66Q68 63 65 58Z"/>
        <path class="brow death-brow-left" d="M33 38L47 43"/>
        <path class="brow death-brow-right" d="M53 43L67 38"/>
      </g>
    </svg>
    <div class="bug-spark"><svg viewBox="0 0 100 100"><path d="M50 5V20 M50 80V95 M5 50H20 M80 50H95 M18 18L29 29 M71 71L82 82 M82 18L71 29 M29 71L18 82"/></svg></div>`;
  }

  function applyExpression(bug, expression){
    bug.dataset.expression = expression;
    bug.classList.remove('expr-happy','expr-smiling','expr-grinning','expr-laughing','expr-cheeky','expr-excited','expr-playful','expr-content','expr-winking','expr-cool');
    bug.classList.add('expr-' + expression);
  }

  const bugs = [];
  for(let i=0;i<bugCount;i++){
    const bug=document.createElement('div');
    bug.className='bug';
    bug.innerHTML=createBugSvg();
    bug.style.left=(4+Math.random()*88)+'%';
    bug.style.top=(3+Math.random()*82)+'%';
    bug.style.setProperty('--dx', `${Math.round((Math.random()*2-1)*28)}px`);
    bug.style.setProperty('--dy', `${Math.round((Math.random()*2-1)*22)}px`);
    bug.style.setProperty('--speed', `${(2.4+Math.random()*2.8).toFixed(2)}s`);
    bug.style.setProperty('--delay', `${(-Math.random()*2.5).toFixed(2)}s`);
    bug.style.setProperty('--scale', `${(0.78+Math.random()*0.5).toFixed(2)}`);
    applyExpression(bug, aliveExpressions[Math.floor(Math.random()*aliveExpressions.length)]);
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
    bugs.forEach(b=>b.remove());
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

  function killBug(index){
    const bug=bugs[index];
    if(!bug || bug.dataset.dead === 'true') return;
    bug.dataset.dead='true';
    applyExpression(bug, deathExpressions[Math.floor(Math.random()*deathExpressions.length)]);
    bug.classList.add('squashed');

    let removed=false;
    const removeBug=()=>{
      if(removed) return;
      removed=true;
      bug.remove();
    };
    bug.addEventListener('animationend', event=>{
      if(event.animationName==='bugdie') removeBug();
    }, {once:false});
    setTimeout(removeBug, 720);
  }

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
      const current=squashed;
      killBug(current);
      squashed++;
      captionEl.innerHTML = squashed < bugCount
        ? `<b>${squashed} of ${bugCount}</b> bugs fixed...`
        : `<b>All ${bugCount} bugs fixed ✓</b> Build is ready.`;
    }

    if(t<1) requestAnimationFrame(tick);
    else setTimeout(finishLoading,800);
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
// Frontend-only submission for now. Replace sendRecruiterMessage() with your backend call later.
(function(){
  const form = document.getElementById('contactForm');
  const statusEl = document.getElementById('cf-status');
  const submitBtn = document.getElementById('cf-submit');
  const modal = document.getElementById('successModal');
  const closeBtn = document.getElementById('successClose');
  const okBtn = document.getElementById('successOk');

  if(!form || !statusEl || !submitBtn || !modal) return;

  async function sendRecruiterMessage(formData){
    // TEMPORARY: simulate the future backend request.
    await new Promise(resolve => setTimeout(resolve, 1200));
    return { success:true };
  }

  function openSuccess(){
    modal.classList.add('show');
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
  }

  function closeSuccess(){
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow='';
    submitBtn.disabled=false;
    submitBtn.classList.remove('sending','sent');
    const label=submitBtn.querySelector('.send-label');
    const icon=submitBtn.querySelector('.send-icon');
    if(label) label.textContent='Send message';
    if(icon) icon.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13"/><path d="m22 2-7 20-4-9-9-4Z"/></svg>';
  }

  closeBtn?.addEventListener('click',closeSuccess);
  okBtn?.addEventListener('click',closeSuccess);
  modal.querySelector('.success-backdrop')?.addEventListener('click',closeSuccess);
  document.addEventListener('keydown',e=>{if(e.key==='Escape' && modal.classList.contains('show')) closeSuccess();});

  form.addEventListener('submit',async e=>{
    e.preventDefault();
    if(!form.checkValidity()){
      form.reportValidity();
      statusEl.textContent='Please check the highlighted fields.';
      statusEl.className='form-status err';
      return;
    }

    const formData=Object.fromEntries(new FormData(form).entries());
    submitBtn.disabled=true;
    submitBtn.classList.add('sending');
    const label=submitBtn.querySelector('.send-label');
    const icon=submitBtn.querySelector('.send-icon');
    if(label) label.textContent='Sending...';
    if(icon) icon.innerHTML='<span class="send-spinner" aria-hidden="true"></span>';
    statusEl.textContent='Preparing your message...';
    statusEl.className='form-status sending';

    try{
      const result=await sendRecruiterMessage(formData);
      if(!result?.success) throw new Error('Message was not accepted');

      form.reset();
      submitBtn.classList.remove('sending');
      submitBtn.classList.add('sent');
      if(label) label.textContent='Sent!';
      if(icon) icon.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 4 4L19 6"/></svg>';
      statusEl.textContent='Message prepared successfully.';
      statusEl.className='form-status ok';
      setTimeout(openSuccess,350);
    }catch(err){
      console.error('Recruiter form error:',err);
      statusEl.textContent='Something went wrong while sending your message. Please try again.';
      statusEl.className='form-status err';
      submitBtn.disabled=false;
      submitBtn.classList.remove('sending','sent');
      if(label) label.textContent='Send message';
      if(icon) icon.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13"/><path d="m22 2-7 20-4-9-9-4Z"/></svg>';
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
