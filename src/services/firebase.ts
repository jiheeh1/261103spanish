// 어떤 저장소를 쓸지 고르는 곳.
//  - VITE_FIREBASE_* 환경변수 6개가 모두 있으면 → Firebase 모드
//  - 하나라도 없으면 → 데모 모드 (localStorage)
// Firebase를 연결할 때 코드는 고칠 필요 없이 .env(또는 Netlify 환경변수)만 채우면 됩니다.
//
// Firebase 프로그램 묶음은 크기가 커서(약 700KB), Firebase 모드일 때만 따로 내려받도록
// import()로 "필요할 때 불러오기"를 합니다. 데모 모드 사이트가 그만큼 빨리 열립니다.
import type { AuthService, Backend, Repository } from './repository';
import { createMockBackend } from './mockRepository';

const env = import.meta.env;

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
};

/** 6개 값이 모두 비어 있지 않은지 */
export const isFirebaseConfigured = Object.values(firebaseConfig).every(
  (v) => typeof v === 'string' && v.trim() !== '',
);

type Loaded = { repository: Repository; auth: AuthService };

/** Firebase SDK를 처음 쓰는 순간 한 번만 불러와 초기화합니다 */
function createLazyFirebaseBackend(): Loaded {
  let loading: Promise<Loaded> | null = null;
  const load = () =>
    (loading ??= Promise.all([import('firebase/app'), import('./firebaseRepository')]).then(
      ([{ initializeApp }, { createFirebaseBackend }]) => createFirebaseBackend(initializeApp(firebaseConfig)),
    ));

  const repository: Repository = {
    listPosts: async (o) => (await load()).repository.listPosts(o),
    getPost: async (id) => (await load()).repository.getPost(id),
    createPost: async (input) => (await load()).repository.createPost(input),
    deletePost: async (id) => (await load()).repository.deletePost(id),
    listComments: async (postId) => (await load()).repository.listComments(postId),
    addComment: async (postId, body) => (await load()).repository.addComment(postId, body),
    deleteComment: async (postId, id) => (await load()).repository.deleteComment(postId, id),
  };

  const auth: AuthService = {
    signIn: async (input) => (await load()).auth.signIn(input),
    signOut: async () => (await load()).auth.signOut(),
    onAuthChange(callback) {
      let unsubscribe: (() => void) | null = null;
      let cancelled = false;
      void load().then((b) => {
        if (!cancelled) unsubscribe = b.auth.onAuthChange(callback);
      });
      return () => {
        cancelled = true;
        unsubscribe?.();
      };
    },
  };
  return { repository, auth };
}

/** localStorage를 쓸 수 없는 브라우저(일부 사생활 보호 모드)에서는 임시 메모리에 저장 */
function browserStorage(): Storage {
  try {
    const s = window.localStorage;
    s.setItem('demo.check', '1');
    s.removeItem('demo.check');
    return s;
  } catch {
    const map = new Map<string, string>();
    return {
      get length() {
        return map.size;
      },
      clear: () => map.clear(),
      getItem: (k) => map.get(k) ?? null,
      key: (i) => [...map.keys()][i] ?? null,
      removeItem: (k) => void map.delete(k),
      setItem: (k, v) => void map.set(k, String(v)),
    };
  }
}

function createBackend(): Backend {
  if (isFirebaseConfigured) {
    // Firestore 보안 규칙이 "로그인 사용자만 읽기"이므로 화면도 같은 조건을 따릅니다.
    return { mode: 'firebase', readRequiresLogin: true, ...createLazyFirebaseBackend() };
  }
  return { mode: 'demo', readRequiresLogin: false, ...createMockBackend(browserStorage()) };
}

/** 앱 전체가 공유하는 저장소 묶음. 화면에서는 이 값을 Backend 인터페이스로만 사용합니다. */
export const backend: Backend = createBackend();
