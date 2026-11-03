// 화면(컴포넌트)이 데이터를 다룰 때 쓰는 "약속(인터페이스)".
// 화면은 이 약속만 알고, 실제로 localStorage(데모)에 저장되는지 Firestore에 저장되는지는 모릅니다.
// → Firebase를 연결해도 화면 코드는 고칠 필요가 없습니다.
import type {
  Comment,
  DemoSignInInput,
  ListPostsOptions,
  NewPostInput,
  Post,
  PostPage,
  User,
} from './types';

/** 토론 글·댓글 저장소 */
export interface Repository {
  listPosts(options?: ListPostsOptions): Promise<PostPage>;
  /** 없으면 null */
  getPost(id: string): Promise<Post | null>;
  /** 로그인한 사용자 이름으로 글을 만듭니다. 로그인하지 않았으면 오류. */
  createPost(input: NewPostInput): Promise<Post>;
  deletePost(id: string): Promise<void>;
  listComments(postId: string): Promise<Comment[]>;
  addComment(postId: string, body: string): Promise<Comment>;
  deleteComment(postId: string, commentId: string): Promise<void>;
}

/** 로그인 관련 */
export interface AuthService {
  /**
   * 데모 모드: input(이름)으로 가짜 사용자 로그인.
   * Firebase 모드: input은 무시하고 Google 로그인 팝업을 띄웁니다.
   */
  signIn(input?: DemoSignInInput): Promise<User>;
  signOut(): Promise<void>;
  /** 로그인 상태가 바뀔 때마다 호출됩니다. 반환값을 호출하면 구독 해제. */
  onAuthChange(callback: (user: User | null) => void): () => void;
}

export type BackendMode = 'demo' | 'firebase';

/** 앱이 실제로 사용하는 묶음 */
export interface Backend {
  mode: BackendMode;
  repository: Repository;
  auth: AuthService;
  /** true면 로그인하지 않은 사람은 토론을 읽을 수 없음 (Firebase 보안 규칙과 일치) */
  readRequiresLogin: boolean;
}
