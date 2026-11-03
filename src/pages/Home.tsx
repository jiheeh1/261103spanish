import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PostList } from '../components/PostList';
import { limits } from '../config/limits';
import { site } from '../config/site';
import { texts } from '../config/texts';
import { courses } from '../content/courses';
import { research } from '../content/research';

const t = texts.home;

export function Home() {
  useEffect(() => {
    document.title = site.siteName;
  }, []);
  // 최신 연도 순으로 3건
  const recent = [...research].sort((a, b) => b.year - a.year).slice(0, limits.homeRecentResearch);
  const tiles = [
    { to: '/research', ...t.tiles.research, count: `${research.length}${t.tiles.research.unit}`, glyph: '¿' },
    { to: '/courses', ...t.tiles.courses, count: `${courses.length}${t.tiles.courses.unit}`, glyph: 'á' },
    { to: '/discussion', ...t.tiles.discussion, count: '', glyph: '¡' },
  ];

  return (
    <>
      <section className="hero mb-10">
        <span className="hero-glyph" aria-hidden="true">ñ</span>
        <div className="relative max-w-2xl">
          <p className="eyebrow mb-4">{t.eyebrow}</p>
          <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight md:text-6xl">{site.siteName}</h1>
          <p className="mt-6 text-lg font-semibold">
            {site.professorName} <span className="font-normal text-muted">· {site.department}</span>
          </p>
          <p className="mt-3 font-serif text-lg leading-8 text-muted">{site.intro}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/research" className="btn-primary px-6 py-3 text-base">{t.ctaResearch}</Link>
            <Link to="/discussion" className="btn-outline px-6 py-3 text-base">{t.ctaDiscussion}</Link>
          </div>
        </div>
      </section>

      <ul className="mb-16 grid gap-4 md:grid-cols-3">
        {tiles.map((tile) => (
          <li key={tile.to}>
            <Link to={tile.to} className="card lift group relative block h-full overflow-hidden">
              <span aria-hidden="true" className="absolute -right-2 -top-4 font-serif text-8xl font-bold text-accent/10">{tile.glyph}</span>
              <span className="relative block font-serif text-xl font-bold group-hover:text-accent">{tile.title}</span>
              <span className="relative mt-1 block text-sm text-muted">{tile.desc}</span>
              {tile.count && <span className="relative mt-4 block text-sm font-semibold text-accent">{tile.count}</span>}
            </Link>
          </li>
        ))}
      </ul>

      <div className="grid gap-12 md:grid-cols-2">
        <section aria-labelledby="recent-research">
          <div className="mb-4 flex items-end justify-between border-b-2 border-ink pb-2">
            <h2 id="recent-research" className="font-serif text-2xl font-bold">{t.recentResearch}</h2>
            <Link to="/research" className="text-sm font-medium text-accent hover:underline">{texts.common.viewAll} →</Link>
          </div>
          <ul className="grid gap-3">
            {recent.map((r) => (
              <li key={r.id}>
                <Link to={`/research/${r.id}`} className="card lift group block">
                  <span className="text-xs font-semibold text-accent">{r.field} · {r.year}</span>
                  <span className="mt-1 block font-serif font-semibold leading-snug group-hover:text-accent">{r.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="recent-discussion">
          <div className="mb-4 flex items-end justify-between border-b-2 border-ink pb-2">
            <h2 id="recent-discussion" className="font-serif text-2xl font-bold">{t.recentDiscussion}</h2>
            <Link to="/discussion" className="text-sm font-medium text-accent hover:underline">{texts.common.viewAll} →</Link>
          </div>
          {/* limit(5)로 한 번만 읽음 */}
          <PostList pageSize={limits.homeRecentPosts} allowMore={false} />
        </section>
      </div>
    </>
  );
}
