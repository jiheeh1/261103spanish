import { Link, useParams } from 'react-router-dom';
import { ExternalLinks } from '../components/ExternalLinks';
import { PageTitle } from '../components/PageTitle';
import { PostList } from '../components/PostList';
import { texts } from '../config/texts';
import { findCourse } from '../content/courses';
import { courseKey } from '../lib/related';
import { NotFound } from './NotFound';

const t = texts.courses;

export function CourseDetail() {
  const { id = '' } = useParams();
  const course = findCourse(id);
  if (!course) return <NotFound message={t.notFound} />;
  const key = courseKey(course.id);
  const backHref = course.level === 'graduate' ? '/courses?level=graduate' : '/courses';

  return (
    <article>
      <Link to={backHref} className="text-sm text-accent hover:underline">← {texts.common.back}</Link>
      <p className="mt-4 text-sm text-muted">
        {course.level === 'graduate' ? t.graduate : t.undergraduate} · {course.semester}
      </p>
      <PageTitle title={course.title} />

      <section aria-labelledby="overview" className="mb-10">
        <h2 id="overview" className="mb-2 font-serif text-xl font-semibold">{t.overview}</h2>
        <p className="font-serif leading-8">{course.overview}</p>
      </section>

      <section aria-labelledby="weekly">
        <h2 id="weekly" className="mb-3 font-serif text-xl font-semibold">{t.weekly}</h2>
        <ol className="flex flex-col gap-3">
          {course.weeks.map((w) => (
            <li key={w.week} className="card p-4">
              <p className="font-medium">
                <span className="mr-2 text-accent">{t.week(w.week)}</span>
                {w.topic}
              </p>
              <div className="mt-2 text-sm">
                {w.links.length > 0 ? <ExternalLinks links={w.links} /> : <span className="text-muted">{t.noMaterials}</span>}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="related" className="mt-12 border-t border-line pt-8">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 id="related" className="font-serif text-xl font-semibold">{t.relatedDiscussion}</h2>
          <Link to={`/discussion/new?category=course&related=${encodeURIComponent(key)}`} className="btn-primary">
            {t.startDiscussion}
          </Link>
        </div>
        <PostList relatedKey={key} />
      </section>
    </article>
  );
}
