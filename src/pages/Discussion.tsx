import { Link, useSearchParams } from 'react-router-dom';
import { PageTitle } from '../components/PageTitle';
import { PostList } from '../components/PostList';
import { texts } from '../config/texts';
import { postCategories, type PostCategory } from '../services/types';

const t = texts.discussion;

export function Discussion() {
  // 선택한 카테고리를 주소(?category=free)에 남겨 새로고침해도 유지
  const [params, setParams] = useSearchParams();
  const raw = params.get('category');
  const category = postCategories.includes(raw as PostCategory) ? (raw as PostCategory) : undefined;
  const filters: { value?: PostCategory; label: string }[] = [
    { label: t.all },
    ...postCategories.map((c) => ({ value: c, label: t.categories[c] })),
  ];

  return (
    <>
      <PageTitle title={t.title} description={t.description}>
        <Link to={`/discussion/new${category ? `?category=${category}` : ''}`} className="btn-primary self-start">
          {t.write}
        </Link>
      </PageTitle>
      <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="카테고리">
        {filters.map((f) => {
          const active = f.value === category;
          return (
            <button
              key={f.label}
              type="button"
              aria-pressed={active}
              className={`rounded-full border px-4 py-1 text-sm ${active ? 'border-accent bg-accent text-white' : 'border-line bg-white hover:border-accent'}`}
              onClick={() => setParams(f.value ? { category: f.value } : {}, { replace: true })}
            >
              {f.label}
            </button>
          );
        })}
      </div>
      <div className="card px-5 py-1 md:px-8">
        {/* key를 바꿔 카테고리가 바뀌면 목록을 새로 시작 */}
        <PostList key={category ?? 'all'} category={category} />
      </div>
    </>
  );
}
