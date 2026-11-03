import { texts } from '../config/texts';
import type { ExternalLink } from '../content/types';

export function ExternalLinks({ links }: { links: ExternalLink[] }) {
  if (links.length === 0) return null;
  return (
    <ul className="flex flex-col gap-2">
      {links.map((link) => (
        <li key={link.url}>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-accent underline underline-offset-2 hover:text-accent-dark"
          >
            <span className="rounded bg-accent-soft px-1.5 text-xs no-underline">{texts.links[link.type]}</span>
            {link.label}
            <span className="sr-only">(새 창에서 열림)</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
