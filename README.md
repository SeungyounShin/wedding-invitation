# 승윤 · 유라 청첩장

빌드 없는 정적 페이지. `index.html` / `style.css` / `script.js` 세 파일.

## 채워야 할 것

| 위치 | 내용 |
|---|---|
| `images/cover.jpg` | 표지 사진 (3:4 권장). 없으면 타이포 표지로 대체됨 |
| `images/01.jpg` ~ `06.jpg` | 갤러리. 파일명은 `index.html`의 `.gallery__grid` 에서 수정. 하나도 없으면 섹션 자동 숨김 |
| `images/og.jpg` | 카톡 공유 썸네일 (1200×630) |
| `index.html` `.contact__btn` | `data-tel="01012345678"` 형식으로 전화번호 |
| `index.html` `.acct li` | 계좌 — `data-account` 에 숫자만, `.acct__num` 에 표시용 텍스트 |

날짜·시간은 `<body data-date="...">` 한 곳만 바꾸면 달력·디데이·캘린더 저장이 전부 따라감.

## GitHub Pages 배포

```bash
cd wedding-invitation
git remote add origin git@github.com:<아이디>/<아이디>.github.io.git
git push -u origin main
```

`<아이디>.github.io` 저장소에 올리면 `https://<아이디>.github.io` 가 바로 주소.
다른 이름의 저장소면 Settings → Pages → Branch: `main` / root 선택 후 `https://<아이디>.github.io/<저장소>`.
