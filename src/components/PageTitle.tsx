import { useEffect, type ReactNode } from 'react';
import { site } from '../config/site';

/** 페이지 제목(h1) + 브라우저 탭 제목. 제목 위에 짧은 포인트 선을 둡니다. */
export function PageTitle({ title, description, eyebrow, children }: { title: string; description?: string; eyebrow?: string; children?: ReactNode }) {
  useEffect(() => {
    document.title = `${title} | ${site.siteName}`;
  }, [title]);
  return (
    <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <span className="rule mb-4 mt-3" aria-hidden="true" />
        {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
        <h1 className="font-serif text-3xl font-bold leading-tight tracking-tight md:text-4xl">{title}</h1>
        {description && <p className="mt-3 max-w-2xl text-lg text-muted">{description}</p>}
      </div>
      {children}
    </div>
  );
}
