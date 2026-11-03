import { PageTitle } from '../components/PageTitle';
import { site } from '../config/site';
import { texts } from '../config/texts';

const t = texts.about;

export function About() {
  return (
    <>
      <PageTitle title={t.title} />
      <section className="mb-10">
        <p className="font-serif text-xl font-semibold">{site.professorName}</p>
        <p className="text-muted">{site.department}</p>
        <p className="mt-4 font-serif leading-8">{site.intro}</p>
      </section>

      <section aria-labelledby="bio" className="mb-10">
        <h2 id="bio" className="mb-3 font-serif text-xl font-semibold">{t.biography}</h2>
        <ul className="list-disc pl-6">
          {site.biography.map((line) => <li key={line}>{line}</li>)}
        </ul>
      </section>

      <section aria-labelledby="contact" className="mb-10">
        <h2 id="contact" className="mb-3 font-serif text-xl font-semibold">{t.contact}</h2>
        <a href={`mailto:${site.contactEmail}`} className="text-accent underline underline-offset-2">
          {site.contactEmail}
        </a>
      </section>

      {/* 푸터의 "개인정보 안내" 링크(/about#privacy)가 이곳으로 옵니다 */}
      <section id="privacy" aria-labelledby="privacy-heading" className="card scroll-mt-8">
        <h2 id="privacy-heading" className="mb-3 font-serif text-xl font-semibold">{t.privacyTitle}</h2>
        <p className="text-muted">{t.privacyBody}</p>
      </section>
    </>
  );
}
