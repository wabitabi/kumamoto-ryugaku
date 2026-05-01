/* ============================================
   くまもと留学室 – main.js
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Header scroll shadow ---------- */
  const header = document.querySelector('.header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 10);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Hamburger menu ---------- */
  const hamburger   = document.querySelector('.hamburger');
  const mobileMenu  = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- Fade-up IntersectionObserver ---------- */
  const fadeEls = document.querySelectorAll('.fade-up');
  if ('IntersectionObserver' in window && fadeEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    fadeEls.forEach(el => io.observe(el));
  } else {
    fadeEls.forEach(el => el.classList.add('visible'));
  }

  /* ---------- FAQ Accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-q')?.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(o => o.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ---------- Program Tabs ---------- */
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(target)?.classList.add('active');
    });
  });

  /* ---------- Smooth scroll for anchor links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      const offset = header ? header.offsetHeight + 8 : 72;
      const top    = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ---------- Contact Form submit (Formspree) ---------- */
  // Formspree setup: https://formspree.io → 新規フォーム作成 → Form ID をここに貼る
  const FORMSPREE_ID = 'YOUR_FORM_ID'; // ← Formspree の Form ID に差し替えてください

  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      btn.disabled = true;
      btn.textContent = '送信中…';

      const data = new FormData(form);

      try {
        const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
          method: 'POST',
          body: data,
          headers: { Accept: 'application/json' },
        });

        if (res.ok) {
          form.innerHTML = `
            <div style="text-align:center;padding:48px 16px">
              <div style="font-size:3rem;margin-bottom:16px">🎉</div>
              <h3 style="color:var(--navy);margin-bottom:12px">送信が完了しました！</h3>
              <p style="color:#555;line-height:1.8">
                ご連絡いただきありがとうございます。<br>
                <strong style="color:var(--green)">2営業日以内</strong>にご返信いたします。<br><br>
                返信が届かない場合は、迷惑メールフォルダをご確認ください。
              </p>
            </div>
          `;
        } else {
          throw new Error('送信失敗');
        }
      } catch {
        btn.disabled = false;
        btn.textContent = '無料で資料請求する →';
        alert('送信に失敗しました。時間をおいて再度お試しください。');
      }
    });
  }

  /* ---------- Number counter animation ---------- */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const countIO = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el  = e.target;
        const end = parseInt(el.dataset.count, 10);
        const dur = 1400;
        const step = 16;
        const inc  = end / (dur / step);
        let cur = 0;
        const timer = setInterval(() => {
          cur = Math.min(cur + inc, end);
          el.textContent = Math.floor(cur).toLocaleString();
          if (cur >= end) clearInterval(timer);
        }, step);
        countIO.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(el => countIO.observe(el));
  }

  /* ---------- Back to top (footer) ---------- */
  document.querySelector('.back-to-top')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

});
