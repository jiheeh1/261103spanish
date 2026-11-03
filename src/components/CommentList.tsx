import { useEffect, useState, type FormEvent } from 'react';
import { useAuth, useRepository } from '../auth/AuthContext';
import { limits } from '../config/limits';
import { texts } from '../config/texts';
import { errorMessage, formatDateTime } from '../lib/format';
import { validateComment } from '../services/validation';
import type { Comment } from '../services/types';
import { LoginPrompt } from './LoginPrompt';

export function CommentList({ postId }: { postId: string }) {
  const repo = useRepository();
  const { user, canDelete } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [body, setBody] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    repo
      .listComments(postId)
      .then((list) => !cancelled && setComments(list))
      .catch((e) => !cancelled && setLoadError(errorMessage(e, texts.common.error)))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [repo, postId]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (submitting) return; // 중복 제출 방지
    const err = validateComment(body);
    setFormError(err);
    if (err) return;
    setSubmitting(true);
    try {
      const c = await repo.addComment(postId, body);
      // 다시 읽어 오지 않고 화면에 바로 붙여서 읽기 횟수를 아낌
      setComments((prev) => [...prev, c]);
      setBody('');
    } catch (e) {
      setFormError(errorMessage(e, texts.common.error));
    } finally {
      setSubmitting(false);
    }
  }

  async function onDelete(c: Comment) {
    if (!window.confirm(texts.common.confirmDeleteComment)) return;
    setDeletingId(c.id);
    try {
      await repo.deleteComment(postId, c.id);
      setComments((prev) => prev.filter((x) => x.id !== c.id));
    } catch (e) {
      window.alert(errorMessage(e, texts.common.error));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section aria-labelledby="comments-heading" className="mt-10">
      <h2 id="comments-heading" className="mb-4 font-serif text-xl font-semibold">
        {texts.discussion.comments} <span className="text-muted">({comments.length})</span>
      </h2>
      {loadError && <p role="alert" className="text-red-800">{loadError}</p>}
      {loading ? (
        <p className="text-muted">{texts.common.loading}</p>
      ) : comments.length === 0 ? (
        <p className="text-muted">{texts.discussion.noComments}</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {comments.map((c) => (
            <li key={c.id} className="card p-4">
              <div className="mb-1 flex items-center justify-between gap-2 text-sm text-muted">
                <span>
                  <span className="font-medium text-ink">{c.authorName}</span> · {formatDateTime(c.createdAt)}
                </span>
                {canDelete(c.authorUid) && (
                  <button
                    type="button"
                    className="btn-danger"
                    disabled={deletingId === c.id}
                    onClick={() => void onDelete(c)}
                  >
                    {deletingId === c.id ? texts.common.deleting : texts.common.delete}
                  </button>
                )}
              </div>
              {/* 줄바꿈은 살리고, 내용은 글자로만 표시 */}
              <p className="whitespace-pre-wrap">{c.body}</p>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6">
        {user ? (
          <form onSubmit={onSubmit} noValidate>
            <label htmlFor="comment-body" className="sr-only">
              {texts.discussion.commentPlaceholder}
            </label>
            <textarea
              id="comment-body"
              className="input min-h-24"
              placeholder={texts.discussion.commentPlaceholder}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              aria-invalid={!!formError}
              aria-describedby="comment-help"
            />
            <div className="mt-2 flex items-center justify-between gap-2">
              <p id="comment-help" className="text-sm">
                {formError ? (
                  <span role="alert" className="text-red-700">{formError}</span>
                ) : (
                  <span className="text-muted">{texts.validation.counter(body.trim().length, limits.commentMax)}</span>
                )}
              </p>
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? texts.newPost.submitting : texts.discussion.addComment}
              </button>
            </div>
          </form>
        ) : (
          <LoginPrompt message={texts.discussion.loginToComment} />
        )}
      </div>
    </section>
  );
}
