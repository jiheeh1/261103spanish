import { Link } from 'react-router-dom';
import { site } from '../config/site';
import { texts } from '../config/texts';

export function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-8 text-sm text-muted md:flex-row md:justify-between">
        <p>
          {site.professorName} · {site.department}
        </p>
        <p className="flex gap-4">
          <a href={`mailto:${site.contactEmail}`} className="hover:text-accent">
            {texts.footer.contact}
          </a>
          <Link to="/about#privacy" className="hover:text-accent">
            {texts.footer.privacy}
          </Link>
        </p>
      </div>
    </footer>
  );
}
