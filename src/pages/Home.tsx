import { Link } from 'react-router-dom';
import { PageTitle } from '../components/PageTitle';
import { PostList } from '../components/PostList';
import { limits } from '../config/limits';
import { site } from '../config/site';
import { texts } from '../config/texts';
import { research } from '../content/research';

export function Home() {
  // 최신 연도 순으로 3건
  const recent = [...research].sort((a, b) => b.year - a.year).slice(0, limits.homeRecentResearch);
  return (
    <>
      <PageTitle title={site.siteName} />
      <section className="mb-12 card md:p-8">
        <p className="font-serif text-lg font-semibold">
          {site.professorName} <span className="font-sans text-base font-normal text-muted">· {site.department}</span>
        </p>
        <p className="mt-3 font-serif leading-8">{site.intro}</p>
      </section>

      <div className="grid gap-10 md:grid-cols-2">
        <section aria-labelledby="recent-research">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 id="recent-research" className="font-serif text-xl font-semibold">{texts.home.recentResearch}</h2>
            <Link to="/research" className="text-sm text-accent hover:underline">{texts.common.viewAll}</Link>
          </div>
          <ul>
            {recent.map((r) => (
              <li key={r.id} className="border-b border-line py-4 last:border-b-0">
                <Link to={`/research/${r.id}`} className="group block">
                  <span className="font-medium group-hover:text-accent group-hover:underline">{r.title}</span>
                  <span className="mt-1 block text-sm text-muted">{r.field} · {r.year}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="recent-discussion">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 id="recent-discussion" className="font-serif text-xl font-semibold">{texts.home.recentDiscussion}</h2>
            <Link to="/discussion" className="text-sm text-accent hover:underline">{texts.common.viewAll}</Link>
          </div>
          {/* limit(5)로 한 번만 읽음 */}
          <PostList pageSize={limits.homeRecentPosts} allowMore={false} />
        </section>
      </div>
    </>
  );
}
