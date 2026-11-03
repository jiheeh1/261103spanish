// 실제 Firebase(Firestore 데이터베이스 + Google 로그인) 저장소.
// ⚠️ 아직 Firebase 프로젝트가 없어 실제 동작은 검증하지 못했습니다. (README "Firebase 연동" 참고)
//
// 무료(Spark) 요금제의 읽기 횟수를 아끼기 위한 원칙:
//  - 실시간 구독(onSnapshot)을 쓰지 않고, 필요할 때 한 번만 읽습니다(getDocs/getDoc).
//  - 목록은 항상 limit(최대 20개)를 걸고, "더 보기"는 커서(startAfter)로 이어서 읽습니다.
//
// 데이터 구조
//  posts/{postId}                      글
//  posts/{postId}/comments/{commentId} 댓글 (글 아래 하위 컬렉션 → 별도 색인 없이 시간순 조회 가능)
import type { FirebaseApp } from 'firebase/app';
import {
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut as fbSignOut,
  type User as FirebaseUser,
} from 'firebase/auth';
import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit as qLimit,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
  where,
  writeBatch,
  type DocumentData,
  type QueryConstraint,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';
import { limits } from '../config/limits';
import { isAdminEmail } from '../config/site';
import type { AuthService, Repository } from './repository';
import type { Comment, Post, PostCategory, User } from './types';
import { assertValid, validateBody, validateComment, validateTitle } from './validation';

/** 댓글은 한 글에 최대 이만큼만 읽습니다 (읽기 횟수 보호) */
const MAX_COMMENTS = 200;

function toMillis(value: unknown): number {
  // serverTimestamp()로 막 저장한 직후에는 값이 비어 있을 수 있어 현재 시각으로 대체
  return value instanceof Timestamp ? value.toMillis() : Date.now();
}

function toUser(u: FirebaseUser): User {
  return {
    uid: u.uid,
    displayName: u.displayName || u.email || '이름 없음',
    email: u.email,
    emailVerified: u.emailVerified,
  };
}

function toPost(id: string, d: DocumentData): Post {
  return {
    id,
    category: d.category as PostCategory,
    title: String(d.title ?? ''),
    body: String(d.body ?? ''),
    relatedKey: typeof d.relatedKey === 'string' ? d.relatedKey : null,
    authorUid: String(d.authorUid ?? ''),
    authorName: String(d.authorName ?? ''),
    createdAt: toMillis(d.createdAt),
  };
}

function toComment(postId: string, id: string, d: DocumentData): Comment {
  return {
    id,
    postId,
    body: String(d.body ?? ''),
    authorUid: String(d.authorUid ?? ''),
    authorName: String(d.authorName ?? ''),
    createdAt: toMillis(d.createdAt),
  };
}

export function createFirebaseBackend(app: FirebaseApp): { repository: Repository; auth: AuthService } {
  const db = getFirestore(app);
  const fbAuth = getAuth(app);

  function requireUser(): FirebaseUser {
    const u = fbAuth.currentUser;
    if (!u) throw new Error('로그인이 필요합니다.');
    return u;
  }

  const auth: AuthService = {
    async signIn() {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(fbAuth, provider);
      return toUser(result.user);
    },
    async signOut() {
      await fbSignOut(fbAuth);
    },
    onAuthChange(callback) {
      return onAuthStateChanged(fbAuth, (u) => callback(u ? toUser(u) : null));
    },
  };

  const repository: Repository = {
    async listPosts(options = {}) {
      const pageSize = options.limit ?? limits.pageSize;
      const constraints: QueryConstraint[] = [];
      // category 또는 relatedKey 조건 + 시간순 정렬은 Firestore "복합 색인"이 필요합니다.
      // 처음 실행 시 브라우저 콘솔에 색인 생성 링크가 뜹니다 (README 참고).
      if (options.category) constraints.push(where('category', '==', options.category));
      if (options.relatedKey) constraints.push(where('relatedKey', '==', options.relatedKey));
      constraints.push(orderBy('createdAt', 'desc'));
      if (options.cursor) constraints.push(startAfter(options.cursor as QueryDocumentSnapshot));
      // 하나 더 읽어서 "다음 페이지가 있는지"를 판단 (빈 "더 보기" 클릭 방지)
      constraints.push(qLimit(pageSize + 1));

      const snap = await getDocs(query(collection(db, 'posts'), ...constraints));
      const docs = snap.docs.slice(0, pageSize);
      return {
        posts: docs.map((d) => toPost(d.id, d.data())),
        nextCursor: snap.docs.length > pageSize ? docs[docs.length - 1] : null,
      };
    },

    async getPost(id) {
      const snap = await getDoc(doc(db, 'posts', id));
      return snap.exists() ? toPost(snap.id, snap.data()) : null;
    },

    async createPost(input) {
      const u = requireUser();
      assertValid(validateTitle(input.title), validateBody(input.body));
      const data = {
        category: input.category,
        title: input.title.trim(),
        body: input.body.trim(),
        relatedKey: input.relatedKey,
        authorUid: u.uid, // 보안 규칙이 "본인 uid인지" 다시 확인합니다
        authorName: toUser(u).displayName.slice(0, limits.authorNameMax * 3),
        createdAt: serverTimestamp(),
      };
      const ref = await addDoc(collection(db, 'posts'), data);
      return { ...data, id: ref.id, createdAt: Date.now() };
    },

    async deletePost(id) {
      const u = requireUser();
      // 관리자가 지울 때는 그 글의 댓글까지 함께 정리합니다.
      // (작성자 본인은 남의 댓글을 지울 권한이 없으므로 글만 지웁니다.
      //  남은 댓글은 글이 없어 화면 어디에도 보이지 않습니다.)
      if (u.emailVerified && isAdminEmail(u.email)) {
        const cs = await getDocs(query(collection(db, 'posts', id, 'comments'), qLimit(MAX_COMMENTS)));
        const batch = writeBatch(db);
        cs.docs.forEach((c) => batch.delete(c.ref));
        batch.delete(doc(db, 'posts', id));
        await batch.commit();
        return;
      }
      await deleteDoc(doc(db, 'posts', id));
    },

    async listComments(postId) {
      const snap = await getDocs(
        query(collection(db, 'posts', postId, 'comments'), orderBy('createdAt', 'asc'), qLimit(MAX_COMMENTS)),
      );
      return snap.docs.map((d) => toComment(postId, d.id, d.data()));
    },

    async addComment(postId, body) {
      const u = requireUser();
      assertValid(validateComment(body));
      const data = {
        body: body.trim(),
        authorUid: u.uid,
        authorName: toUser(u).displayName.slice(0, limits.authorNameMax * 3),
        createdAt: serverTimestamp(),
      };
      const ref = await addDoc(collection(db, 'posts', postId, 'comments'), data);
      return { ...data, id: ref.id, postId, createdAt: Date.now() };
    },

    async deleteComment(postId, commentId) {
      requireUser();
      await deleteDoc(doc(db, 'posts', postId, 'comments', commentId));
    },
  };

  return { repository, auth };
}
