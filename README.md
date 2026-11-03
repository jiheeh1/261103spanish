# 스페인어중남미학과 연구·수업 아카이브

교수님의 **연구·수업 자료**를 정리해 보여 주고, 학부·대학원생이 **토론**할 수 있는 웹사이트입니다.

- 지금은 **데모 모드**로 동작합니다. 토론 글·댓글이 *각자의 브라우저에만* 저장되므로 다른 사람과 공유되지 않습니다.
- 나중에 Firebase(구글의 무료 데이터베이스·로그인 서비스) 설정값만 넣으면, 코드 수정 없이 **실제 모드**로 바뀝니다.

> 📌 용어 풀이
> - **터미널**: 글자로 명령을 입력하는 창. Mac은 "터미널", Windows는 "PowerShell" 앱.
> - **Node.js**: 이 사이트를 내 컴퓨터에서 만들고 실행하는 데 필요한 프로그램.
> - **빌드(build)**: 코드를 인터넷에 올릴 수 있는 완성본(`dist` 폴더)으로 바꾸는 과정.
> - **배포**: 완성본을 인터넷에 올려 누구나 주소로 접속할 수 있게 하는 것.

---

## (a) 내 컴퓨터에서 실행하는 법

1. **Node.js 설치** (처음 한 번만): <https://nodejs.org> 에서 **LTS** 버전(22 이상)을 내려받아 설치합니다.
2. 터미널을 열고 이 프로젝트 폴더로 이동합니다.
   ```bash
   cd 프로젝트폴더경로
   ```
3. 필요한 부품을 설치합니다 (처음 한 번만, 1~2분 걸림).
   ```bash
   npm install
   ```
4. 사이트를 실행합니다.
   ```bash
   npm run dev
   ```
5. 터미널에 나오는 주소(보통 <http://localhost:5173>)를 브라우저에서 엽니다. 끌 때는 터미널에서 `Ctrl + C`.

그 밖의 명령어

| 명령어 | 하는 일 |
| --- | --- |
| `npm run build` | 인터넷에 올릴 완성본을 `dist` 폴더에 만듭니다 (타입 검사 포함) |
| `npm run typecheck` | 코드에 형식 오류가 없는지만 검사합니다 |
| `npm test` | 데모 저장소가 제대로 동작하는지 자동 시험합니다 |

### 데모 모드 체험

- 오른쪽 위 **로그인** → 이름만 입력하면 가짜 사용자로 로그인됩니다.
- 이메일 칸에 `src/config/site.ts`의 **관리자 이메일**을 넣으면 *관리자*로 체험할 수 있습니다 (모든 글·댓글 삭제 가능).
- 처음 접속하면 샘플 글 3개와 댓글이 들어 있습니다. 데이터를 초기화하려면 브라우저의 "사이트 데이터 삭제"를 하세요.

---

## (b) 내용 바꾸는 법

파일은 VS Code 같은 편집기로 열어 고치면 됩니다. 저장하면 `npm run dev` 화면이 자동으로 바뀝니다.

### 1) 사이트 기본 정보 — `src/config/site.ts`

`[ ]`로 둘러싸인 값을 바꿔 주세요.

```ts
export const site = {
  siteName: '홍길동 교수 연구·수업 아카이브',
  professorName: '홍길동',
  department: '○○대학교 스페인어중남미학과',
  intro: '스페인어권 문학·문화를 연구합니다. ...',
  contactEmail: 'prof@example.ac.kr',
  adminEmail: 'prof@gmail.com',   // 관리자로 로그인할 Google 계정 이메일
  biography: ['○○대학교 문학박사', '현 ○○대학교 교수'],
} as const;
```

> 화면에 보이는 그 밖의 문구(버튼 이름, 안내문, **개인정보 안내** 등)는 `src/config/texts.ts`에 모여 있습니다.
> 색과 글꼴은 `src/index.css` 맨 위 `@theme` 부분에서 바꿉니다.

### 2) 연구 자료 추가 — `src/content/research.ts`

배열 `[ ... ]` 안에 아래 덩어리를 하나 복사해 붙이고 내용을 바꿉니다. 쉼표(`,`)를 빠뜨리지 마세요.

```ts
  {
    id: 'cien-anos',                       // 주소에 쓰임 → /research/cien-anos (영문 소문자·숫자·하이픈만)
    title: '중남미 소설의 시간 구조',
    field: '중남미 문학',                    // 목록의 "분야" 필터에 그대로 쓰임
    year: 2026,                            // "연도" 필터
    keywords: ['소설', 'tiempo'],           // 검색에 쓰임
    summary: '한두 문장 요약',
    body: `## 소제목

본문은 **마크다운** 형식으로 씁니다.
- 목록은 이렇게
> 인용은 이렇게
`,
    links: [
      { type: 'paper',   label: '논문 PDF',     url: 'https://...' },
      { type: 'drive',   label: '자료 폴더',     url: 'https://drive.google.com/...' },
      { type: 'youtube', label: '강연 영상',     url: 'https://youtube.com/...' },
    ],
  },
```

`type`은 `paper`(논문), `drive`(구글 드라이브), `youtube`(유튜브), `web`(웹사이트), `slides`(발표 자료) 중 하나입니다.

> 📝 마크다운: `##` 제목, `**굵게**`, `*기울임*`, `-` 목록, `>` 인용처럼 간단한 기호로 서식을 넣는 방법.
> 안전을 위해 마크다운 안의 HTML 태그는 화면에 표시되지 않습니다.

### 3) 수업 자료 추가 — `src/content/courses.ts`

```ts
  {
    id: 'spanish-conversation',
    title: '스페인어 회화',
    level: 'undergraduate',        // 학부: 'undergraduate' / 대학원: 'graduate'
    semester: '2027년 1학기',
    overview: '수업 개요...',
    weeks: [
      { week: 1, topic: '수업 안내', links: [{ type: 'slides', label: '1주차 슬라이드', url: 'https://...' }] },
      { week: 2, topic: '인사 표현', links: [] },   // 자료가 아직 없으면 빈 [ ]
    ],
  },
```

> 샘플 자료(제목에 "(샘플)"이 붙은 것)와 `example.com` 링크는 실제 내용으로 바꾸거나 지워 주세요.
> 단, 샘플 토론 글이 샘플 자료(`magical-realism`, `spanish-reading`)에 연결돼 있으므로, 지우면 그 글의 "관련 자료" 표시만 사라집니다 (오류는 아님).

---

## (c) GitHub에 올리는 법

> **GitHub**: 코드를 인터넷에 보관하는 서비스. Netlify가 여기서 코드를 가져가 사이트를 만듭니다.

1. <https://github.com> 에서 로그인 → 오른쪽 위 **+** → **New repository**.
2. 이름을 정하고(예: `spanish-archive`), *README 추가 등은 체크하지 말고* **Create repository**.
3. 터미널에서 프로젝트 폴더로 이동한 뒤 (첫 저장(커밋)은 이미 되어 있습니다):
   ```bash
   git remote add origin https://github.com/내아이디/spanish-archive.git
   git branch -M main
   git push -u origin main
   ```
4. 이후 내용을 고친 뒤 다시 올릴 때:
   ```bash
   git add .
   git commit -m "연구 자료 추가"
   git push
   ```

> `.env` 파일(Firebase 설정값)은 `.gitignore`에 들어 있어 GitHub에 올라가지 않습니다.

---

## (d) Netlify 배포 법

> **Netlify**: GitHub의 코드를 가져가 자동으로 웹사이트로 만들어 주는 무료 서비스. GitHub에 올릴 때마다 자동으로 다시 배포됩니다.

1. <https://app.netlify.com> 에 GitHub 계정으로 로그인.
2. **Add new site → Import an existing project → GitHub** → 위에서 만든 저장소 선택.
3. 설정값을 확인합니다. (`netlify.toml` 파일 덕분에 대부분 자동으로 채워집니다.)

| 항목 | 값 |
| --- | --- |
| Branch to deploy | `main` |
| Base directory | (비워 둠) |
| Build command | `npm run build` |
| Publish directory | `dist` |
| Node 버전 | `22` (`netlify.toml`에 지정됨) |
| 환경변수 | 데모 모드에서는 **입력하지 않음** |

4. **Deploy** → 1~2분 뒤 `https://무작위이름.netlify.app` 주소가 생깁니다.
   **Site configuration → Change site name**에서 주소 앞부분을 바꿀 수 있습니다.

> `/research/abc` 같은 주소로 바로 들어오거나 새로고침해도 404가 나지 않도록 `netlify.toml`에 설정해 두었습니다.

---

## (e) Firebase 연동 체크리스트

> **Firebase**: 구글이 제공하는 데이터베이스(Firestore)와 로그인(Authentication) 서비스.
> 연동하면 토론 글이 모든 사람에게 공유되고, Google 계정으로 로그인합니다.

⚠️ **아직 검증되지 않은 부분**: `src/services/firebaseRepository.ts`(Firebase 연결 코드)는 완성되어 있지만,
실제 Firebase 프로젝트가 없어 **실제 동작은 시험하지 못했습니다.** 연동 후 아래 "확인" 항목을 꼭 점검해 주세요.

- [ ] **1. 프로젝트 생성**: <https://console.firebase.google.com> → 프로젝트 추가 (Google 애널리틱스는 꺼도 됨). 요금제는 **Spark(무료)** 그대로 둡니다.
- [ ] **2. 웹앱 등록**: 프로젝트 개요 옆 ⚙️ → 프로젝트 설정 → "내 앱"에서 `</>`(웹) 아이콘 → 앱 이름 입력 → 등록.
  *Firebase Hosting 설정은 체크하지 않습니다* (Netlify를 씀). 화면에 나오는 `firebaseConfig` 값 6개를 메모해 둡니다.
- [ ] **3. Google 로그인 사용 설정**: 왼쪽 메뉴 **Authentication** → 시작하기 → Sign-in method → **Google** → 사용 설정 → 지원 이메일 선택 → 저장.
- [ ] **4. 승인된 도메인 추가**: Authentication → **Settings → 승인된 도메인** → 도메인 추가 → `무작위이름.netlify.app` (https:// 없이). 나중에 개인 도메인을 쓰면 그것도 추가.
- [ ] **5. Firestore 데이터베이스 생성**: 왼쪽 메뉴 **Firestore Database** → 데이터베이스 만들기 → 위치는 `asia-northeast3 (서울)` 권장(나중에 바꿀 수 없음) → **프로덕션 모드**로 시작.
- [ ] **6. 보안 규칙 붙여넣기**: Firestore → **규칙(Rules)** 탭 → 이 프로젝트의 `firestore.rules` 내용을 통째로 붙여 넣고,
  `'ADMIN_EMAIL'`을 **관리자 Google 이메일**로 바꾼 뒤 **게시**. (`site.ts`의 `adminEmail`과 같은 값이어야 합니다)
- [ ] **7. Netlify 환경변수 6개 입력**: Netlify → Site configuration → **Environment variables** → Add a variable. 2번에서 메모한 값을 넣습니다.

  | Netlify 변수 이름 | firebaseConfig의 항목 |
  | --- | --- |
  | `VITE_FIREBASE_API_KEY` | `apiKey` |
  | `VITE_FIREBASE_AUTH_DOMAIN` | `authDomain` |
  | `VITE_FIREBASE_PROJECT_ID` | `projectId` |
  | `VITE_FIREBASE_STORAGE_BUCKET` | `storageBucket` |
  | `VITE_FIREBASE_MESSAGING_SENDER_ID` | `messagingSenderId` |
  | `VITE_FIREBASE_APP_ID` | `appId` |

  > 이 값들은 브라우저에 공개되도록 만들어진 "웹 설정값"이라 비밀번호가 아닙니다. 데이터 보호는 6번의 보안 규칙이 담당합니다.
  > 내 컴퓨터에서 시험하려면 `.env.example`을 복사해 `.env`로 이름을 바꾸고 같은 값을 넣은 뒤 `npm run dev`.

- [ ] **8. 재배포**: Netlify → **Deploys → Trigger deploy → Deploy site**. (환경변수는 다시 빌드해야 반영됩니다)

**연동 후 확인할 것**

- [ ] 맨 위의 노란 "데모 모드" 띠가 사라졌는가
- [ ] 로그인 화면에 **Google로 로그인** 버튼이 나오고 로그인되는가
- [ ] 글쓰기 → 댓글 → 삭제가 되는가 (다른 브라우저·다른 계정에서도 같은 글이 보이는가)
- [ ] 관리자 계정으로 남의 글·댓글을 지울 수 있는가
- [ ] **색인(index) 만들기**: 토론 목록에서 *카테고리 필터*를 누르거나 *연구·수업 상세의 토론 목록*을 처음 열면 오류가 날 수 있습니다.
  브라우저 개발자 도구(F12) → Console에 나오는 `https://console.firebase.google.com/...` 링크를 눌러 **색인 만들기**를 하면 몇 분 뒤 해결됩니다.
  필요한 색인 2개는 `firestore.indexes.json`에 적어 두었습니다 (posts: `category`+`createdAt` 내림차순, `relatedKey`+`createdAt` 내림차순).

**Firebase 모드에서 달라지는 점**

- 보안 규칙상 **로그인한 사람만 토론을 읽을 수 있습니다.** 로그인하지 않은 방문자에게는 토론 자리에 로그인 안내가 보입니다. (연구·수업 자료는 누구나 볼 수 있음)
- 글 작성자가 자기 글을 지우면 *다른 사람의 댓글*은 데이터베이스에 남지만 화면 어디에도 보이지 않습니다. 관리자가 지우면 댓글까지 함께 지워집니다.

---

## (f) 무료 요금제(Spark) 주의사항

- 이 사이트는 **Spark(무료) 요금제 안에서만** 동작하도록 만들었습니다. Firebase 콘솔에서 **Blaze(종량제)로 업그레이드하지 마세요.**
- 사용하지 않는 유료 기능: Cloud Functions, Cloud Storage(파일 업로드), 전화번호 인증, Firebase Hosting, 확장 프로그램(Extensions).
  → 파일은 구글 드라이브·유튜브 등에 올리고 **링크**로 연결하세요.
- Firestore 무료 한도(대략): **하루 읽기 5만 회, 쓰기 2만 회, 삭제 2만 회, 저장 1GB.** 한도를 넘으면 그날은 잠시 멈추고 다음 날 자동으로 풀립니다(요금이 청구되지 않음).
- 읽기 횟수를 아끼도록 만들었습니다.
  - 실시간 자동 갱신을 쓰지 않습니다. 새 글은 **새로고침**해야 보입니다.
  - 토론 목록은 한 번에 **20개**씩, 홈의 최근 토론은 **5개**만 읽습니다. 글 하나의 댓글은 최대 200개까지 읽습니다.
- 사용량은 Firebase 콘솔 → Firestore → **사용량(Usage)** 탭에서 확인할 수 있습니다.

---

## 폴더 안내 (참고)

```
src/
  config/site.ts         사이트 이름·교수 정보·관리자 이메일
  config/texts.ts        화면 문구 모음
  config/limits.ts       글자 수 제한 등 숫자 설정
  content/               연구·수업 자료 (여기만 고치면 자료가 바뀜)
  services/              데이터 저장 담당 (데모/Firebase 자동 선택)
    repository.ts          화면이 쓰는 약속(인터페이스)
    mockRepository.ts      데모 모드: 브라우저에 저장
    firebaseRepository.ts  Firebase 모드: Firestore + Google 로그인
    firebase.ts            환경변수를 보고 둘 중 하나를 고름
  auth/AuthContext.tsx   로그인 상태를 앱 전체에 전달
  components/  pages/    화면 조각과 페이지
netlify.toml             Netlify 배포 설정
firestore.rules          Firestore 보안 규칙 (ADMIN_EMAIL 교체 필요)
firestore.indexes.json   필요한 Firestore 색인 목록 (참고용)
.env.example             Firebase 환경변수 양식
```
