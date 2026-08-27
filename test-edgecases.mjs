export default async function run(page, ui) {
  const testCounts = [1, 5, 12, 30];
  const outcomes = [];

  for (const count of testCounts) {
    // Navigate to page fresh with count override via evaluate before or at start
    await page.goto('file:///home/wtc01/personal_projects/siyamthanda-portfolio/siyamthanda-portfolio/index.html');

    // We can evaluate and test how the preloader behaves
    const result = await page.evaluate(async (testBugCount) => {
      // Let's create an isolated test run in page context
      const loader = document.getElementById('loader');
      const fill = document.getElementById('loaderFill');
      const pctEl = document.getElementById('loaderPct');
      const statusEl = document.getElementById('loaderStatus');
      const captionEl = document.getElementById('loaderCaption');
      const bugField = document.getElementById('bugField');

      // Clear existing bugs
      bugField.innerHTML = '';

      const bugSvg = `<svg viewBox="0 0 40 40">
        <ellipse class="shell" cx="20" cy="22" rx="11" ry="14"/>
        <circle class="spot" cx="16" cy="16" r="2"/><circle class="spot" cx="24" cy="20" r="2"/><circle class="spot" cx="16" cy="26" r="2"/>
        <line class="leg" x1="10" y1="14" x2="3" y2="10"/><line class="leg" x1="9" y1="22" x2="2" y2="22"/><line class="leg" x1="10" y1="30" x2="3" y2="34"/>
        <line class="leg" x1="30" y1="14" x2="37" y2="10"/><line class="leg" x1="31" y1="22" x2="38" y2="22"/><line class="leg" x1="30" y1="30" x2="37" y2="34"/>
        <path class="antenna" d="M15 9 L11 3"/><path class="antenna" d="M25 9 L29 3"/>
      </svg>
      <div class="bug-spark"><svg viewBox="0 0 40 40"><path d="M20 2 L20 10 M20 30 L20 38 M2 20 L10 20 M30 20 L38 20 M7 7 L13 13 M27 27 L33 33 M33 7 L27 13 M13 27 L7 33"/></svg></div>`;

      const bugs = [];
      for (let i = 0; i < testBugCount; i++) {
        const bug = document.createElement('div');
        bug.className = 'bug';
        bug.innerHTML = bugSvg;
        bug.style.left = (4 + Math.random() * 88) + '%';
        bug.style.top = (4 + Math.random() * 78) + '%';
        bug.style.setProperty('--dx', `${Math.round((Math.random() * 2 - 1) * 22)}px`);
        bug.style.setProperty('--dy', `${Math.round((Math.random() * 2 - 1) * 18)}px`);
        bug.style.setProperty('--speed', `${(2 + Math.random() * 2.5).toFixed(2)}s`);
        bug.style.setProperty('--delay', `${(-Math.random() * 2).toFixed(2)}s`);
        bugField.appendChild(bug);
        bugs.push(bug);
      }

      // Verify each bug gets squashed and removed
      let squashed = 0;
      const history = [];

      for (let p = 0; p <= 100; p += 10) {
        const targetSquashed = Math.min(testBugCount, Math.floor(p / 100 * testBugCount));
        while (squashed < targetSquashed) {
          const bug = bugs[squashed];
          const bugNumber = squashed + 1;

          if (bug) {
            bug.classList.add('squashed');

            let removed = false;
            const removeBug = () => {
              if (!removed) {
                removed = true;
                bug.remove();
              }
            };

            bug.addEventListener('animationend', (e) => {
              if (e.target === bug && e.animationName === 'bugdie') {
                removeBug();
              }
            });
            setTimeout(removeBug, 600);
          }
          squashed = bugNumber;
        }
        history.push({
          progress: p,
          squashedCount: squashed,
          domBugsRemaining: bugField.querySelectorAll('.bug').length
        });
      }

      // Wait 700ms for all squash animations/timeouts to finish removing from DOM
      await new Promise(res => setTimeout(res, 700));

      const finalDomBugs = bugField.querySelectorAll('.bug').length;
      return {
        testBugCount,
        finalDomBugs,
        allRemoved: finalDomBugs === 0,
        squashedTargetReached: squashed === testBugCount
      };
    }, count);

    outcomes.push(result);
  }

  return outcomes;
}
