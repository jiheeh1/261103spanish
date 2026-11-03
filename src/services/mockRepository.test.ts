import { beforeEach, describe, expect, it } from 'vitest';
import { site } from '../config/site';
import { createMockBackend, type MockBackend } from './mockRepository';

/** 테스트마다 비어 있는 가짜 저장 공간 */
function memoryStorage(): Storage {
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

describe('mockRepository (데모 저장소)', () => {
  let storage: Storage;
  let backend: MockBackend;
  let clock: number;

  beforeEach(() => {
    storage = memoryStorage();
    clock = 1_800_000_000_000;
    backend = createMockBackend(storage, () => ++clock);
  });

  it('첫 실행 시 샘플 글 3개를 심는다', async () => {
    const page = await backend.repository.listPosts();
    expect(page.posts).toHaveLength(3);
    expect(await backend.repository.listComments('sample-1')).not.toHaveLength(0);
  });

  it('로그인하지 않으면 글을 쓸 수 없다', async () => {
    await expect(
      backend.repository.createPost({ category: 'free', title: '제목', body: '본문', relatedKey: null }),
    ).rejects.toThrow();
  });

  it('글을 쓰면 목록 맨 위에 나오고, 새로 만든 저장소에서도 유지된다', async () => {
    await backend.auth.signIn({ displayName: '학생' });
    const post = await backend.repository.createPost({
      category: 'free',
      title: '  ¿Qué tal? 안녕하세요  ',
      body: 'Señor, ¡hola!',
      relatedKey: null,
    });
    expect(post.title).toBe('¿Qué tal? 안녕하세요');
    expect(post.authorName).toBe('학생');

    const again = createMockBackend(storage); // 새로고침 흉내
    const page = await again.repository.listPosts();
    expect(page.posts[0].id).toBe(post.id);
    expect(page.posts).toHaveLength(4);
  });

  it('빈 제목·너무 긴 본문은 거부한다', async () => {
    await backend.auth.signIn({ displayName: '학생' });
    await expect(
      backend.repository.createPost({ category: 'free', title: '   ', body: '본문', relatedKey: null }),
    ).rejects.toThrow('제목');
    await expect(
      backend.repository.createPost({ category: 'free', title: '제목', body: 'a'.repeat(5001), relatedKey: null }),
    ).rejects.toThrow('본문');
  });

  it('카테고리·연결 자료로 거르고, 20개씩 "더 보기"로 이어서 불러온다', async () => {
    await backend.auth.signIn({ displayName: '학생' });
    for (let i = 0; i < 25; i++) {
      await backend.repository.createPost({ category: 'course', title: `글 ${i}`, body: '본문', relatedKey: 'course/x' });
    }
    const first = await backend.repository.listPosts({ category: 'course' });
    expect(first.posts).toHaveLength(20);
    expect(first.posts[0].title).toBe('글 24');
    expect(first.nextCursor).not.toBeNull();

    const second = await backend.repository.listPosts({ category: 'course', cursor: first.nextCursor });
    // 샘플 course 글 1개 + 남은 5개
    expect(second.posts).toHaveLength(6);
    expect(second.nextCursor).toBeNull();
    const ids = new Set([...first.posts, ...second.posts].map((p) => p.id));
    expect(ids.size).toBe(26); // 겹치지 않음

    const related = await backend.repository.listPosts({ relatedKey: 'course/x', limit: 100 });
    expect(related.posts).toHaveLength(25);
  });

  it('댓글을 추가하면 오래된 순으로 나온다', async () => {
    await backend.auth.signIn({ displayName: '학생' });
    const post = await backend.repository.createPost({ category: 'free', title: '제목', body: '본문', relatedKey: null });
    await backend.repository.addComment(post.id, '첫 댓글');
    await backend.repository.addComment(post.id, '두 번째');
    const list = await backend.repository.listComments(post.id);
    expect(list.map((c) => c.body)).toEqual(['첫 댓글', '두 번째']);
    await expect(backend.repository.addComment(post.id, '')).rejects.toThrow();
    await expect(backend.repository.addComment(post.id, 'a'.repeat(1001))).rejects.toThrow();
  });

  it('작성자 본인만 글을 지울 수 있고, 글을 지우면 댓글도 지워진다', async () => {
    await backend.auth.signIn({ displayName: '작성자' });
    const post = await backend.repository.createPost({ category: 'free', title: '제목', body: '본문', relatedKey: null });
    await backend.repository.addComment(post.id, '댓글');

    await backend.auth.signIn({ displayName: '다른 사람' });
    await expect(backend.repository.deletePost(post.id)).rejects.toThrow('권한');

    await backend.auth.signIn({ displayName: '작성자' });
    await backend.repository.deletePost(post.id);
    expect(await backend.repository.getPost(post.id)).toBeNull();
    expect(await backend.repository.listComments(post.id)).toHaveLength(0);
  });

  it('관리자는 남의 글과 댓글을 지울 수 있다', async () => {
    await backend.auth.signIn({ displayName: '관리자', email: site.adminEmail });
    await backend.repository.deleteComment('sample-1', 'sample-c1');
    expect(await backend.repository.listComments('sample-1')).toHaveLength(0);
    await backend.repository.deletePost('sample-2');
    expect(await backend.repository.getPost('sample-2')).toBeNull();
  });

  it('로그아웃하면 사용자 정보가 사라진다', async () => {
    const seen: (string | null)[] = [];
    backend.auth.onAuthChange((u) => seen.push(u?.displayName ?? null));
    await backend.auth.signIn({ displayName: '학생' });
    await backend.auth.signOut();
    expect(seen).toEqual([null, '학생', null]);
  });
});
