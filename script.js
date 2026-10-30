(() => {
  const WEDDING = new Date(document.body.dataset.date);
  const DOW = ['일', '월', '화', '수', '목', '금', '토'];

  /* ── 달력 ── */
  const cal = document.getElementById('calendar');
  if (cal) {
    const y = WEDDING.getFullYear();
    const m = WEDDING.getMonth();
    const first = new Date(y, m, 1).getDay();
    const days = new Date(y, m + 1, 0).getDate();
    const frag = document.createDocumentFragment();

    DOW.forEach(d => {
      const el = document.createElement('div');
      el.className = 'cal__dow';
      el.textContent = d;
      frag.appendChild(el);
    });
    for (let i = 0; i < first; i++) {
      const el = document.createElement('div');
      el.className = 'cal__day is-pad';
      frag.appendChild(el);
    }
    for (let d = 1; d <= days; d++) {
      const el = document.createElement('div');
      el.className = 'cal__day' + (d === WEDDING.getDate() ? ' is-wedding' : '');
      el.textContent = d;
      frag.appendChild(el);
    }
    cal.appendChild(frag);
  }

  /* ── 디데이 ── */
  const dday = document.getElementById('dday');
  if (dday) {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const target = new Date(WEDDING); target.setHours(0, 0, 0, 0);
    const diff = Math.round((target - today) / 86400000);
    if (diff > 0) dday.textContent = 'D-' + diff;
    else if (diff === 0) { dday.textContent = 'D-Day'; dday.classList.add('is-today'); }
    else dday.textContent = 'D+' + Math.abs(diff);
  }

  /* ── 연락 버튼: 번호 없으면 숨김 ── */
  document.querySelectorAll('.contact__btn').forEach(a => {
    const tel = a.dataset.tel.replace(/\D/g, '');
    if (tel) a.href = 'tel:' + tel;
    else a.hidden = true;
  });

  /* ── 갤러리: 깨진 이미지 제거, 전부 없으면 섹션 숨김 ── */
  const gallery = document.getElementById('gallery');
  if (gallery) {
    const imgs = [...gallery.querySelectorAll('img')];
    let pending = imgs.length;
    const settle = () => { if (--pending === 0 && !gallery.querySelector('img')) gallery.hidden = true; };
    imgs.forEach(img => {
      img.addEventListener('load', settle, { once: true });
      img.addEventListener('error', () => { img.remove(); settle(); }, { once: true });
    });
  }

  /* ── 복사 ── */
  const toast = document.getElementById('toast');
  let toastTimer;
  const showToast = msg => {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
  };
  const copy = async (text, msg) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast(msg);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      document.execCommand('copy'); ta.remove();
      showToast(msg);
    }
  };

  document.querySelectorAll('.acct__copy').forEach(btn => {
    btn.addEventListener('click', () => {
      const li = btn.closest('li');
      const num = li.dataset.account || li.querySelector('.acct__num').textContent.replace(/[^\d-]/g, '');
      copy(num, '계좌번호가 복사되었습니다');
    });
  });

  const copyLink = document.getElementById('copyLink');
  if (copyLink) copyLink.addEventListener('click', () => copy(location.href.split('#')[0], '링크가 복사되었습니다'));

  /* ── .ics 생성 ── */
  const addCal = document.getElementById('addCal');
  if (addCal) {
    const pad = n => String(n).padStart(2, '0');
    const fmt = d => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
    const end = new Date(WEDDING.getTime() + 2 * 3600000);
    const ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//wedding//KR',
      'BEGIN:VEVENT',
      `DTSTART;TZID=Asia/Seoul:${fmt(WEDDING)}`,
      `DTEND;TZID=Asia/Seoul:${fmt(end)}`,
      'SUMMARY:신승윤 · 최유라 결혼식',
      'LOCATION:롯데호텔 서울 38층 무궁화 (서울 중구 을지로 30)',
      'END:VEVENT', 'END:VCALENDAR'
    ].join('\r\n');
    addCal.href = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(ics);
  }

  /* ── 스크롤 등장 ── */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();
