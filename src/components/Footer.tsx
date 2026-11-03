import { Link } from 'react-router-dom';
import { site } from '../config/site';
import { texts } from '../config/texts';

export function Footer() {
  return (
    <footer className="mt-20 bg-ink text-stone-300">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <p className="font-serif text-xl font-bold text-white">{site.siteName}</p>
          <p className="mt-2 text-sm">{site.professorName} · {site.department}</p>
        </div>
        <nav aria-label="바로가기">
          <ul className="space-y-2 text-sm">
            <li><Link to="/research" className="hover:text-white">{texts.nav.research}</Link></li>
            <li><Link to="/courses" className="hover:text-white">{texts.nav.courses}</Link></li>
            <li><Link to="/discussion" className="hover:text-white">{texts.nav.discussion}</Link></li>
          </ul>
        </nav>
        <ul className="space-y-2 text-sm">
          <li><a href={`mailto:${site.contactEmail}`} className="hover:text-white">{texts.footer.contact}</a></li>
          <li><Link to="/about#privacy" className="hover:text-white">{texts.footer.privacy}</Link></li>
        </ul>
      </div>
    </footer>
  );
}
