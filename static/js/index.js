// EE-Motion project page: walkthrough viewer (Figure 2, for the Demonstration section,
// currently not on the page), scenario chips of the video, YouTube menu, BibTeX copy.
document.addEventListener('DOMContentLoaded', () => {
  // Walkthrough viewer: step chips, previous/next buttons, arrow keys.
  const journey = document.getElementById('journey');
  if (journey) {
    const steps = [...journey.querySelectorAll('.journey-step')];
    const frames = [...journey.querySelectorAll('.journey-frame')];
    let current = 0;
    const show = (i) => {
      current = (i + frames.length) % frames.length;
      steps.forEach((s, k) => {
        s.classList.toggle('is-active', k === current);
        s.setAttribute('aria-selected', String(k === current));
      });
      frames.forEach((f, k) => f.classList.toggle('is-active', k === current));
    };
    steps.forEach((s, k) => s.addEventListener('click', () => show(k)));
    journey.querySelector('.journey-nav.is-prev').addEventListener('click', () => show(current - 1));
    journey.querySelector('.journey-nav.is-next').addEventListener('click', () => show(current + 1));
    journey.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') show(current - 1);
      if (e.key === 'ArrowRight') show(current + 1);
    });
  }

  // Scenario chips above the video: show the selected panel, pause the others.
  document.querySelectorAll('.scenario-tabs').forEach((list) => {
    const tabs = [...list.querySelectorAll('[role="tab"]')];
    tabs.forEach((tab) => tab.addEventListener('click', () => {
      if (tab.getAttribute('aria-disabled') === 'true') return;
      tabs.forEach((other) => {
        const on = other === tab;
        other.classList.toggle('is-active', on);
        other.setAttribute('aria-selected', String(on));
        const panel = document.getElementById(other.getAttribute('aria-controls'));
        if (panel) {
          panel.hidden = !on;
          if (!on) panel.querySelectorAll('video').forEach((v) => v.pause());
        }
      });
    }));
  });

  // YouTube menu in the header: toggle on click, close on outside click, Escape or choice.
  document.querySelectorAll('.yt-dropdown').forEach((dd) => {
    const toggle = dd.querySelector('.yt-toggle');
    const menu = dd.querySelector('.yt-menu');
    const setOpen = (open) => {
      if (open) {
        // Keep the menu, centered under the button, at least 16 px inside the viewport.
        const b = dd.getBoundingClientRect();
        const left = b.left + b.width / 2 - menu.offsetWidth / 2;
        const right = left + menu.offsetWidth;
        const dx = Math.max(16 - left, 0) - Math.max(right - (document.documentElement.clientWidth - 16), 0);
        menu.style.setProperty('--dx', `${dx}px`);
      }
      dd.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    };
    toggle.addEventListener('click', () => setOpen(!dd.classList.contains('is-open')));
    menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
    document.addEventListener('click', (e) => { if (!dd.contains(e.target)) setOpen(false); });
    dd.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && dd.classList.contains('is-open')) { setOpen(false); toggle.focus(); }
    });
  });

  // Copy BibTeX.
  document.querySelectorAll('.copy-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const label = btn.querySelector('.copy-label');
      try {
        await navigator.clipboard.writeText(document.getElementById(btn.dataset.copy).textContent);
        label.textContent = 'Copied';
      } catch {
        label.textContent = 'Press Ctrl+C';
        window.getSelection().selectAllChildren(document.getElementById(btn.dataset.copy));
      }
      setTimeout(() => { label.textContent = 'Copy'; }, 2000);
    });
  });
});
