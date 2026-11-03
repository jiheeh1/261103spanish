import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth, useRepository } from '../auth/AuthContext';
import { CommentList } from '../components/CommentList';
import { LoginPrompt } from '../components/LoginPrompt';
import { PageTitle } from '../components/PageTitle';
import { texts } from '../config/texts';
import { errorMessage, formatDateTime } from '../lib/format';
import { resolveRelated } from '../lib/related';
import type { Post } from '../services/types';
import { NotFound } from './NotFound';

const t = texts.discussion;

export function PostDetail() {
  const { postId = '' } = useParams();
  const repo = useRepository();
  const navigate = useNavigate();
  const { user, loading: authLoading, readRequiresLogin, canDelete } = useAuth();
  const blocked = readRequiresLogin && !user;

  const [post, setPost] = useState<Post | null | undefined>(undefined); // undefined = 불러오는 중
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (authLoading || blocked) return;
    let cancelled = false;
    setPost(undefined);
    repo
      .getPost(postId)
      .then((p) => !cancelled && setPost(p))
      .catch((e) => {
        if (cancelled) return;
        setError(errorMessage(e, texts.common.error));
        setPost(null);
      });
    return () => {
      cancelled = true;
    };
  }, [repo, postId, authLoading, blocked]);

  if (blocked) return <LoginPrompt />;
  if (error) return <p role="alert" className="text-red-800">{error}</p>;
  if (post === undefined) return <p className="text-muted">{texts.common.loading}</p>;
  if (post === null) return <NotFound message={t.notFound} />;

  const related = resolveRelated(post.relatedKey);

  async function onDelete() {
    if (!post || !window.confirm(texts.common.confirmDeletePost)) return;
    setDeleting(true);
    try {
      await repo.deletePost(post.id);
      navigate('/discussion', { replace: true });
    } catch (e) {
      window.alert(errorMessage(e, texts.common.error));
      setDeleting(false);
    }
  }

  return (
    <article>
      <Link to="/discussion" className="text-sm text-accent hover:underline">← {texts.common.back}</Link>
      <p className="mt-4">
        <span className="rounded bg-accent-soft px-2 py-0.5 text-sm text-accent">{t.categories[post.category]}</span>
      </p>
      <PageTitle title={post.title}>
        {canDelete(post.authorUid) && (
          <button type="button" className="btn-danger self-start" onClick={() => void onDelete()} disabled={deleting}>
            {deleting ? texts.common.deleting : texts.common.delete}
          </button>
        )}
      </PageTitle>
      <p className="-mt-4 mb-6 text-sm text-muted">
        {post.authorName} · {formatDateTime(post.createdAt)}
      </p>
      {related && (
        <p className="mb-6 text-sm">
          <span className="text-muted">{t.related}: </span>
          <Link to={related.href} className="text-accent underline underline-offset-2">{related.title}</Link>
        </p>
      )}
      {/* 사용자가 쓴 본문은 HTML로 해석하지 않고 글자 그대로 보여 줌 */}
      <div className="card whitespace-pre-wrap font-serif leading-8 md:p-8">{post.body}</div>
      <CommentList postId={post.id} />
    </article>
  );
}
