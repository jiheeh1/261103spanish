import { Link, useSearchParams } from 'react-router-dom';
import { PageTitle } from '../components/PageTitle';
import { texts } from '../config/texts';
import { courses } from '../content/courses';
import type { CourseLevel } from '../content/types';

const t = texts.courses;
const tabs: { level: CourseLevel; label: string }[] = [
  { level: 'undergraduate', label: t.undergraduate },
  { level: 'graduate', label: t.graduate },
];

export function Courses() {
  // 선택한 탭을 주소(?level=graduate)에 남겨서 새로고침해도 유지
  const [params, setParams] = useSearchParams();
  const level: CourseLevel = params.get('level') === 'graduate' ? 'graduate' : 'undergraduate';
  const list = courses.filter((c) => c.level === level);

  return (
    <>
      <PageTitle title={t.title} description={t.description} />
      <div role="tablist" aria-label="과정 구분" className="mb-6 flex gap-2 border-b border-line">
        {tabs.map((tab) => {
          const active = tab.level === level;
          return (
            <button
              key={tab.level}
              type="button"
              role="tab"
              id={`tab-${tab.level}`}
              aria-selected={active}
              aria-controls="course-panel"
              className={`-mb-px border-b-2 px-4 py-2 ${active ? 'border-accent font-semibold text-accent' : 'border-transparent text-muted hover:text-ink'}`}
              onClick={() => setParams(tab.level === 'graduate' ? { level: 'graduate' } : {}, { replace: true })}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div id="course-panel" role="tabpanel" aria-labelledby={`tab-${level}`}>
        <ul className="grid gap-4 md:grid-cols-2">
          {list.map((c) => (
            <li key={c.id} className="card">
              <p className="text-sm text-muted">{c.semester}</p>
              <h2 className="mt-1 font-serif text-lg font-semibold">
                <Link to={`/courses/${c.id}`} className="hover:text-accent hover:underline">{c.title}</Link>
              </h2>
              <p className="mt-2 line-clamp-3 text-muted">{c.overview}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
