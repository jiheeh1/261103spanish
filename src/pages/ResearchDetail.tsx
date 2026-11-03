import ReactMarkdown from 'react-markdown';
import { Link, useParams } from 'react-router-dom';
import { ExternalLinks } from '../components/ExternalLinks';
import { PageTitle } from '../components/PageTitle';
import { PostList } from '../components/PostList';
import { texts } from '../config/texts';
import { findResearch } from '../content/research';
import { researchKey } from '../lib/related';
import { NotFound } from './NotFound';

const t = texts.research;

export function ResearchDetail() {
  const { id = '' } = useParams();
  const item = findResearch(id);
  if (!item) return <NotFound message={t.notFound} />;
  const key = researchKey(item.id);

  return (
    <article className="mx-auto max-w-3xl">
      <Link to="/research" className="text-sm text-accent hover:underline">← {texts.common.back}</Link>
      <p className="mt-4 text-sm text-muted">{item.field} · {item.year}</p>
      <PageTitle title={item.title} />

      <section aria-labelledby="summary" className="mb-10 rounded-xl border-l-4 border-accent bg-accent-soft p-6">
        <h2 id="summary" className="eyebrow mb-2">{t.summary}</h2>
        <p className="font-serif text-lg leading-8">{item.summary}</p>
      </section>

      {/* skipHtml: 마크다운 안의 HTML 태그는 표시하지 않음 (안전을 위해) */}
      <div className="prose-body">
        <ReactMarkdown skipHtml>{item.body}</ReactMarkdown>
      </div>

      {item.links.length > 0 && (
        <section aria-labelledby="links" className="mt-10">
          <h2 id="links" className="mb-3 font-serif text-xl font-semibold">{t.links}</h2>
          <ExternalLinks links={item.links} />
        </section>
      )}

      <section aria-labelledby="related" className="mt-12 border-t border-line pt-8">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 id="related" className="font-serif text-xl font-semibold">{t.relatedDiscussion}</h2>
          <Link to={`/discussion/new?category=research&related=${encodeURIComponent(key)}`} className="btn-primary">
            {t.startDiscussion}
          </Link>
        </div>
        <PostList relatedKey={key} />
      </section>
    </article>
  );
}
