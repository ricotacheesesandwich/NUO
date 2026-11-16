# NUO Website — GitHub Pages 배포용

NUO 웹사이트의 **GitHub Pages용 정적 프로젝트**입니다. npm 설치나 Vite 빌드가 필요하지 않습니다.

## 이번 수정
- Case 제목: **60px** (데스크톱)
- Main Body 제목: **60px** (데스크톱)
- 작은 화면(820px 이하)에서는 잘림 방지를 위해 최대 60px의 유동형 크기 사용
- 기존 6장 디테일 이미지의 3초 전환, 글자 등장 효과, 파츠 분해/호버 애니메이션 유지

## 폴더 구조

```text
NUO_GitHub_Pages/
├── index.html        # GitHub Pages 시작 페이지
├── styles.css        # 모든 스타일 (Case/Main Body 60px 수정 포함)
├── script.js         # 제품 애니메이션 / 인터랙션
├── gallery.js        # 디테일 사진 자동 전환
├── assets/           # 실제 제품 사진/로고 (누락 없이 배포)
├── .nojekyll         # Pages에서 추가 처리 없이 정적 파일 배포
├── .gitignore
└── README.md
```

## 1. VS Code에서 확인
1. 이 ZIP 파일을 풀어 `NUO_GitHub_Pages` 폴더를 VS Code에서 엽니다.
2. `index.html` 파일을 브라우저로 열거나, VS Code Live Server 확장 기능으로 실행합니다.
3. CSS 파일은 `styles.css`, JS는 `script.js`와 `gallery.js`에서 수정할 수 있습니다.
4. 제품 이미지는 `assets` 폴더에 있으므로, 파일을 따로 이동하거나 삭제하지 마세요.

## 2. GitHub에 처음 업로드하기 — 새 저장소 기준

GitHub에서 `nuo-website` 같은 **새 Public 저장소**를 만든 뒤, VS Code 터미널에서 아래 명령을 실행합니다.

> `<GitHub아이디>`는 실제 GitHub 사용자 이름으로 바꾸세요. 예를 들어 `<GitHub아이디>`를 그대로 입력하면 안 됩니다.

```bash
git init -b main
git add .
git commit -m "feat: deploy NUO landing page"
git remote add origin https://github.com/<GitHub아이디>/nuo-website.git
git push -u origin main
```

- 저장소를 만들 때 README나 다른 파일로 초기화하지 않은 빈 저장소가 가장 간단합니다.
- Git 로그인/인증은 Git Credential Manager 또는 브라우저 로그인으로 처리합니다.
- **기존 내용이 있는 저장소에는 이 순서대로 강제 푸시하지 마세요.** 기존 저장소를 `git clone`한 뒤 그 안에 이 프로젝트 파일을 복사하고 커밋/푸시하세요.
- 이후 수정 내용을 반영하려면 다음만 실행하세요:

```bash
git add .
git commit -m "style: adjust NUO site"
git push origin main
```

## 3. GitHub Pages 활성화

1. GitHub 저장소의 **Settings → Pages**를 엽니다.
2. **Build and deployment → Source: Deploy from a branch**를 선택합니다.
3. **Branch: main**, **Folder: /(root)**를 선택하고 **Save**를 누릅니다.
4. 배포가 완료되면 주소는 일반적으로 다음과 같습니다.

```text
https://<GitHub아이디>.github.io/nuo-website/
```

GitHub Pages는 `main` 브랜치의 최상단 `index.html`을 시작 페이지로 사용합니다. 배포 상태는 저장소의 Actions/Pages에서 확인하세요.

## 참고

- 이 프로젝트는 **정적 사이트**입니다. 별도의 구매 결제 시스템이나 쇼핑몰 백엔드가 연결되어 있지 않습니다. `구매하기` 버튼은 현재 페이지 내부 `#case` 섹션으로 이동합니다.
- 현재 스타일의 윤고딕 계열은 **사용자 PC/브라우저에 설치된 폰트**를 우선합니다. 실제 윤고딕 웹폰트를 배포하려면 별도로 정식 웹폰트 라이선스를 확인하고 적용해야 합니다. 폰트 파일은 이 프로젝트에 포함하지 않았습니다.

## 코드 경량화 (2026-11-17)

- CSS에서 같은 선택자/동일 속성의 덮어쓴 선언을 정리했습니다.
- 실제 사용하지 않는 이전 애니메이션 정의와 레거시 스타일을 제거했습니다.
- CSS 우선순위를 선택자와 미디어쿼리로 관리하며 강제 우선순위 구문을 사용하지 않습니다.
- 사용하지 않는 외부 Pretendard 로딩 링크를 제거했습니다. 기존 윤고딕 우선 글꼴 스택은 유지됩니다. 윤고딕 웹폰트 파일은 별도 라이선스가 필요합니다.
- 파츠 분해, 호버 확대/간격 조정, Head Types 등장, 세 단어 순차 등장, 디테일 사진 3초 전환 등 기존 기능은 유지합니다.
- 데스크톱 1440/1024px, 모바일 390px에서 원본과 정적 화면 픽셀 비교를 완료했고, 파츠 호버 화면도 확인했습니다.

### 유지보수

웹페이지 구조는 `index.html`, 레이아웃/반응형은 `styles.css`, 분해 애니메이션은 `script.js`, 사진 자동 전환은 `gallery.js`를 수정하세요. 기존 `assets` 파일명과 상대 경로는 유지해야 합니다.
