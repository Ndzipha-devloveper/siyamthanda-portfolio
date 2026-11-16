// Preloader: type, compile, and run a Hello, World! program
(function(){
  const loader = document.getElementById('loader');
  const fill = document.getElementById('loaderFill');
  const pctEl = document.getElementById('loaderPct');
  const statusEl = document.getElementById('loaderStatus');
  const captionEl = document.getElementById('loaderCaption');
  const liveEl = document.getElementById('helloLive');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const lineEls = [1, 2, 3, 4, 5].map(number => document.getElementById(`helloLine${number}`));
  const compileEl = document.getElementById('compileCommand');
  const runEl = document.getElementById('runCommand');
  const outputEl = document.getElementById('helloOutput');
  if(!loader || !fill || !pctEl || !statusEl || !captionEl || !liveEl ||
     lineEls.some(line => !line) || !compileEl || !runEl || !outputEl) return;

  const minimumDuration = 18000;
  const sourceLines = [
    'public class Welcome {',
    '    public static void main(String[] args) {',
    '        System.out.println("Hello, World!");',
    '    }',
    '}'
  ];

  function finishLoading(){
    document.body.classList.remove('loading');
    loader.classList.add('hide');
    setTimeout(() => loader.remove(), 650);
  }

  function showCompleteProgram(){
    lineEls.forEach((line, index) => { line.textContent = sourceLines[index]; });
    compileEl.textContent = '$ javac Welcome.java';
    runEl.textContent = '$ java Welcome';
    outputEl.textContent = 'Hello, World!';
    fill.style.width = '100%';
    pctEl.textContent = '100%';
    statusEl.textContent = 'Portfolio ready.';
    captionEl.textContent = 'It works — welcome!';
    liveEl.textContent = 'BUILD SUCCESS';
  }

  if(reduceMotion){
    showCompleteProgram();
    finishLoading();
    return;
  }

  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
  async function typeText(element, text){
    const row = element.closest('.hello-code-row');
    element.dataset.typing = 'true';
    row?.classList.add('is-typing');
    for(const character of text){
      element.textContent += character;
      const baseDelay = 62 + Math.random() * 48;
      const punctuationPause = /[.{(;,]/.test(character) ? 100 + Math.random() * 100 : 0;
      await wait(baseDelay + punctuationPause);
    }
    delete element.dataset.typing;
    row?.classList.remove('is-typing');
  }

  async function eraseText(element, count){
    const row = element.closest('.hello-code-row');
    element.dataset.typing = 'true';
    row?.classList.add('is-typing');
    for(let i = 0; i < count; i++){
      element.textContent = element.textContent.slice(0, -1);
      await wait(125);
    }
    delete element.dataset.typing;
    row?.classList.remove('is-typing');
  }

  const startedAt = performance.now();
  function updateProgress(now){
    const progress = Math.min(100, Math.round((now - startedAt) / minimumDuration * 100));
    fill.style.width = progress + '%';
    pctEl.textContent = progress + '%';
    if(progress < 100) requestAnimationFrame(updateProgress);
  }

  requestAnimationFrame(updateProgress);

  (async function runWelcomeProgram(){
    captionEl.textContent = 'Writing the class...';
    statusEl.textContent = 'Typing Welcome.java';
    await typeText(lineEls[0], sourceLines[0]);
    await wait(360);
    await typeText(lineEls[1], sourceLines[1]);
    await wait(360);

    captionEl.textContent = 'Tiny typo... fixing that.';
    statusEl.textContent = 'Revising one line...';
    const printPrefix = '        System.out.prinln';
    await typeText(lineEls[2], printPrefix);
    await wait(450);
    await eraseText(lineEls[2], 2);
    await typeText(lineEls[2], 'tln("Hello, World!");');

    await wait(300);
    await typeText(lineEls[3], sourceLines[3]);
    await wait(180);
    await typeText(lineEls[4], sourceLines[4]);

    captionEl.textContent = 'Compiling the program...';
    statusEl.textContent = 'Running javac Welcome.java';
    liveEl.textContent = 'COMPILING';
    await wait(350);
    await typeText(compileEl, '$ javac Welcome.java');
    await wait(850);

    captionEl.textContent = 'Running the program...';
    statusEl.textContent = 'Running java Welcome';
    liveEl.textContent = 'RUNNING';
    await typeText(runEl, '$ java Welcome');
    await wait(500);
    await typeText(outputEl, 'Hello, World!');

    const remaining = minimumDuration - (performance.now() - startedAt);
    if(remaining > 0) await wait(remaining);
    fill.style.width = '100%';
    pctEl.textContent = '100%';
    captionEl.textContent = 'It works — welcome!';
    statusEl.textContent = 'Portfolio ready.';
    liveEl.textContent = 'BUILD SUCCESS';
    await wait(450);
    finishLoading();
  })();
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

  // ---------- AWS Educate badge carousel ----------
  const badgeViewport = document.getElementById('badgeViewport');
  if (badgeViewport) {
    const badgeCards = Array.from(badgeViewport.querySelectorAll('.badge-card'));
    const badgeDots = Array.from(document.querySelectorAll('.badge-dot'));
    const previousBadge = document.querySelector('.badge-prev');
    const nextBadge = document.querySelector('.badge-next');
    let activeBadge = 0;

    function updateBadgeControls(index) {
      activeBadge = index;
      badgeDots.forEach((dot, dotIndex) => {
        dot.setAttribute('aria-current', String(dotIndex === activeBadge));
      });
      if (previousBadge) previousBadge.disabled = activeBadge === 0;
      if (nextBadge) nextBadge.disabled = activeBadge === badgeCards.length - 1;
    }

    function scrollToBadge(index) {
      if (!badgeCards.length) return;
      const targetIndex = Math.max(0, Math.min(index, badgeCards.length - 1));
      updateBadgeControls(targetIndex);
      const card = badgeCards[targetIndex];
      const cardCenter = card.getBoundingClientRect().left - badgeViewport.getBoundingClientRect().left + card.offsetWidth / 2;
      badgeViewport.scrollTo({
        left: badgeViewport.scrollLeft + cardCenter - badgeViewport.clientWidth / 2,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
      });
    }

    function updateBadgeFromScroll() {
      if (!badgeCards.length || !badgeViewport.clientWidth) return;
      const viewportCenter = badgeViewport.getBoundingClientRect().left + badgeViewport.clientWidth / 2;
      const currentIndex = badgeCards.reduce((closestIndex, card, index) => {
        const cardCenter = card.getBoundingClientRect().left + card.offsetWidth / 2;
        const closestCenter = badgeCards[closestIndex].getBoundingClientRect().left + badgeCards[closestIndex].offsetWidth / 2;
        return Math.abs(cardCenter - viewportCenter) < Math.abs(closestCenter - viewportCenter) ? index : closestIndex;
      }, 0);
      updateBadgeControls(currentIndex);
    }

    badgeDots.forEach((dot, index) => {
      dot.addEventListener('click', () => scrollToBadge(index));
    });
    previousBadge?.addEventListener('click', () => scrollToBadge(activeBadge - 1));
    nextBadge?.addEventListener('click', () => scrollToBadge(activeBadge + 1));
    badgeViewport.addEventListener('scroll', updateBadgeFromScroll, { passive: true });
    badgeViewport.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        scrollToBadge(activeBadge - 1);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        scrollToBadge(activeBadge + 1);
      }
    });
    updateBadgeControls(0);
  }

  // ---------- Recruiter contact form ----------
(function(){
  const form = document.getElementById('contactForm');
  const statusEl = document.getElementById('cf-status');
  const submitBtn = document.getElementById('cf-submit');
  const modal = document.getElementById('successModal');
  const closeBtn = document.getElementById('successClose');
  const okBtn = document.getElementById('successOk');
  const FUNCTION_URL = 'https://5rpgaktr3excbpalc566d5tiwa0kpmua.lambda-url.eu-north-1.on.aws/';

  if(!form || !statusEl || !submitBtn || !modal) return;

  async function sendRecruiterMessage(formData){
    const message = [
      formData.subject && `Subject: ${formData.subject}`,
      formData.company && `Company: ${formData.company}`,
      formData.role && `Opportunity / role: ${formData.role}`,
      formData.message
    ].filter(Boolean).join('\n\n');

    const response = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        message
      })
    });

    const result = await response.json();
    if(!response.ok || result.ok !== true) {
      throw new Error(result.error || result.message || 'Message was not accepted');
    }
    return result;
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
    statusEl.textContent='Sending your message...';
    statusEl.className='form-status sending';

    try{
      const result=await sendRecruiterMessage(formData);

      form.reset();
      submitBtn.classList.remove('sending');
      submitBtn.classList.add('sent');
      if(label) label.textContent='Sent!';
      if(icon) icon.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 4 4L19 6"/></svg>';
      statusEl.textContent='Thanks! Your message was sent.';
      statusEl.className='form-status ok';
      setTimeout(openSuccess,350);
    }catch(err){
      console.error('Recruiter form error:',err);
      statusEl.textContent=err.message
        ? `Could not send: ${err.message}`
        : 'Could not send your message. Check your connection and try again.';
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
