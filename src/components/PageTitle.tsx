import { useEffect, type ReactNode } from 'react';
import { site } from '../config/site';

/** 페이지 제목(h1) + 브라우저 탭 제목 */
export function PageTitle({ title, description, children }: { title: string; description?: string; children?: ReactNode }) {
  useEffect(() => {
    document.title = `${title} | ${site.siteName}`;
  }, [title]);
  return (
    <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="font-serif text-2xl font-bold leading-snug md:text-3xl">{title}</h1>
        {description && <p className="mt-2 text-muted">{description}</p>}
      </div>
      {children}
    </div>
  );
}
