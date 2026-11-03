// 앱 전체에서 쓰는 데이터 모양(타입) 정의.
// 데모 모드와 Firebase 모드가 모두 이 모양을 그대로 주고받으므로,
// Firebase를 연결해도 이 파일은 바뀌지 않습니다.

export type PostCategory = 'research' | 'course' | 'free';
export const postCategories: PostCategory[] = ['research', 'course', 'free'];

/** 로그인한 사용자 */
export interface User {
  uid: string;
  displayName: string;
  email: string | null;
  /** 이메일 인증 여부. Google 계정은 항상 true. 관리자 판별에 사용 */
  emailVerified: boolean;
}

/** 토론 글 */
export interface Post {
  id: string;
  category: PostCategory;
  title: string;
  body: string;
  /**
   * 연결된 연구·수업. 형식: "research/연구id" 또는 "course/수업id". 없으면 null.
   * (Firestore에서 한 필드로 검색하기 쉽도록 한 줄 문자열로 저장)
   */
  relatedKey: string | null;
  authorUid: string;
  authorName: string;
  /** 작성 시각 (1970년부터의 밀리초) */
  createdAt: number;
}

/** 댓글 */
export interface Comment {
  id: string;
  postId: string;
  body: string;
  authorUid: string;
  authorName: string;
  createdAt: number;
}

export interface NewPostInput {
  category: PostCategory;
  title: string;
  body: string;
  relatedKey: string | null;
}

export interface ListPostsOptions {
  category?: PostCategory;
  relatedKey?: string;
  /** 한 번에 가져올 개수 (기본 20) */
  limit?: number;
  /** "더 보기"를 위한 위치 표시. 이전 결과의 nextCursor를 그대로 넘깁니다. */
  cursor?: PostCursor | null;
}

/**
 * "더 보기" 위치 표시. 데모 모드와 Firebase 모드의 속 내용이 다르므로
 * 화면에서는 내용을 보지 말고 그대로 다시 넘기기만 합니다.
 */
export type PostCursor = object;

export interface PostPage {
  posts: Post[];
  /** 다음 페이지가 없으면 null */
  nextCursor: PostCursor | null;
}

/** 데모 로그인에서 입력받는 값 (Firebase 모드에서는 쓰지 않음) */
export interface DemoSignInInput {
  displayName: string;
  email?: string;
}
