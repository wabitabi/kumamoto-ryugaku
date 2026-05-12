/* WABITABI — main.js */

/* Header scroll effect */
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* Mobile hamburger menu */
const hamburger = document.getElementById('hamburger');
const nav       = document.getElementById('global-nav');
hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  nav.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
});

/* Close nav on link click */
nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    nav.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

/* Scroll reveal */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

/* Footer year */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* Contact form — placeholder handler
   実際の送信先は FormSubmit / Netlify Forms / 外部APIに差し替えてください
   例: action属性にFormSubmitのURLを設定するだけでも動作します
       <form action="https://formsubmit.co/your@email.com" method="POST"> */
const form    = document.getElementById('contact-form');
const message = document.getElementById('form-message');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled    = true;
    btn.textContent = '送信中…';
    message.className = 'form-message';
    message.textContent = '';

    /* ---- 送信処理をここに実装 ----
       例: fetch('/api/contact', { method: 'POST', body: new FormData(form) })
       現在はダミーの成功表示のみ
    -------------------------------- */
    await new Promise(r => setTimeout(r, 800)); /* デモ用遅延 */

    message.className   = 'form-message success';
    message.textContent = 'お問い合わせを受け付けました。担当者よりご連絡いたします。';
    form.reset();
    btn.disabled    = false;
    btn.textContent = '送信する';
  });
}

/* Smooth scroll for anchor links (Safari fallback) */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
