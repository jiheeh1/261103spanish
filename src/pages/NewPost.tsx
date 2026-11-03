import { useState, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth, useRepository } from '../auth/AuthContext';
import { LoginPrompt } from '../components/LoginPrompt';
import { PageTitle } from '../components/PageTitle';
import { limits } from '../config/limits';
import { texts } from '../config/texts';
import { courses } from '../content/courses';
import { research } from '../content/research';
import { errorMessage } from '../lib/format';
import { courseKey, researchKey, resolveRelated } from '../lib/related';
import { postCategories, type PostCategory } from '../services/types';
import { validateBody, validateTitle } from '../services/validation';

const t = texts.newPost;

export function NewPost() {
  const { user, loading } = useAuth();
  const repo = useRepository();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  // "토론 시작" 버튼에서 넘어오면 카테고리·연결 자료가 미리 선택됨
  const initialCategory = postCategories.includes(params.get('category') as PostCategory)
    ? (params.get('category') as PostCategory)
    : 'free';
  const initialRelated = resolveRelated(params.get('related')) ? params.get('related')! : '';

  const [category, setCategory] = useState<PostCategory>(initialCategory);
  const [relatedKey, setRelatedKey] = useState(initialRelated);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [errors, setErrors] = useState<{ title?: string | null; body?: string | null; form?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  if (loading) return <p className="text-muted">{texts.common.loading}</p>;
  if (!user) {
    return (
      <>
        <PageTitle title={t.title} />
        <LoginPrompt />
      </>
    );
  }

  // 카테고리에 맞는 자료만 연결 후보로 보여 줌
  const relatedOptions =
    category === 'research'
      ? research.map((r) => ({ key: researchKey(r.id), title: r.title }))
      : category === 'course'
        ? courses.map((c) => ({ key: courseKey(c.id), title: c.title }))
        : [];

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (submitting) return; // 중복 제출 방지
    const next = { title: validateTitle(title), body: validateBody(body) };
    setErrors(next);
    if (next.title || next.body) return;
    setSubmitting(true);
    try {
      const keep = relatedOptions.some((o) => o.key === relatedKey) ? relatedKey : null;
      const post = await repo.createPost({ category, title, body, relatedKey: keep });
      navigate(`/discussion/${post.id}`, { replace: true });
    } catch (err) {
      setErrors({ form: errorMessage(err, texts.common.error) });
      setSubmitting(false);
    }
  }

  return (
    <>
      <PageTitle title={t.title} />
      <form onSubmit={onSubmit} noValidate className="card flex flex-col gap-5 md:p-8">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm">
            <span className="mb-1 block font-medium">{t.category}</span>
            <select
              className="input"
              value={category}
              onChange={(e) => setCategory(e.target.value as PostCategory)}
            >
              {postCategories.map((c) => (
                <option key={c} value={c}>{texts.discussion.categories[c]}</option>
              ))}
            </select>
          </label>
          {relatedOptions.length > 0 && (
            <label className="text-sm">
              <span className="mb-1 block font-medium">{t.related}</span>
              <select className="input" value={relatedKey} onChange={(e) => setRelatedKey(e.target.value)}>
                <option value="">{t.relatedNone}</option>
                {relatedOptions.map((o) => <option key={o.key} value={o.key}>{o.title}</option>)}
              </select>
            </label>
          )}
        </div>

        <div>
          <label htmlFor="post-title" className="mb-1 block text-sm font-medium">{t.postTitle}</label>
          <input
            id="post-title"
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            aria-invalid={!!errors.title}
            aria-describedby="title-help"
          />
          <p id="title-help" className="mt-1 text-sm">
            {errors.title ? (
              <span role="alert" className="text-red-700">{errors.title}</span>
            ) : (
              <span className="text-muted">{texts.validation.counter(title.trim().length, limits.titleMax)}</span>
            )}
          </p>
        </div>

        <div>
          <label htmlFor="post-body" className="mb-1 block text-sm font-medium">{t.body}</label>
          <textarea
            id="post-body"
            className="input min-h-60"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            aria-invalid={!!errors.body}
            aria-describedby="body-help"
          />
          <p id="body-help" className="mt-1 text-sm">
            {errors.body ? (
              <span role="alert" className="text-red-700">{errors.body}</span>
            ) : (
              <span className="text-muted">
                {texts.validation.counter(body.trim().length, limits.bodyMax)} · {t.bodyHint}
              </span>
            )}
          </p>
        </div>

        {errors.form && <p role="alert" className="rounded bg-red-50 p-3 text-sm text-red-800">{errors.form}</p>}

        <div className="flex justify-end gap-2">
          <button type="button" className="btn-outline" onClick={() => navigate(-1)} disabled={submitting}>
            {t.cancel}
          </button>
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? t.submitting : t.submit}
          </button>
        </div>
      </form>
    </>
  );
}
