import { useCallback, useEffect, useState } from 'react';
import { useAuth, useRepository } from '../auth/AuthContext';
import { limits } from '../config/limits';
import { texts } from '../config/texts';
import { errorMessage } from '../lib/format';
import type { Post, PostCategory, PostCursor } from '../services/types';
import { LoginPrompt } from './LoginPrompt';
import { PostCard } from './PostCard';

interface Props {
  category?: PostCategory;
  relatedKey?: string;
  pageSize?: number;
  /** false면 "더 보기" 없이 한 번만 불러옵니다 (홈 화면용) */
  allowMore?: boolean;
  emptyText?: string;
}

/** 토론 목록. 처음 pageSize개를 불러오고, "더 보기"를 누를 때마다 이어서 불러옵니다. */
export function PostList({ category, relatedKey, pageSize = limits.pageSize, allowMore = true, emptyText }: Props) {
  const repo = useRepository();
  const { user, loading: authLoading, readRequiresLogin } = useAuth();
  const blocked = readRequiresLogin && !user;

  const [posts, setPosts] = useState<Post[]>([]);
  const [cursor, setCursor] = useState<PostCursor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (from: PostCursor | null) => {
      setLoading(true);
      setError(null);
      try {
        const page = await repo.listPosts({ category, relatedKey, limit: pageSize, cursor: from });
        setPosts((prev) => (from ? [...prev, ...page.posts] : page.posts));
        setCursor(page.nextCursor);
      } catch (e) {
        setError(errorMessage(e, texts.common.error));
      } finally {
        setLoading(false);
      }
    },
    [repo, category, relatedKey, pageSize],
  );

  // 조건이 바뀌거나 로그인하면 처음부터 다시 불러옴 (실시간 구독 대신 한 번만 읽기)
  useEffect(() => {
    if (authLoading || blocked) return;
    void load(null);
  }, [load, authLoading, blocked, user?.uid]);

  if (blocked) return <LoginPrompt />;

  return (
    <div>
      {error && (
        <p role="alert" className="mb-4 rounded bg-red-50 p-3 text-sm text-red-800">
          {error}
        </p>
      )}
      {posts.length > 0 ? (
        <ul>{posts.map((p) => <PostCard key={p.id} post={p} />)}</ul>
      ) : (
        !loading && !error && <p className="py-4 text-muted">{emptyText ?? texts.common.empty}</p>
      )}
      {loading && <p className="py-4 text-muted" aria-live="polite">{texts.common.loading}</p>}
      {allowMore && cursor && !loading && (
        <div className="mt-4 text-center">
          <button type="button" className="btn-outline" onClick={() => void load(cursor)}>
            {texts.common.loadMore}
          </button>
        </div>
      )}
    </div>
  );
}
