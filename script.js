// 사진: images/ 에 넣고 파일명을 적으세요. 예) ['01.jpg', '02.jpg']
const PHOTOS = [];

// 계좌: 예) { who: '신랑 신승윤', bank: '국민', number: '000000-00-000000' }
const ACCOUNTS = [];

const toast = document.getElementById('toast');
let toastTimer;
const showToast = msg => {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
};

// 카카오톡 인앱 브라우저는 clipboard API가 막힐 때가 있어 execCommand로 한 번 더 시도한다
const copy = async (text, msg) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    if (!ok) return showToast('복사하지 못했습니다');
  }
  showToast(msg);
};

if (PHOTOS.length) {
  const box = document.getElementById('photos');
  PHOTOS.forEach(name => {
    const img = new Image();
    img.src = `images/${name}`;
    img.alt = '';
    img.loading = 'lazy';
    box.append(img);
  });
  box.hidden = false;
}

if (ACCOUNTS.length) {
  const list = document.getElementById('accounts');
  ACCOUNTS.forEach(({ who, bank, number }) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.dataset.copy = number;
    btn.dataset.done = '계좌번호를 복사했습니다';
    const label = document.createElement('div');
    label.textContent = who;
    const detail = document.createElement('small');
    detail.textContent = `${bank} ${number}`;
    label.append(detail);
    const action = document.createElement('span');
    action.textContent = '복사';
    btn.append(label, action);
    const li = document.createElement('li');
    li.append(btn);
    list.append(li);
  });
  document.getElementById('gift').hidden = false;
}

document.addEventListener('click', e => {
  const btn = e.target.closest('[data-copy]');
  if (btn) copy(btn.dataset.copy, btn.dataset.done);
});

document.getElementById('share').addEventListener('click', async () => {
  const url = location.href.split('#')[0];
  if (navigator.share) {
    try {
      await navigator.share({ title: document.title, url });
    } catch {}
    return;
  }
  copy(url, '링크를 복사했습니다');
});

const couple = document.getElementById('couple');
couple.addEventListener('click', () => {
  couple.classList.remove('hop');
  void couple.offsetWidth;
  couple.classList.add('hop');
});

if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const root = document.documentElement;
  root.classList.add('motion', 'sealed');

  const seen = new IntersectionObserver(entries => {
    entries.forEach(({ isIntersecting, target }) => {
      if (isIntersecting) {
        target.querySelectorAll(':scope > .write').forEach(el => el.classList.add('on'));
        seen.unobserve(target);
      }
    });
  }, { rootMargin: '0px 0px -12% 0px' });

  const seal = document.getElementById('seal');
  seal.hidden = false;
  const open = () => {
    if (seal.classList.contains('open')) return;
    seal.classList.add('open');
    root.classList.remove('sealed');
    setTimeout(() => {
      // 다 가려진 글자는 화면에 들어와도 감지되지 않아 부모를 지켜본다
      document.querySelectorAll('.write').forEach(el => seen.observe(el.parentElement));
      document.getElementById('couple').classList.add('on');
    }, 700);
    setTimeout(() => seal.remove(), 1400);
  };
  seal.addEventListener('click', open);
  // 누르지 않고 스크롤부터 해도 막히지 않게 한다
  seal.addEventListener('wheel', open, { passive: true });
  seal.addEventListener('touchmove', open, { passive: true });

  const NS = 'http://www.w3.org/2000/svg';
  addEventListener('pointerdown', ({ clientX, clientY }) => {
    for (let i = 0; i < 6; i++) {
      const star = document.createElementNS(NS, 'svg');
      star.setAttribute('class', 'spark');
      star.style.left = `${clientX - 8}px`;
      star.style.top = `${clientY - 8}px`;
      const use = document.createElementNS(NS, 'use');
      use.setAttribute('href', '#flower');
      star.append(use);
      document.body.append(star);
      const angle = (i / 6) * Math.PI * 2 + Math.random() * 0.6;
      const reach = 28 + Math.random() * 28;
      star.animate(
        [
          { transform: 'translate(0, 0) scale(0.3)', opacity: 1 },
          { transform: `translate(${Math.cos(angle) * reach}px, ${Math.sin(angle) * reach}px) scale(1) rotate(90deg)`, opacity: 0 },
        ],
        { duration: 650, easing: 'ease-out' },
      ).onfinish = () => star.remove();
    }
  });
}
