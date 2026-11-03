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
      <div role="tablist" aria-label="과정 구분" className="mb-8 inline-flex gap-1 rounded-full bg-sand p-1">
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
              className={`rounded-full px-6 py-2 text-sm ${active ? 'bg-accent font-semibold text-white shadow-sm' : 'text-muted hover:text-ink'}`}
              onClick={() => setParams(tab.level === 'graduate' ? { level: 'graduate' } : {}, { replace: true })}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div id="course-panel" role="tabpanel" aria-labelledby={`tab-${level}`}>
        <ul className="grid gap-5 md:grid-cols-2">
          {list.map((c) => (
            <li key={c.id} className="card lift group relative md:p-6">
              <p className="flex items-center justify-between text-sm">
                <span className="chip">{c.semester}</span>
                <span className="font-semibold text-accent">{c.weeks.length}주차 자료</span>
              </p>
              <h2 className="mt-4 font-serif text-xl font-bold leading-snug">
                <Link to={`/courses/${c.id}`} className="after:absolute after:inset-0 group-hover:text-accent">{c.title}</Link>
              </h2>
              <p className="mt-3 line-clamp-3 text-muted">{c.overview}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
