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

// 보는 사람의 시간대와 상관없이 한국 날짜로 센다
const kstDay = ms => Math.floor((ms + 9 * 3600000) / 86400000);
const left = kstDay(Date.parse('2027-01-03T12:00:00+09:00')) - kstDay(Date.now());
if (left >= 0) {
  const dday = document.getElementById('dday');
  dday.textContent = left === 0 ? '오늘입니다' : `${left}일 남았습니다`;
  dday.hidden = false;
}

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
