// 데모 모드 저장소: 브라우저의 localStorage(이 브라우저 안의 작은 저장 공간)에 글·댓글을 저장합니다.
// Firebase가 연결되면 이 파일은 사용되지 않습니다 (firebase.ts가 자동으로 고름).
// 다른 사람과 데이터가 공유되지 않고, 브라우저 데이터를 지우면 함께 사라집니다.
import { isAdminEmail } from '../config/site';
import { limits } from '../config/limits';
import type { AuthService, Repository } from './repository';
import type { Comment, DemoSignInInput, Post, PostCursor, User } from './types';
import { assertValid, validateBody, validateComment, validateName, validateTitle } from './validation';

const KEYS = {
  posts: 'demo.posts',
  comments: 'demo.comments',
  user: 'demo.user',
  seeded: 'demo.seeded',
} as const;

/** 데모 모드의 "더 보기" 위치: 마지막으로 보여 준 글의 시각과 id */
interface MockCursor {
  createdAt: number;
  id: string;
}

function newId(): string {
  // 오래된 브라우저 대비: randomUUID가 없으면 시간+난수로 대체
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/** 최신순 정렬 (시각이 같으면 id로 고정해 순서가 흔들리지 않게) */
function newestFirst(a: { createdAt: number; id: string }, b: { createdAt: number; id: string }) {
  return b.createdAt - a.createdAt || (a.id < b.id ? 1 : a.id > b.id ? -1 : 0);
}

function seedData(now: number): { posts: Post[]; comments: Comment[] } {
  const hour = 60 * 60 * 1000;
  const posts: Post[] = [
    {
      id: 'sample-1',
      category: 'research',
      title: '(샘플) 마술적 사실주의를 어떻게 정의할 수 있을까요?',
      body: '연구 페이지의 마술적 사실주의 자료를 읽고 궁금한 점이 생겼습니다.\n환상적 요소가 "일상처럼" 서술된다는 점이 핵심인지, 아니면 역사·정치적 맥락이 더 중요한지 의견이 궁금합니다.',
      relatedKey: 'research/magical-realism',
      authorUid: 'demo-student-1',
      authorName: '샘플 학생 A',
      createdAt: now - 50 * hour,
    },
    {
      id: 'sample-2',
      category: 'course',
      title: '(샘플) 3주차 읽기 자료 질문입니다',
      body: '¿Por qué el autor usa el subjuntivo en esta frase?\n접속법이 쓰인 이유가 화자의 감정 때문인지 궁금합니다.',
      relatedKey: 'course/spanish-reading',
      authorUid: 'demo-student-2',
      authorName: '샘플 학생 B',
      createdAt: now - 26 * hour,
    },
    {
      id: 'sample-3',
      category: 'free',
      title: '(샘플) 방학 중 스페인어 공부 방법 공유해요',
      body: '스페인어 팟캐스트나 중남미 영화 추천을 나눠 봐요. ¡Bienvenidos!',
      relatedKey: null,
      authorUid: 'demo-student-3',
      authorName: '샘플 학생 C',
      createdAt: now - 3 * hour,
    },
  ];
  const comments: Comment[] = [
    {
      id: 'sample-c1',
      postId: 'sample-1',
      body: '저는 역사적 맥락이 더 중요하다고 생각해요. 다음 수업에서 같이 이야기해 봐요.',
      authorUid: 'demo-student-2',
      authorName: '샘플 학생 B',
      createdAt: now - 48 * hour,
    },
    {
      id: 'sample-c2',
      postId: 'sample-2',
      body: '주절의 동사가 감정을 나타내면 종속절에 접속법을 씁니다. 교재 해당 단원을 다시 보세요.',
      authorUid: 'demo-student-1',
      authorName: '샘플 학생 A',
      createdAt: now - 20 * hour,
    },
    {
      id: 'sample-c3',
      postId: 'sample-3',
      body: '중남미 영화 몇 편을 자막 없이 보는 것부터 시작해 보는 중입니다!',
      authorUid: 'demo-student-1',
      authorName: '샘플 학생 A',
      createdAt: now - 2 * hour,
    },
  ];
  return { posts, comments };
}

export interface MockBackend {
  repository: Repository;
  auth: AuthService;
}

/**
 * 데모 저장소를 만듭니다.
 * @param storage 보통은 window.localStorage. 테스트에서는 빈 저장소를 넘깁니다.
 */
export function createMockBackend(storage: Storage, now: () => number = Date.now): MockBackend {
  // ---- 저장 공간 읽기/쓰기 ----
  function read<T>(key: string, fallback: T): T {
    try {
      const raw = storage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      // 저장된 값이 깨졌거나 저장소를 쓸 수 없는 경우(사생활 보호 모드 등) 빈 값으로 시작
      return fallback;
    }
  }
  function write(key: string, value: unknown): void {
    storage.setItem(key, JSON.stringify(value));
  }

  // 첫 실행 때만 샘플 글·댓글을 심습니다. (사용자가 샘플을 지워도 다시 생기지 않도록 표시를 남김)
  if (!storage.getItem(KEYS.seeded)) {
    const seed = seedData(now());
    write(KEYS.posts, seed.posts);
    write(KEYS.comments, seed.comments);
    storage.setItem(KEYS.seeded, '1');
  }

  const posts = () => read<Post[]>(KEYS.posts, []);
  const comments = () => read<Comment[]>(KEYS.comments, []);

  // ---- 로그인 ----
  const listeners = new Set<(user: User | null) => void>();
  const currentUser = () => read<User | null>(KEYS.user, null);
  const notify = () => listeners.forEach((cb) => cb(currentUser()));

  function requireUser(): User {
    const user = currentUser();
    if (!user) throw new Error('로그인이 필요합니다.');
    return user;
  }
  function canDelete(user: User, authorUid: string): boolean {
    return user.uid === authorUid || (user.emailVerified && isAdminEmail(user.email));
  }

  const auth: AuthService = {
    async signIn(input?: DemoSignInInput) {
      const name = input?.displayName ?? '';
      assertValid(validateName(name));
      const email = input?.email?.trim() || null;
      // 같은 이름+이메일이면 같은 사용자로 취급해서, 다시 로그인해도 내 글을 삭제할 수 있게 함
      const uid = `demo-${encodeURIComponent(`${name.trim()}|${email ?? ''}`)}`;
      // 데모에서는 입력한 이메일을 "인증된 것"으로 간주 (관리자 체험용)
      const user: User = { uid, displayName: name.trim(), email, emailVerified: true };
      write(KEYS.user, user);
      notify();
      return user;
    },
    async signOut() {
      storage.removeItem(KEYS.user);
      notify();
    },
    onAuthChange(callback) {
      listeners.add(callback);
      callback(currentUser());
      return () => listeners.delete(callback);
    },
  };

  // ---- 글·댓글 ----
  const repository: Repository = {
    async listPosts(options = {}) {
      const pageSize = options.limit ?? limits.pageSize;
      let list = posts().sort(newestFirst);
      if (options.category) list = list.filter((p) => p.category === options.category);
      if (options.relatedKey) list = list.filter((p) => p.relatedKey === options.relatedKey);
      const cursor = options.cursor as MockCursor | null | undefined;
      if (cursor) list = list.filter((p) => newestFirst(p, cursor) > 0);
      const page = list.slice(0, pageSize);
      const last = page[page.length - 1];
      const nextCursor: PostCursor | null =
        list.length > pageSize && last ? ({ createdAt: last.createdAt, id: last.id } satisfies MockCursor) : null;
      return { posts: page, nextCursor };
    },

    async getPost(id) {
      return posts().find((p) => p.id === id) ?? null;
    },

    async createPost(input) {
      const user = requireUser();
      assertValid(validateTitle(input.title), validateBody(input.body));
      const post: Post = {
        id: newId(),
        category: input.category,
        title: input.title.trim(),
        body: input.body.trim(),
        relatedKey: input.relatedKey,
        authorUid: user.uid,
        authorName: user.displayName,
        createdAt: now(),
      };
      write(KEYS.posts, [...posts(), post]);
      return post;
    },

    async deletePost(id) {
      const user = requireUser();
      const post = posts().find((p) => p.id === id);
      if (!post) return;
      if (!canDelete(user, post.authorUid)) throw new Error('삭제 권한이 없습니다.');
      write(KEYS.posts, posts().filter((p) => p.id !== id));
      // 글이 지워지면 그 글의 댓글도 함께 지웁니다
      write(KEYS.comments, comments().filter((c) => c.postId !== id));
    },

    async listComments(postId) {
      // 댓글은 오래된 순(대화 흐름대로)
      return comments()
        .filter((c) => c.postId === postId)
        .sort((a, b) => a.createdAt - b.createdAt);
    },

    async addComment(postId, body) {
      const user = requireUser();
      assertValid(validateComment(body));
      if (!posts().some((p) => p.id === postId)) throw new Error('글을 찾을 수 없습니다.');
      const comment: Comment = {
        id: newId(),
        postId,
        body: body.trim(),
        authorUid: user.uid,
        authorName: user.displayName,
        createdAt: now(),
      };
      write(KEYS.comments, [...comments(), comment]);
      return comment;
    },

    async deleteComment(postId, commentId) {
      const user = requireUser();
      const target = comments().find((c) => c.id === commentId && c.postId === postId);
      if (!target) return;
      if (!canDelete(user, target.authorUid)) throw new Error('삭제 권한이 없습니다.');
      write(KEYS.comments, comments().filter((c) => c.id !== commentId));
    },
  };

  return { repository, auth };
}
